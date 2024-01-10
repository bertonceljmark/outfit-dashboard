import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { success, fail } from '../helpers/helper';
import { MutateEventDto } from './events.dto';
import { validateSave } from './validator';
import { ExternalService } from '../external/external.service';
import { IEvent } from './interfaces/events.interface';
import { IAdsAllowed } from 'src/external/interfaces/external.interface';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly externalService: ExternalService,
  ) {}

  @Post()
  async addEvent(@Body() MutateEventDto: MutateEventDto) {
    const { name, description, type, priority, countryCode } = MutateEventDto;

    const errors = validateSave(name, description, type, priority);

    if (errors.length > 0) {
      return fail(errors);
    }

    const isCreationPossible = await this.isCreationPossible(type, countryCode);

    if (!isCreationPossible.allowed) {
      return fail([isCreationPossible.error]);
    }

    const data = await this.eventsService.insertEvent(
      name,
      description,
      type as IEvent['type'],
      priority,
    );

    return success(data);
  }

  @Get()
  async getAllEvents() {
    const events = await this.eventsService.getEvents();
    return success(events);
  }

  @Get(':search')
  async getBySearch(@Param('search') search: string) {
    const events = await this.eventsService.getEventsBySearch(search);

    return success(events);
  }

  @Patch(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() MutateEventDto: MutateEventDto,
  ) {
    const { name, description, type, priority, countryCode } = MutateEventDto;

    const errors = validateSave(name, description, type, priority);

    if (errors.length > 0) {
      return fail(errors);
    }

    const isCreationPossible = await this.isCreationPossible(type, countryCode);

    if (!isCreationPossible.allowed) {
      return fail([isCreationPossible.error]);
    }

    const result = await this.eventsService.updateEvent(id, {
      name,
      description,
      type,
      priority,
    } as IEvent);

    return success(result);
  }

  @Delete(':id')
  async removeEvent(@Param('id') id: string) {
    const deletedId = await this.eventsService.deleteEvent(id);

    if (!deletedId) {
      return fail(['Event not found']);
    }

    return success(deletedId);
  }

  async isCreationPossible(
    type: string,
    countryCode: string,
  ): Promise<IAdsAllowed> {
    if (type !== 'ads') return { allowed: true, error: null };

    return await this.externalService.checkAdCreation(countryCode);
  }
}
