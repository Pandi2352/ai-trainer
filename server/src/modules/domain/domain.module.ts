import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Domain, DomainSchema } from './schemas/domain.schema';
import { Topic, TopicSchema } from './schemas/topic.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Domain.name, schema: DomainSchema },
            { name: Topic.name, schema: TopicSchema },
        ]),
    ],
})
export class DomainModule { }
