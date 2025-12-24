import { Controller, Get, Post, Body, UseGuards, Request, Query, Param } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('assignments')
@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) { }

    @Post()
    @Roles('admin')
    @ApiOperation({ summary: 'Assign exam to multiple users' })
    assignExam(@Body() body: { examId: string; userIds: string[]; deadline: Date }, @Request() req) {
        return this.assignmentsService.assignExamToUsers(body.examId, body.userIds, body.deadline, req.user.userId);
    }

    @Get('my')
    @Roles('trainee', 'admin')
    @ApiOperation({ summary: 'Get assignments for current user' })
    getMyAssignments(@Request() req) {
        return this.assignmentsService.findMyAssignments(req.user.userId);
    }

    @Get(':id')
    @Roles('trainee', 'admin')
    @ApiOperation({ summary: 'Get single assignment details' })
    getAssignment(@Param('id') id: string, @Request() req) {
        return this.assignmentsService.getAssignmentById(id, req.user.userId);
    }

    @Get()
    @Roles('admin')
    @ApiOperation({ summary: 'Get all assignments (Admin only)' })
    findAll(@Query() query: any) {
        return this.assignmentsService.findAll(query);
    }

    @Get('exam/:examId')
    @Roles('admin')
    @ApiOperation({ summary: 'Get assignments by exam ID' })
    getByExamId(@Param('examId') examId: string, @Query() query: any) {
        return this.assignmentsService.findByExamId(examId, query);
    }

    @Get('analytics/:examId')
    @Roles('admin')
    @ApiOperation({ summary: 'Get exam analytics' })
    getExamAnalytics(@Param('examId') examId: string) {
        return this.assignmentsService.getExamAnalytics(examId);
    }

    @Post(':id/submit')
    @Roles('trainee')
    @ApiOperation({ summary: 'Submit an exam assignment' })
    submitExam(@Param('id') id: string, @Body() body: { answers: Record<string, string> }, @Request() req) {
        return this.assignmentsService.submitExam(id, body.answers, req.user.userId);
    }
}
