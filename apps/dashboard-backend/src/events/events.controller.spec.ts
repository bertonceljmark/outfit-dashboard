import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ExternalService } from '../external/external.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { MutateEventDto } from './events.dto';

const event: MutateEventDto = {
  name: 'event name',
  description: 'event description',
  type: 'app',
  priority: 1,
  countryCode: 'SI',
};

const resolvedValue = {
  ...event,
  _id: 'returnedId',
};

const response = {
  data: {
    name: 'event name',
    description: 'event description',
    type: 'app',
    priority: 1,
    id: 'returnedId',
  },
};

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [EventsController],
      providers: [
        EventsService,
        ExternalService,
        {
          provide: getModelToken('Event'),
          useValue: {
            create: jest.fn().mockImplementation(() => resolvedValue),
            find: () => ({
              exec: jest.fn().mockImplementation(() => [resolvedValue]),
            }),
            findOne: jest.fn().mockResolvedValue(resolvedValue),
            findOneAndUpdate: jest
              .fn()
              .mockResolvedValue({ ...resolvedValue, name: 'updated name' }),
            deleteOne: () => ({
              exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
            }),
          },
        },
        {
          provide: ExternalService,
          useValue: {
            checkAdCreation: jest.fn().mockResolvedValue({
              allowed: false,
              error: 'Ad creation not possible',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create event', () => {
    it('should create event', async () => {
      const retured = await controller.addEvent(event);

      expect(retured).toStrictEqual(response);
    });

    it('should fail because required fields', async () => {
      const emptyEvent = {};
      const errorRespose = {
        message: [
          'Name is required',
          'Description is required',
          'Type is required',
          'Priority is required',
        ],
        data: null,
      };

      const returned = await controller.addEvent(emptyEvent);
      expect(returned).toStrictEqual(errorRespose);
    });

    it('should fail because invalid type', async () => {
      const invalidEvent = {
        ...event,
        type: 'invalid',
      };
      const errorRespose = {
        message: ['Invalid type'],
        data: null,
      };

      const returned = await controller.addEvent(invalidEvent);
      expect(returned).toStrictEqual(errorRespose);
    });

    it('should fail because invalid priority', async () => {
      const invalidEvent = {
        ...event,
        priority: 11,
      };
      const errorRespose = {
        message: ['Priority must be between 1 and 10'],
        data: null,
      };

      const returned = await controller.addEvent(invalidEvent);
      expect(returned).toStrictEqual(errorRespose);
    });

    it('should fail because ad creation not possible', async () => {
      const invalidEvent = {
        ...event,
        type: 'ads',
      };
      const errorRespose = {
        message: ['Ad creation not possible'],
        data: null,
      };

      const returned = await controller.addEvent(invalidEvent);
      expect(returned).toStrictEqual(errorRespose);
    });
  });

  describe('Get all events', () => {
    it('should get all events', async () => {
      const allEventsResponse = {
        data: [response.data],
      };
      const retured = await controller.getAllEvents();

      expect(retured).toStrictEqual(allEventsResponse);
    });
  });

  describe('Get by search', () => {
    it('should get events by search', async () => {
      const search = 'event';
      const searchResponse = {
        data: [response.data],
      };
      const retured = await controller.getBySearch(search);

      expect(retured).toStrictEqual(searchResponse);
    });
  });

  describe('Update event', () => {
    it('should update event', async () => {
      const id = 'id';
      const updateEventResponse = {
        data: {
          ...response.data,
          name: 'updated name',
        },
      };
      const retured = await controller.updateEvent(id, {
        ...event,
        name: 'updated name',
      });

      expect(retured).toStrictEqual(updateEventResponse);
    });

    it('should fail because required fields', async () => {
      const id = 'id';
      const emptyEvent = {};
      const errorRespose = {
        message: [
          'Name is required',
          'Description is required',
          'Type is required',
          'Priority is required',
        ],
        data: null,
      };

      const returned = await controller.updateEvent(id, emptyEvent);
      expect(returned).toStrictEqual(errorRespose);
    });

    it('should fail because invalid type', async () => {
      const id = 'id';
      const invalidEvent = {
        ...event,
        type: 'invalid',
      };
      const errorRespose = {
        message: ['Invalid type'],
        data: null,
      };

      const returned = await controller.updateEvent(id, invalidEvent);
      expect(returned).toStrictEqual(errorRespose);
    });

    it('should fail because invalid priority', async () => {
      const id = 'id';
      const invalidEvent = {
        ...event,
        priority: 11,
      };
      const errorRespose = {
        message: ['Priority must be between 1 and 10'],
        data: null,
      };

      const returned = await controller.updateEvent(id, invalidEvent);
      expect(returned).toStrictEqual(errorRespose);
    });

    it('should fail because ad creation not possible', async () => {
      const id = 'id';
      const invalidEvent = {
        ...event,
        type: 'ads',
      };
      const errorRespose = {
        message: ['Ad creation not possible'],
        data: null,
      };

      const returned = await controller.updateEvent(id, invalidEvent);
      expect(returned).toStrictEqual(errorRespose);
    });
  });

  describe('Delete event', () => {
    it('should delete event', async () => {
      const id = 'id';
      const deleteResponse = { data: { id } };
      const retured = await controller.removeEvent(id);

      expect(retured).toStrictEqual(deleteResponse);
    });

    it('should fail because event not found', async () => {
      jest.spyOn(service, 'deleteEvent').mockResolvedValueOnce(null);

      const id = 'id';
      const errorRespose = {
        message: ['Event not found'],
        data: null,
      };

      const returned = await controller.removeEvent(id);
      expect(returned).toStrictEqual(errorRespose);
    });
  });

  describe('Check ad creation', () => {
    it('should check ad creation', async () => {
      const type = 'ads';
      const countryCode = 'SI';

      const retured = await controller.isCreationPossible(type, countryCode);

      expect(retured).toStrictEqual({
        allowed: false,
        error: 'Ad creation not possible',
      });
    });
  });
});
