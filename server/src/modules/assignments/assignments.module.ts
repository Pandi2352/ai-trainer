import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { Assignment, AssignmentSchema } from './assignment.schema';
import { ExamsModule } from '../exams/exams.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AiModule } from '../ai/ai.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Assignment.name, schema: AssignmentSchema }]),
        ExamsModule,
        UsersModule,
        NotificationsModule,
        AiModule
    ],
    controllers: [AssignmentsController],
    providers: [AssignmentsService],
    exports: [AssignmentsService]
})
export class AssignmentsModule { }
