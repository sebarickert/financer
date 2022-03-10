export const getAuthenticationStatus =
  async (): Promise<IAuthenticationStatus> => {
    const authenticationStatus = await fetch('/auth/api/status');
    return authenticationStatus.json();
  };
