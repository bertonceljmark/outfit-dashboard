import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { EventsModule } from '../src/events/events.module';
import { EventsService } from '../src/events/events.service';
import { IEvent } from '../src/events/interfaces/events.interface';
import mongoose from 'mongoose';

const mockedEvents: IEvent[] = [
  {
    id: '1',
    name: 'test',
    description: 'test',
    type: 'app',
    priority: 1,
  },
  {
    id: '2',
    name: 'test2',
    description: 'test2',
    type: 'app',
    priority: 2,
  },
  {
    id: '3',
    name: 'test3',
    description: 'test3',
    type: 'liveops',
    priority: 3,
  },
];

const mockedCreateEvent: IEvent = {
  name: 'test4',
  description: 'test4',
  type: 'liveops',
  priority: 4,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const eventsService = {
    getEvents: () => mockedEvents,
    insertEvent: () => ({ ...mockedCreateEvent, id: '4' }),
    updateEvent: () => ({ ...mockedEvents[0], name: 'updated name' }),
    deleteEvent: () => ({ id: '1' }),
    getEventsBySearch: (search: string) => {
      if (search === 'valid') {
        return mockedEvents;
      }

      return [];
    },
  };

  beforeAll((done) => {
    done();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, EventsModule],
    })
      .overrideProvider(EventsService)
      .useValue(eventsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/events (GET)', () => {
    it('fetches all events', () => {
      return request(app.getHttpServer())
        .get('/events')
        .expect(200)
        .expect({ data: mockedEvents });
    });

    it('fetches events by search', () => {
      return request(app.getHttpServer())
        .get('/events/valid')
        .expect(200)
        .expect({ data: mockedEvents });
    });

    it('fetches events by search with no results', () => {
      return request(app.getHttpServer())
        .get('/events/invalid')
        .expect(200)
        .expect({ data: [] });
    });
  });

  describe('events (POST)', () => {
    it('creates event', () => {
      return request(app.getHttpServer())
        .post('/events')
        .send(mockedCreateEvent)
        .expect(201)
        .expect({ data: { ...mockedCreateEvent, id: '4' } });
    });

    it('fails to create with missing priority', () => {
      return request(app.getHttpServer())
        .post('/events')
        .send({ name: 'test', description: 'test', type: 'app' })
        .expect(201)
        .expect({ message: ['Priority is required'], data: null });
    });

    it('fails to create with missing name', () => {
      return request(app.getHttpServer())
        .post('/events')
        .send({ description: 'test', type: 'app', priority: 1 })
        .expect(201)
        .expect({ message: ['Name is required'], data: null });
    });

    it('fails to create with missing description', () => {
      return request(app.getHttpServer())
        .post('/events')
        .send({ name: 'test', type: 'app', priority: 1 })
        .expect(201)
        .expect({ message: ['Description is required'], data: null });
    });

    it('fails to create with missing type', () => {
      return request(app.getHttpServer())
        .post('/events')
        .send({ name: 'test', description: 'test', priority: 1 })
        .expect(201)
        .expect({ message: ['Type is required'], data: null });
    });

    it('fails to create with invalid type', () => {
      return request(app.getHttpServer())
        .post('/events')
        .send({
          name: 'test',
          description: 'test',
          type: 'invalid',
          priority: 1,
        })
        .expect(201)
        .expect({ message: ['Invalid type'], data: null });
    });

    it('fails to create with invalid priority', () => {
      return request(app.getHttpServer())
        .post('/events')
        .send({ name: 'test', description: 'test', type: 'app', priority: 100 })
        .expect(201)
        .expect({ message: ['Priority must be between 1 and 10'], data: null });
    });
  });

  describe('/events (PATCH)', () => {
    it('updates event', () => {
      return request(app.getHttpServer())
        .patch('/events/1')
        .send({ ...mockedEvents[0], name: 'updated name' })
        .expect(200)
        .expect({ data: { ...mockedEvents[0], name: 'updated name' } });
    });

    it('fails to update with invalid type', () => {
      return request(app.getHttpServer())
        .patch('/events/1')
        .send({ ...mockedEvents[0], type: 'invalid' })
        .expect(200)
        .expect({ message: ['Invalid type'], data: null });
    });

    it('fails to update with invalid priority', () => {
      return request(app.getHttpServer())
        .patch('/events/1')
        .send({ ...mockedEvents[0], priority: 100 })
        .expect(200)
        .expect({ message: ['Priority must be between 1 and 10'], data: null });
    });

    it('fails to update with missing name', () => {
      return request(app.getHttpServer())
        .patch('/events/1')
        .send({ ...mockedEvents[0], name: '' })
        .expect(200)
        .expect({ message: ['Name is required'], data: null });
    });

    it('fails to update with missing description', () => {
      return request(app.getHttpServer())
        .patch('/events/1')
        .send({ ...mockedEvents[0], description: '' })
        .expect(200)
        .expect({ message: ['Description is required'], data: null });
    });

    it('fails to update with missing type', () => {
      return request(app.getHttpServer())
        .patch('/events/1')
        .send({ ...mockedEvents[0], type: '' })
        .expect(200)
        .expect({ message: ['Type is required'], data: null });
    });

    it('fails to update with missing priority', () => {
      return request(app.getHttpServer())
        .patch('/events/1')
        .send({ ...mockedEvents[0], priority: '' })
        .expect(200)
        .expect({ message: ['Priority is required'], data: null });
    });
  });

  describe('/events (DELETE)', () => {
    it('deletes event', () => {
      return request(app.getHttpServer())
        .delete('/events/1')
        .expect(200)
        .expect({ data: { id: '1' } });
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
    await app.close();
  });
});
