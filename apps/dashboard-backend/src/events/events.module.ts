import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventSchema } from './schemas/events.schema';
import { HttpModule } from '@nestjs/axios';
import { ExternalService } from '../external/external.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService, ExternalService],
})
export class EventsModule {}
