import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { PessoasModule } from '../../src/pessoas/pessoas.module';

describe('Pessoas (e2e)', () => {
  let app: INestApplication;
  let mongod;

  beforeEach(async () => {
    mongod = new MongoMemoryServer();
    const uri = await mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PessoasModule, MongooseModule.forRoot(uri)],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/pessoas', async () => {
    // GET no data
    let res = await request(app.getHttpServer()).get('/pessoas');
    expect(res.body).toMatchObject([]);
    // POST data
    res = await request(app.getHttpServer()).post('/pessoas').send({
      nome: 'John Doe',
      idade: 21,
    });
    // GET posted data
    res = await request(app.getHttpServer()).get('/pessoas');
    expect(res.body).toMatchObject([
      {
        nome: 'John Doe',
        idade: 21,
      },
    ]);
    // PUT data
    const url = `/pessoas/${res.body[0]._id}`;
    res = await request(app.getHttpServer()).put(url).send({
      nome: 'John D.',
      idade: 22,
    });
    expect(res.body).toMatchObject({
      nome: 'John D.',
      idade: 22,
    });
    // GET put data
    res = await request(app.getHttpServer()).get('/pessoas');
    expect(res.body).toMatchObject([
      {
        nome: 'John D.',
        idade: 22,
      },
    ]);
    // DELETE data
    await request(app.getHttpServer()).delete(url);
    // GET no data
    res = await request(app.getHttpServer()).get('/pessoas');
    expect(res.body).toMatchObject([]);
  });
});
