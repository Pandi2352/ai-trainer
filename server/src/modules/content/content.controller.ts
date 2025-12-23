import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Get,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentService } from './content.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Content')
@ApiBearerAuth()
@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(pdf|docx)$/)) {
                    return callback(new Error('Only PDF and DOCX documents are allowed!'), false);
                }
                callback(null, true);
            },
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                domainId: {
                    type: 'string',
                    description: 'Optional Domain ID to associate content with'
                }
            },
        },
    })
    @ApiOperation({ summary: 'Upload file (PDF/DOCX) and extract text (Admin only)' })
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('domainId') domainId?: string) {
        if (!file) throw new Error('File is required');
        return this.contentService.uploadFile(file, domainId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'List all content' })
    async findAll() {
        return this.contentService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get content by ID' })
    async findOne(@Param('id') id: string) {
        return this.contentService.findOne(id);
    }
}
