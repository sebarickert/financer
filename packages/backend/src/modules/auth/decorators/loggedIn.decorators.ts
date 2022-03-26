import { applyDecorators, UseGuards } from '@nestjs/common';

import { LoggedInGuard } from '../guards/loggedIn.guard';

export const LoggedIn = () => applyDecorators(UseGuards(LoggedInGuard));
