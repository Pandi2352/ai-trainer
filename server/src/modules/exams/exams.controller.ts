import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';

@ApiTags('exams')
@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExamsController {
    constructor(private readonly examsService: ExamsService) { }

    @Post()
    @Roles('admin')
    @ApiOperation({ summary: 'Create an exam manually' })
    create(@Body() createExamDto: any, @Request() req) {
        return this.examsService.create(createExamDto, req.user.userId);
    }

    @Post('generate')
    @Roles('admin')
    @ApiOperation({ summary: 'Generate an exam using AI' })
    generate(@Body() config: {
        topic: string;
        difficulty: string;
        totalQuestions: number;
        totalMarks: number;
        types: string[];
    }, @Request() req) {
        return this.examsService.generateExam(config, req.user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all exams with pagination' })
    findAll(@Query() query: any) {
        return this.examsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get exam by ID' })
    findOne(@Param('id') id: string) {
        return this.examsService.findOne(id);
    }
}
