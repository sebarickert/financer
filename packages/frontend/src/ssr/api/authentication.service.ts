import { BaseApi } from './base-api';

import { AuthenticationStatusDto } from '$api/generated/financerApi';

export class AuthenticationService extends BaseApi {
  public static async getStatus(): Promise<
    AuthenticationStatusDto | undefined
  > {
    const { data } = await this.client.GET('/auth/status');

    return data as AuthenticationStatusDto;
  }
}
