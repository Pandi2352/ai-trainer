import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content, ContentDocument } from './schemas/content.schema';
import { extractTextFromFile } from './file-utils';
import * as fs from 'fs/promises';

@Injectable()
export class ContentService {
    constructor(
        @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
    ) { }

    async uploadFile(file: Express.Multer.File, domainId?: string): Promise<Content> {
        try {
            // 1. Extract Text
            const extractedText = await extractTextFromFile(file);

            // 2. Save metadata to DB
            const content = new this.contentModel({
                filename: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                path: file.path,
                extractedText: extractedText,
                status: 'processed',
                domain: domainId, // Optional: Link to a domain
            });

            return await content.save();
        } catch (error) {
            // Cleanup file if DB save fails, logic can be added here
            throw error;
        }
    }

    async findAll(): Promise<Content[]> {
        return this.contentModel.find().exec();
    }

    async findOne(id: string): Promise<Content> {
        const content = await this.contentModel.findById(id).exec();
        if (!content) throw new NotFoundException('Content not found');
        return content;
    }
}
