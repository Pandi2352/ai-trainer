import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DomainDocument = Domain & Document;

@Schema({ timestamps: true })
export class Domain {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ default: true })
    isActive: boolean;
}



export const DomainSchema = SchemaFactory.createForClass(Domain);
