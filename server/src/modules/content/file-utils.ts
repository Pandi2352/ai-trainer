import * as fs from 'fs';
const pdf = require('pdf-parse');
import * as mammoth from 'mammoth';

export const extractTextFromFile = async (file: Express.Multer.File): Promise<string> => {
    const filePath = file.path;

    try {
        if (file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } else if (
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } else {
            throw new Error('Unsupported file type');
        }
    } catch (error) {
        throw new Error(`Failed to extract text: ${error.message}`);
    }
};
