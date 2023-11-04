import { ValidationArguments } from 'class-validator';

export const emailValidationMessage = (args: ValidationArguments) => {
  return `${args.targetName}의 ${args.property}는 이메일 형식이어야 합니다.`;
};
