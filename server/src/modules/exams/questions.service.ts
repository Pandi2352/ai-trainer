import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './question.schema';
import { AiService } from '../ai/ai.service';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
        private aiService: AiService
    ) { }

    async create(createQuestionDto: any): Promise<Question> {
        const newQuestion = new this.questionModel(createQuestionDto);
        return newQuestion.save();
    }

    async findAll(): Promise<Question[]> {
        return this.questionModel.find().sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Question> {
        const question = await this.questionModel.findById(id).exec();
        if (!question) throw new NotFoundException('Question not found');
        return question;
    }

    async update(id: string, updateQuestionDto: any): Promise<Question> {
        const updatedQuestion = await this.questionModel
            .findByIdAndUpdate(id, updateQuestionDto, { new: true })
            .exec();
        if (!updatedQuestion) throw new NotFoundException('Question not found');
        return updatedQuestion;
    }

    async remove(id: string): Promise<void> {
        const result = await this.questionModel.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('Question not found');
    }

    async generateWithAI(topic: string, difficulty: string, type: string): Promise<any> {
        return this.aiService.generateQuestion(topic, difficulty, type);
    }
}
