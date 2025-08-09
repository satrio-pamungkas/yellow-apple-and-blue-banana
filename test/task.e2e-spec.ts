import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tasks End to End API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tasks (+ Create Task - POST)', async () => {
    const createDto = {
      title: 'Test task',
      description: 'Test description',
    };

    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send(createDto)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(createDto.title);
    expect(res.body.description).toBe(createDto.description);
    expect(res.body.status).toBe('TO_DO');
  });

  it('/tasks (+ Retrieve Tasks - GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks')
      .expect(200);

    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('/tasks/:id (+ Retrieve Specific Task - GET)', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Get One', description: 'desc' })
      .expect(201);

    const taskId = createRes.body.id;

    const getRes = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(200);

    expect(getRes.body.id).toBe(taskId);
  });

  it('/tasks/:id (+ Update Specific Task - PATCH)', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Update Me' })
      .expect(201);

    const taskId = createRes.body.id;

    const updateDto = { title: 'Updated Title', status: 'DONE' };

    const patchRes = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .send(updateDto)
      .expect(200);

    expect(patchRes.body.title).toBe(updateDto.title);
    expect(patchRes.body.status).toBe(updateDto.status);
  });

  it('/tasks/:id (+ Delete Specific Task - DELETE)', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Delete Me' })
      .expect(201);

    const taskId = createRes.body.id;

    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(404);
  });

  it('/tasks (- Create Task with Missing Title - POST)', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ description: 'Missing title' })
      .expect(400);
  });
});
