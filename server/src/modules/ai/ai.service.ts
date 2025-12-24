import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY') || 'AIzaSyBjegQYJXXSYXF37gwN3xlPS_xy2g1d8tY';
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        } else {
            console.warn('GEMINI_API_KEY is not set. AI features will not work.');
        }
    }

    async generateQuestion(topic: string, difficulty: string, type: string = 'mcq'): Promise<any> {
        if (!this.model) {
            throw new Error('AI Model not initialized. Check API Key.');
        }

        let formatInstructions = '';
        switch (type) {
            case 'mcq':
                formatInstructions = '"options": ["A", "B", "C", "D"], "correctAnswer": "The option text"';
                break;
            case 'true_false':
                formatInstructions = '"options": ["True", "False"], "correctAnswer": "True" or "False"';
                break;
            case 'fill_in_the_blank':
                formatInstructions = '"correctAnswer": "The missing word", "text": "Sentence with _____ for blank"';
                break;
            case 'short_answer':
                formatInstructions = '"correctAnswer": "The exact answer string"';
                break;
            case 'long_answer':
                formatInstructions = '"correctAnswer": "Key points that should be in the answer"';
                break;
            case 'code':
                formatInstructions = '"codeSnippet": "Initial code or boilerplate", "correctAnswer": "Solution code or expected output"';
                break;
            default:
                formatInstructions = '"correctAnswer": "The answer"';
        }

        const prompt = `Generate 1 ${difficulty} level "${type}" question on the topic "${topic}".
    Return ONLY a valid JSON object with this structure:
    {
      "title": "Short title for the question",
      "description": "Brief description of the concept",
      "text": "Question text here (include _____ for fill_in_the_blank)",
      "type": "${type}",
      ${formatInstructions},
      "explanation": "Why it is correct",
      "points": 1,
      "timer": 60
    }`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Basic cleanup to ensure JSON
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error('AI Generation Failed:', error);
            throw error;
        }
    }

    async generateExamBlueprint(topic: string, difficulty: string, totalQuestions: number, types: string[]): Promise<any[]> {
        if (!this.model) {
            throw new Error('AI Model not initialized. Check API Key.');
        }

        const prompt = `Plan a ${difficulty} level exam on "${topic}" with exactly ${totalQuestions} questions.
        Allowed question types: ${JSON.stringify(types)}.
        
        Decide the distribution of question types to make a balanced exam.
        Return ONLY a valid JSON array of objects where each object represents a question to be generated:
        [
            { "type": "mcq", "topic": "specific subtest topic" },
            { "type": "code", "topic": "specific subtest topic" }
        ]
        The array length must be exactly ${totalQuestions}.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const plan = JSON.parse(jsonStr);

            // Validate count
            if (Array.isArray(plan) && plan.length > 0) {
                return plan.slice(0, totalQuestions);
            }
            // Fallback if AI fails to return array
            return types.map(t => ({ type: t, topic }));
        } catch (error) {
            console.error('AI Planning Failed:', error);
            // Fallback
            return Array(totalQuestions).fill(null).map((_, i) => ({
                type: types[i % types.length],
                topic: topic
            }));
        }
    }
    async gradeExam(questions: any[], userAnswers: Record<string, string>): Promise<any[]> {
        if (!this.model) {
            console.warn('AI Model not initialized. Fallback to auto-grading.');
            return [];
        }

        const gradingRequests = questions.map(q => {
            const userAnswer = userAnswers[q._id.toString()] || 'No answer provided';
            return {
                questionId: q._id,
                text: q.text,
                correctAnswer: q.correctAnswer,
                userAnswer: userAnswer,
                points: q.points || 1,
                type: q.type
            };
        });

        // Batch grading or single prompt? Batch is better for context windown but let's do single prompt for now to ensure JSON structure.
        // Actually, for 5-10 questions, single prompt is fine.

        const prompt = `You are an expert examiner. Grade the following student answers.
        
        Format your response as a JSON array of objects with this structure:
        [
            {
                "questionId": "id from input",
                "score": number (0 to max points),
                "feedback": "Brief explanation of the score"
            }
        ]

        Questions to grade:
        ${JSON.stringify(gradingRequests, null, 2)}
        
        Strictly return ONLY valid JSON.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const grades = JSON.parse(jsonStr);

            return grades;
        } catch (error) {
            console.error('AI Grading Failed:', error);
            // Fallback: return empty array, service will handle fallback grading
            return [];
        }
    }
}
