import { array, minLength, object, optional, pipe, string } from 'valibot';

export const CreateMessageSchema = object({
  message: pipe(string(), minLength(1, 'Message cannot be empty')),
  imageKeys: optional(array(string()), []),
});

export type CreateMessageDto = {
  message: string;
  imageKeys: string[];
};
