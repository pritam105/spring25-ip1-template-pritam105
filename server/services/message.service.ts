import MessageModel from '../models/messages.model';
import { Message, MessageResponse } from '../types/types';

/**
 * Saves a new message to the database.
 *
 * @param {Message} message - The message to save
 *
 * @returns {Promise<MessageResponse>} - The saved message or an error message
 */
export const saveMessage = async (message: Message): Promise<MessageResponse> => {
  // TODO: Task 2 - Implement the saveMessage function. Refer to other service files for guidance.
  try {
    const result = await MessageModel.create(message);
    if (!result) {
      return { error: 'Failed to create message' };
    }
    return result;
  } catch (error) {
    return { error: `Error occurred when saving message: ${error}` };
  }
};

/**
 * Retrieves all messages from the database, sorted by date in ascending order.
 *
 * @returns {Promise<Message[]>} - An array of messages. If an error occurs, an empty array is returned.
 */
export const getMessages = async (): Promise<Message[]> => {
  // TODO: Task 2 - Implement the getMessages function
  try {
    const messages = await MessageModel.find();
    messages.sort((a, b) => a.msgDateTime.getTime() - b.msgDateTime.getTime());
    return messages;
  } catch (error) {
    return [];
  }
};
