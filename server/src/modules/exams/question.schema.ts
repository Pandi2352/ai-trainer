import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    text: string;

    @Prop({
        required: true,
        enum: ['mcq', 'true_false', 'fill_in_the_blank', 'short_answer', 'long_answer', 'code'],
        default: 'mcq'
    })
    type: string;

    @Prop({ type: [String] })
    options: string[]; // For MCQ

    @Prop()
    correctAnswer: string; // For MCQ

    @Prop({ default: 1 })
    points: number;

    @Prop({ default: 60 })
    timer: number; // In seconds

    @Prop({ enum: ['easy', 'medium', 'hard'], default: 'medium' })
    difficulty: string;

    @Prop()
    domain: string; // e.g. 'Frontend', 'Backend'

    @Prop({ type: [String] })
    tags: string[];

    // --- AI & Enhanced Fields ---

    @Prop()
    explanation: string; // Reasoning for the correct answer

    @Prop({ default: false })
    aiGenerated: boolean;

    @Prop()
    codeSnippet: string; // For 'code' type questions

    @Prop({ type: Object })
    metadata: any; // Store extra AI parameters or raw response
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
