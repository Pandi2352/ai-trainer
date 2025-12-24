import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification, NotificationSchema } from './notification.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService],
    exports: [NotificationsService] // Exported so AssignmentsModule can use it
})
export class NotificationsModule { }
