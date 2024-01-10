import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/events.schema';
import { IEvent } from './interfaces/events.interface';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<Event>,
  ) {}

  async insertEvent(
    name: IEvent['name'],
    description: IEvent['description'],
    type: IEvent['type'],
    priority: IEvent['priority'],
  ): Promise<IEvent> {
    const result = await this.eventModel.create({
      name,
      description,
      type,
      priority,
    });

    const mappedResult = {
      id: result._id as string,
      name: result.name,
      description: result.description,
      type: result.type,
      priority: result.priority,
    };

    return mappedResult;
  }

  async getEvents(): Promise<IEvent[]> {
    const events = await this.eventModel.find().exec();

    const mappedResult = events.map((event) => ({
      id: event._id as string,
      name: event.name,
      description: event.description,
      type: event.type,
      priority: event.priority,
    }));

    return mappedResult;
  }

  async getEventsBySearch(search: string): Promise<IEvent[]> {
    const events = await this.eventModel
      .find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      })
      .exec();

    const mappedResult = events.map((event) => ({
      id: event._id as string,
      name: event.name,
      description: event.description,
      type: event.type,
      priority: event.priority,
    }));

    return mappedResult;
  }

  async updateEvent(
    eventId: string,
    updateData: Partial<IEvent>,
  ): Promise<IEvent> {
    const result = await this.eventModel.findOneAndUpdate(
      { _id: eventId },
      updateData,
      { new: true },
    );

    const mappedResult = {
      id: result._id as string,
      name: result.name,
      description: result.description,
      type: result.type,
      priority: result.priority,
    };

    return mappedResult;
  }

  async deleteEvent(prodId: string): Promise<{ id: string }> {
    const result = await this.eventModel.deleteOne({ _id: prodId }).exec();

    return result.deletedCount > 0 ? { id: prodId } : null;
  }
}
