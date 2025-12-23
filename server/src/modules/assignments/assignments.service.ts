import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment, AssignmentDocument } from './assignment.schema';

@Injectable()
export class AssignmentsService {
    constructor(
        @InjectModel(Assignment.name) private assignmentModel: Model<AssignmentDocument>,
    ) { }

    async assignExamToUsers(examId: string, userIds: string[], deadline: Date, adminId: string) {
        const assignments = userIds.map(userId => ({
            exam: examId,
            assignedTo: userId,
            assignedBy: adminId,
            deadline: deadline,
            status: 'pending'
        }));

        return this.assignmentModel.insertMany(assignments);
    }

    async findMyAssignments(userId: string) {
        return this.assignmentModel.find({ assignedTo: userId } as any)
            .populate('exam')
            .populate('assignedBy', 'name email')
            .sort({ deadline: 1 })
            .exec();
    }

    async findAll(query: any = {}) {
        const { page = 1, limit = 10, status } = query;
        const skip = (page - 1) * limit;
        const filter: any = {};
        if (status) filter.status = status;

        const [data, total] = await Promise.all([
            this.assignmentModel.find(filter)
                .populate('exam')
                .populate('assignedTo', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .exec(),
            this.assignmentModel.countDocuments(filter).exec()
        ]);

        return {
            data,
            meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }
        };
    }

    async findByExamId(examId: string, query: any = {}) {
        const { page = 1, limit = 10, status, search } = query;
        const skip = (page - 1) * limit;
        const filter: any = { exam: examId };

        if (status) filter.status = status;
        // complex search on populated fields (assignedTo.name) is harder in basic Mongo, 
        // sticking to simple filters for now or assuming search is handled differently if needed.

        const [data, total] = await Promise.all([
            this.assignmentModel.find(filter)
                .populate('assignedTo', 'name email')
                .skip(skip)
                .limit(Number(limit))
                .sort({ createdAt: -1 })
                .exec(),
            this.assignmentModel.countDocuments(filter).exec()
        ]);

        return {
            data,
            meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }
        };
    }
}
