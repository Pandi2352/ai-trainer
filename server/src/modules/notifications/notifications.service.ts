import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    ) { }

    async create(data: { userId: string; message: string; type?: string; link?: string; metadata?: any }) {
        const notification = new this.notificationModel(data);
        return notification.save();
    }

    async findMyNotifications(userId: string) {
        return this.notificationModel.find({ userId } as any)
            .sort({ createdAt: -1 })
            .limit(20)
            .exec();
    }

    async markAsRead(id: string, userId: string) {
        return this.notificationModel.findOneAndUpdate(
            { _id: id, userId } as any,
            { isRead: true },
            { new: true }
        );
    }

    async markAllAsRead(userId: string) {
        return this.notificationModel.updateMany(
            { userId, isRead: false } as any,
            { isRead: true }
        );
    }

    async getUnreadCount(userId: string) {
        return this.notificationModel.countDocuments({ userId, isRead: false } as any);
    }
}
