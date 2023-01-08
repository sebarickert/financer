import { financerApi } from '../generated/financerApi';

enum ApiTag {
  ACCOUNT = 'accounts',
  ACCOUNT_BALANCE = 'account-balance',
  AUTHENTICATION = 'authentication',
  USER = 'user',
}

financerApi.enhanceEndpoints({
  addTagTypes: Object.values(ApiTag),
  endpoints: {
    //
    // Accounts
    //
    accountsFindAllByUser: {
      providesTags: (res) => [
        ApiTag.ACCOUNT,
        { type: ApiTag.ACCOUNT, id: 'LIST' },
        { type: ApiTag.ACCOUNT, id: `PAGE-${res?.currentPage}` },
        ...(res?.data.map(({ _id }) => ({ type: ApiTag.ACCOUNT, id: _id })) ??
          []),
      ],
    },
    accountsFindOneById: {
      providesTags: (res) => [
        ApiTag.ACCOUNT,
        { type: ApiTag.ACCOUNT, id: res?._id },
      ],
    },
    accountsGetAccountBalanceHistory: {
      providesTags: (res, err, args) => [
        ApiTag.ACCOUNT,
        ApiTag.ACCOUNT_BALANCE,
        { type: ApiTag.ACCOUNT, id: args.id },
        { type: ApiTag.ACCOUNT_BALANCE, id: args.id },
      ],
    },
    accountsCreate: {
      invalidatesTags: [{ type: ApiTag.ACCOUNT, id: 'LIST' }],
    },
    accountsUpdate: {
      invalidatesTags: (res) => [{ type: ApiTag.ACCOUNT, id: res?._id }],
    },
    accountsRemove: {
      invalidatesTags: (res, err, args) => [
        { type: ApiTag.ACCOUNT, id: args.id },
        { type: ApiTag.ACCOUNT, id: 'LIST' },
      ],
    },

    //
    // Authentication
    //
    authGetAuthenticationStatus: {
      providesTags: [ApiTag.AUTHENTICATION],
    },

    //
    // User
    //
    usersFindOwnUser: {
      providesTags: (res) => [
        ApiTag.USER,
        { type: ApiTag.USER, id: 'own' },
        { type: ApiTag.USER, id: res?._id },
      ],
    },
    usersOverrideAllOwnUserData: {
      invalidatesTags: [ApiTag.USER],
    },
  },
});
