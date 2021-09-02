// eslint-disable-next-line import/prefer-default-export
export const getAuthenticationStatus =
  async (): Promise<IAuthenticationStatus> => {
    const authenticationStatus = await fetch("/auth/api/status");
    return authenticationStatus.json();
  };
