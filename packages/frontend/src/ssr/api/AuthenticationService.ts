import { BaseApi } from './BaseApi';

import { AuthenticationStatusDto } from '$api/generated/financerApi';

export class AuthenticationService extends BaseApi {
  public static async getStatus(): Promise<
    AuthenticationStatusDto | undefined
  > {
    const { data } = await this.client.GET('/auth/status', {
      next: {
        tags: [this.API_TAG.AUTHENTICATION],
      },
    });

    return data as AuthenticationStatusDto;
  }
}
