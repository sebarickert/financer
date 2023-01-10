import { financerApi } from '../generated/financerApi';

enum ApiTag {
  ACCOUNT = 'accounts',
  ACCOUNT_BALANCE = 'account-balance',
  AUTHENTICATION = 'authentication',
  USER = 'user',
  USER_PREFERENCE = 'user-preference',
  TRANSACTION_TEMPLATE = 'transaction-template',
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

    //
    // User Preferences
    //
    userPreferencesFindOne: {
      providesTags: (res) => [
        ApiTag.USER_PREFERENCE,
        { type: ApiTag.USER_PREFERENCE, id: res?.key },
      ],
    },
    userPreferencesUpdate: {
      invalidatesTags: (res) => [
        { type: ApiTag.USER_PREFERENCE, id: res?.key },
      ],
    },

    //
    // Transaction Templates
    //
    transactionTemplatesFindAllByUser: {
      providesTags: (res) => [
        ApiTag.TRANSACTION_TEMPLATE,
        { type: ApiTag.TRANSACTION_TEMPLATE, id: 'LIST' },
        { type: ApiTag.TRANSACTION_TEMPLATE, id: 'LIST' },
        ...(res?.map(({ _id }) => ({
          type: ApiTag.TRANSACTION_TEMPLATE,
          id: _id,
        })) ?? []),
      ],
    },
    transactionTemplatesFindAllManualTypeByUser: {
      providesTags: (res) => [
        ApiTag.TRANSACTION_TEMPLATE,
        { type: ApiTag.TRANSACTION_TEMPLATE, id: 'LIST' },
        { type: ApiTag.TRANSACTION_TEMPLATE, id: 'LIST-MANUAL' },
        ...(res?.map(({ _id }) => ({
          type: ApiTag.TRANSACTION_TEMPLATE,
          id: _id,
        })) ?? []),
      ],
    },
    transactionTemplatesFindOne: {
      providesTags: (res) => [
        ApiTag.TRANSACTION_TEMPLATE,
        { type: ApiTag.TRANSACTION_TEMPLATE, id: res?._id },
      ],
    },
    transactionTemplatesCreate: {
      invalidatesTags: [{ type: ApiTag.TRANSACTION_TEMPLATE, id: 'LIST' }],
    },
    transactionTemplatesUpdate: {
      invalidatesTags: (res) => [
        { type: ApiTag.TRANSACTION_TEMPLATE, id: res?._id },
      ],
    },
    transactionTemplatesRemove: {
      invalidatesTags: (res, err, args) => [
        { type: ApiTag.TRANSACTION_TEMPLATE, id: args.id },
        { type: ApiTag.TRANSACTION_TEMPLATE, id: 'LIST' },
      ],
    },
  },
});