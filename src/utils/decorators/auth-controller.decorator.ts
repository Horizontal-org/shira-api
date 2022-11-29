import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function AuthController(
  controllerName: string,
) {
  return applyDecorators(
    Controller(controllerName),
    UseGuards(AuthGuard('jwt')),
  );
}
