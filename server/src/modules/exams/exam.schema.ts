import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Question } from './question.schema';

export type ExamDocument = Exam & Document;

@Schema({ timestamps: true })
export class Exam {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Question' }] })
    questions: Question[];

    @Prop({ required: true, default: 0 })
    totalMarks: number;

    @Prop({ default: 0 })
    passingMarks: number;

    @Prop({ default: 60 }) // in minutes
    duration: number;

    @Prop({ required: true })
    domain: string;

    @Prop({ required: true })
    difficulty: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    createdBy: User;

    @Prop({ type: Object })
    generationConfig: any; // Store the params used to generate this

    @Prop({ required: true, enum: ['generating', 'completed', 'failed'], default: 'generating' })
    status: string;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
