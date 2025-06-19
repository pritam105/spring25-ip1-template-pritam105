import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../../app';
import * as util from '../../services/message.service';

const saveMessageSpy = jest.spyOn(util, 'saveMessage');
const getMessagesSpy = jest.spyOn(util, 'getMessages');

describe('POST /addMessage', () => {
  it('should add a new message', async () => {
    const validId = new mongoose.Types.ObjectId();
    const message = {
      _id: validId,
      msg: 'Hello',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    saveMessageSpy.mockResolvedValue(message);

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: message });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: message._id.toString(),
      msg: message.msg,
      msgFrom: message.msgFrom,
      msgDateTime: message.msgDateTime.toISOString(),
    });
  });

  it('should return bad request error if messageToAdd is missing', async () => {
    const response = await supertest(app).post('/messaging/addMessage').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  // TODO: Task 2 - Write additional test cases for addMessageRoute
  it('should return 400 if msgDateTime is not a valid date', async () => {
    const invalidMessage = {
      msg: 'Hey',
      msgFrom: 'User2',
      msgDateTime: 'invalid-date',
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: invalidMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return 400 if required field msg is missing', async () => {
    const incompleteMessage = {
      msgFrom: 'User3',
      msgDateTime: new Date(),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: incompleteMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return 500 if saveMessage throws an error', async () => {
    saveMessageSpy.mockResolvedValue({ error: 'Simulated DB failure' });

    const message = {
      msg: 'Test failure',
      msgFrom: 'User4',
      msgDateTime: new Date(),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: message });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Simulated DB failure');
  });

  it('should return stringified _id and ISO msgDateTime', async () => {
    const id = new mongoose.Types.ObjectId();
    const date = new Date();

    const message = {
      _id: id,
      msg: 'Formatted Message',
      msgFrom: 'User5',
      msgDateTime: date,
    };

    saveMessageSpy.mockResolvedValue(message);

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: message });

    expect(response.status).toBe(200);
    expect(typeof response.body._id).toBe('string');
    expect(new Date(response.body.msgDateTime).toISOString()).toBe(date.toISOString());
  });
});

describe('GET /getMessages', () => {
  it('should return all messages', async () => {
    const message1 = {
      msg: 'Hello',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    const message2 = {
      msg: 'Hi',
      msgFrom: 'User2',
      msgDateTime: new Date('2024-06-05'),
    };

    getMessagesSpy.mockResolvedValue([message1, message2]);

    const response = await supertest(app).get('/messaging/getMessages');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        msg: message1.msg,
        msgFrom: message1.msgFrom,
        msgDateTime: message1.msgDateTime.toISOString(),
      },
      {
        msg: message2.msg,
        msgFrom: message2.msgFrom,
        msgDateTime: message2.msgDateTime.toISOString(),
      },
    ]);
  });
});
