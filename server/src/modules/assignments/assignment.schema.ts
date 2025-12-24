import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Exam } from '../exams/exam.schema';

export type AssignmentDocument = Assignment & Document;

@Schema({ timestamps: true })
export class Assignment {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Exam', required: true })
    exam: Exam;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    assignedTo: User;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    assignedBy: User;

    @Prop({ required: true, enum: ['pending', 'in-progress', 'submitted', 'overdue', 'completed'], default: 'pending' })
    status: string;

    @Prop({ required: true })
    deadline: Date;

    @Prop()
    score: number;

    @Prop()
    completedAt: Date;

    @Prop({ type: Object })
    answers: Record<string, string>; // questionId -> answer

    @Prop({ type: [{ questionId: String, score: Number, feedback: String }] })
    results: any[];
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
