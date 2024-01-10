import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { IEvent } from './interfaces/events.interface';
import { Model, Query } from 'mongoose';
import { Event } from './schemas/events.schema';
import { getModelToken } from '@nestjs/mongoose';

const mockEvent = (
  name = 'event name',
  description = 'event description',
  type = 'app' as IEvent['type'],
  priority = 1,
  id = 'testId',
): IEvent => ({
  name,
  description,
  type,
  priority,
  id,
});

const mockEventDoc = (mock?: Partial<Event>): Partial<Event> => ({
  name: mock?.name || 'event name',
  description: mock?.description || 'event description',
  type: mock?.type || 'app',
  priority: mock?.priority || 1,
  _id: mock?.id || 'testId',
});

const eventArray = [
  mockEvent(),
  mockEvent('event name 2', 'event description 2', 'app', 2),
  mockEvent('event name 3', 'event description 3', 'liveops', 3),
];

const eventDocArray: Partial<Event>[] = [
  mockEventDoc(),
  mockEventDoc({
    name: 'event name 2',
    description: 'event description 2',
    type: 'app',
    priority: 2,
    _id: 'testId2',
  }),
  mockEventDoc({
    _id: 'testId3',
    name: 'event name 3',
    description: 'event description 3',
    type: 'liveops',
    priority: 3,
  }),
];

describe('EventsService', () => {
  let service: EventsService;
  let model: Model<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken('Event'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockEvent()),
            constructor: jest.fn().mockResolvedValue(mockEvent()),
            find: jest.fn(),
            findOneAndUpdate: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    model = module.get<Model<Event>>(getModelToken('Event'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all events', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(eventDocArray),
    } as unknown as Query<Event[], Event>);

    const events = await service.getEvents();

    expect(events).toEqual(eventArray);
  });

  it('should get multiple by search', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(eventDocArray),
    } as unknown as Query<Event[], Event>);

    const events = await service.getEventsBySearch('event');

    expect(events).toEqual(eventArray);
  });

  it('should insert a new event', async () => {
    jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockEventDoc()) as any);

    const event = await service.insertEvent(
      'event name',
      'event description',
      'app',
      1,
    );

    expect(event).toEqual(mockEvent());
  });

  it('should update an event', async () => {
    jest
      .spyOn(model, 'findOneAndUpdate')
      .mockImplementationOnce(
        () => Promise.resolve(mockEventDoc({ name: 'updated name' })) as any,
      );

    const event = await service.updateEvent('testId', {
      name: 'event name',
      description: 'event description',
      type: 'app',
      priority: 1,
    });

    expect(event).toEqual(mockEvent('updated name'));
  });

  it('should delete an event', async () => {
    jest.spyOn(model, 'deleteOne').mockReturnValue({
      exec: jest
        .fn()
        .mockResolvedValueOnce({ deletedCount: 1, acknowledged: true }),
    } as unknown as any);

    const deletedId = await service.deleteEvent('testId');

    expect(deletedId).toEqual({ id: 'testId' });
  });

  it('should return null if delete count is 0', async () => {
    jest.spyOn(model, 'deleteOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({ deletedCount: 0 }),
    } as unknown as any);

    const deletedId = await service.deleteEvent('testId');

    expect(deletedId).toEqual(null);
  });
});
