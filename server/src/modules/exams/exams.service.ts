import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam, ExamDocument } from './exam.schema';
import { Question, QuestionDocument } from './question.schema';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ExamsService {
    constructor(
        @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
        @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
        private aiService: AiService,
    ) { }

    async create(createExamDto: any, userId: string): Promise<Exam> {
        const exam = new this.examModel({
            ...createExamDto,
            createdBy: userId,
        });
        return exam.save();
    }

    async findAll(query: any = {}): Promise<any> {
        const { page = 1, limit = 10, search, domain, difficulty } = query;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { domain: { $regex: search, $options: 'i' } }
            ];
        }
        if (domain) filter.domain = domain;
        if (difficulty) filter.difficulty = difficulty;

        const [exams, total] = await Promise.all([
            this.examModel.find(filter)
                .populate('questions')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .exec(),
            this.examModel.countDocuments(filter).exec()
        ]);

        return {
            data: exams,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        };
    }

    async findOne(id: string): Promise<Exam> {
        const exam = await this.examModel.findById(id).populate('questions').exec();
        if (!exam) throw new NotFoundException('Exam not found');
        return exam;
    }

    async generateExam(config: {
        topic: string;
        difficulty: string;
        totalQuestions: number;
        totalMarks: number;
        types: string[];
    }, userId: string) {
        const { topic, difficulty, totalQuestions, totalMarks, types } = config;

        // 1. Create Initial Exam with 'generating' status
        const newExam = new this.examModel({
            title: `${topic} Assessment (${difficulty})`,
            description: `A ${difficulty} level assessment on ${topic}. Generation in progress...`,
            domain: topic,
            difficulty: difficulty,
            totalMarks: totalMarks,
            questions: [],
            createdBy: userId,
            generationConfig: config,
            status: 'generating'
        });

        await newExam.save();

        // 2. Start Background Generation (Async)
        this.generateQuestionsInBackground(newExam._id, config);

        return newExam;
    }

    private async generateQuestionsInBackground(examId: any, config: any) {
        try {
            const { topic, difficulty, totalQuestions, types } = config;
            const blueprint = await this.aiService.generateExamBlueprint(topic, difficulty, totalQuestions, types);

            // Generate questions sequentially or with limited concurrency to update DB incrementally
            for (const bp of blueprint) {
                try {
                    const questionData = await this.aiService.generateQuestion(bp.topic || topic, difficulty, bp.type);

                    const newQuestion = new this.questionModel({
                        ...questionData,
                        domain: topic,
                        difficulty: difficulty,
                        type: bp.type,
                        tags: [topic, difficulty, 'ai-generated', 'exam-auto'],
                        aiGenerated: true,
                    });

                    await newQuestion.save();

                    // Push to Exam
                    await this.examModel.findByIdAndUpdate(examId, {
                        $push: { questions: newQuestion._id }
                    });

                } catch (err) {
                    console.error(`Failed to generate a question for exam ${examId}`, err);
                }
            }

            // Mark as Completed
            await this.examModel.findByIdAndUpdate(examId, {
                status: 'completed',
                description: `A ${difficulty} level assessment on ${topic} comprising ${totalQuestions} questions.`
            });

        } catch (error) {
            console.error(`Exam generation failed for ${examId}`, error);
            await this.examModel.findByIdAndUpdate(examId, { status: 'failed' });
        }
    }
}
