import { configuration } from './configuration';

import { FlattenConfig } from '@/types/flatten-config';

type ConfigurationType = FlattenConfig<
  Awaited<ReturnType<typeof configuration>>
>;

// Override NestJS configuration type and add types for configuration keys.
declare module '@nestjs/config' {
  class ConfigService {
    get<K extends keyof ConfigurationType>(
      key: K,
    ): K extends keyof ConfigurationType ? ConfigurationType[K] : never;
  }
}
