import { kebabCase } from 'change-case';

export function path_case(tag: string): string {
  return tag
    .split('/')
    .map((value: string, _: number) => {
      return kebabCase(value);
    })
    .join('/');
}
