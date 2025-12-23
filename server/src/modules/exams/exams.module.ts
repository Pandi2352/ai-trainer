import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './exam.schema';
import { Question, QuestionSchema } from './question.schema';
import { AiModule } from '../ai/ai.module';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Exam.name, schema: ExamSchema },
            { name: Question.name, schema: QuestionSchema }
        ]),
        AiModule,
    ],
    controllers: [ExamsController, QuestionsController],
    providers: [ExamsService, QuestionsService],
    exports: [ExamsService, QuestionsService],
})
export class ExamsModule { }
