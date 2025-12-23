import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';

@ApiTags('questions')
@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @Post()
    @Roles('admin')
    @ApiOperation({ summary: 'Create a question manually' })
    create(@Body() createQuestionDto: any) {
        return this.questionsService.create(createQuestionDto);
    }

    @Post('generate')
    @Roles('admin')
    @ApiOperation({ summary: 'Generate a question using AI' })
    generate(@Body() body: { topic: string; difficulty: string; type: string }) {
        return this.questionsService.generateWithAI(body.topic, body.difficulty, body.type);
    }

    @Get()
    @Roles('admin', 'user') // Users might need to see questions during exam (though usually via Exam endpoints)
    @ApiOperation({ summary: 'Get all questions' })
    findAll() {
        return this.questionsService.findAll();
    }

    @Get(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Get a question by ID' })
    findOne(@Param('id') id: string) {
        return this.questionsService.findOne(id);
    }

    @Patch(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Update a question' })
    update(@Param('id') id: string, @Body() updateQuestionDto: any) {
        return this.questionsService.update(id, updateQuestionDto);
    }

    @Delete(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Delete a question' })
    remove(@Param('id') id: string) {
        return this.questionsService.remove(id);
    }
}
