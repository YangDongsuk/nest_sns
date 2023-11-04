import { ValidationArguments } from 'class-validator';

export const stringValidationMessage = (args: ValidationArguments) => {
  return `${args.targetName}의 ${args.property}는 문자열이어야 합니다.`;
};
