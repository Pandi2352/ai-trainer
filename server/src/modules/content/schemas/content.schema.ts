import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContentDocument = Content & Document;

@Schema({ timestamps: true })
export class Content {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  path: string;

  @Prop()
  extractedText: string;

  @Prop({ default: 'pending' })
  status: string; // pending, processed, error
}

export const ContentSchema = SchemaFactory.createForClass(Content);
