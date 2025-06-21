import MessageModel from '../../models/messages.model';
import { getMessages, saveMessage } from '../../services/message.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

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

describe('Message model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  describe('saveMessage', () => {
    it('should return the saved message', async () => {
      mockingoose(MessageModel).toReturn(message1, 'create');

      const savedMessage = await saveMessage(message1);

      expect(savedMessage).toMatchObject(message1);
    });
    // TODO: Task 2 - Write a test case for saveMessage when an error occurs
    it('should return an error if saving the message fails', async () => {
      const errorMsg = 'Database create error';

      jest.spyOn(MessageModel, 'create').mockRejectedValueOnce(new Error(errorMsg));

      const result = await saveMessage(message1);

      expect('error' in result).toBe(true);
    });
  });

  describe('getMessages', () => {
    it('should return all messages, sorted by date', async () => {
      mockingoose(MessageModel).toReturn([message2, message1], 'find');

      const messages = await getMessages();

      expect(messages).toMatchObject([message1, message2]);
    });
    // TODO: Task 2 - Write a test case for getMessages when an error occurs
    it('should return an empty array if fetching messages fails', async () => {
      jest.spyOn(MessageModel, 'find').mockRejectedValueOnce(() => new Error('DB error'));

      const result = await getMessages();

      expect(result).toEqual([]);
    });
  });
});
