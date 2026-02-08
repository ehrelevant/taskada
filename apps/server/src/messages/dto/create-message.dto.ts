import { minLength, object, pipe, string } from 'valibot';

export const CreateMessageSchema = object({
  message: pipe(string(), minLength(1, 'Message cannot be empty')),
});

export type CreateMessageDto = {
  message: string;
};
