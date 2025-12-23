import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { Assignment, AssignmentSchema } from './assignment.schema';
import { ExamsModule } from '../exams/exams.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Assignment.name, schema: AssignmentSchema }]),
        ExamsModule,
        UsersModule
    ],
    controllers: [AssignmentsController],
    providers: [AssignmentsService],
    exports: [AssignmentsService]
})
export class AssignmentsModule { }
