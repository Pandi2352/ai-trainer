import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Domain } from './domain.schema';

export type TopicDocument = Topic & Document;

@Schema({ timestamps: true })
export class Topic {
    @Prop({ required: true })
    name: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Domain', required: true })
    domain: Domain;

    @Prop()
    description: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
