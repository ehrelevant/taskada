import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { BaseIssue, BaseSchema, safeParse } from 'valibot';

@Injectable()
export class ValibotPipe<T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>> implements PipeTransform {
  constructor(private schema: T) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body')
      return value;

    const result = safeParse(this.schema, value);

    if (result.success) {
      return result.output;
    }

    // Format error messages to be readable
    const errorMessages = result.issues.map((issue) => issue.message).join(', ');
    throw new BadRequestException(errorMessages);
  }
}
