import { UseGuards, applyDecorators } from '@nestjs/common';

import { LoggedInGuard } from '../guards/logged-in.guard';

export const LoggedIn = () => applyDecorators(UseGuards(LoggedInGuard));
