import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/schemas/user.schema';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: User; // The recipient of the notification

    @Prop({ required: true })
    message: string;

    @Prop({ required: true, enum: ['info', 'success', 'warning', 'error'], default: 'info' })
    type: string;

    @Prop({ default: false })
    isRead: boolean;

    @Prop()
    link: string; // Optional link to navigate to (e.g., /trainee/exam/123)

    @Prop({ type: Object })
    metadata: any; // Extra data if needed
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
