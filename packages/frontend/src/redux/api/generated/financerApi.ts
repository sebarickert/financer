import { emptyFinancerApi as api } from '../emptyFinancerApi';
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    authControllerGetAuthenticationStatus: build.query<
      AuthControllerGetAuthenticationStatusApiResponse,
      AuthControllerGetAuthenticationStatusApiArg
    >({
      query: () => ({ url: `/auth/status` }),
    }),
    authControllerLoginGithub: build.query<
      AuthControllerLoginGithubApiResponse,
      AuthControllerLoginGithubApiArg
    >({
      query: () => ({ url: `/auth/github` }),
    }),
    authControllerLoginAuth0: build.query<
      AuthControllerLoginAuth0ApiResponse,
      AuthControllerLoginAuth0ApiArg
    >({
      query: () => ({ url: `/auth/auth0` }),
    }),
    authControllerLoginGithubCallback: build.query<
      AuthControllerLoginGithubCallbackApiResponse,
      AuthControllerLoginGithubCallbackApiArg
    >({
      query: () => ({ url: `/auth/github/redirect` }),
    }),
    authControllerLoginAuth0Callback: build.query<
      AuthControllerLoginAuth0CallbackApiResponse,
      AuthControllerLoginAuth0CallbackApiArg
    >({
      query: () => ({ url: `/auth/auth0/redirect` }),
    }),
    authControllerLogout: build.query<
      AuthControllerLogoutApiResponse,
      AuthControllerLogoutApiArg
    >({
      query: () => ({ url: `/auth/logout` }),
    }),
    authControllerLogoutAuth0: build.query<
      AuthControllerLogoutAuth0ApiResponse,
      AuthControllerLogoutAuth0ApiArg
    >({
      query: () => ({ url: `/auth/logout/auth0` }),
    }),
    usersControllerFindOwnUser: build.query<
      UsersControllerFindOwnUserApiResponse,
      UsersControllerFindOwnUserApiArg
    >({
      query: () => ({ url: `/api/users/my-user` }),
    }),
    usersControllerUpdateOwnUser: build.mutation<
      UsersControllerUpdateOwnUserApiResponse,
      UsersControllerUpdateOwnUserApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/my-user`,
        method: 'PATCH',
        body: queryArg.updateUserOwnUserDto,
      }),
    }),
    usersControllerGetAllOwnUserData: build.query<
      UsersControllerGetAllOwnUserDataApiResponse,
      UsersControllerGetAllOwnUserDataApiArg
    >({
      query: () => ({ url: `/api/users/my-user/my-data` }),
    }),
    usersControllerOverrideAllOwnUserData: build.mutation<
      UsersControllerOverrideAllOwnUserDataApiResponse,
      UsersControllerOverrideAllOwnUserDataApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/my-user/my-data`,
        method: 'POST',
        body: queryArg.userDataImportDto,
      }),
    }),
    usersControllerFindAll: build.query<
      UsersControllerFindAllApiResponse,
      UsersControllerFindAllApiArg
    >({
      query: () => ({ url: `/api/users` }),
    }),
    usersControllerFindOne: build.query<
      UsersControllerFindOneApiResponse,
      UsersControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/api/users/${queryArg.id}` }),
    }),
    usersControllerUpdate: build.mutation<
      UsersControllerUpdateApiResponse,
      UsersControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.updateUserDto,
      }),
    }),
    usersControllerGetAllOneUserData: build.query<
      UsersControllerGetAllOneUserDataApiResponse,
      UsersControllerGetAllOneUserDataApiArg
    >({
      query: (queryArg) => ({ url: `/api/users/${queryArg.id}/my-data` }),
    }),
    accountsControllerCreate: build.mutation<
      AccountsControllerCreateApiResponse,
      AccountsControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/accounts`,
        method: 'POST',
        body: queryArg.createAccountDto,
      }),
    }),
    accountsControllerFindAllByUser: build.query<
      AccountsControllerFindAllByUserApiResponse,
      AccountsControllerFindAllByUserApiArg
    >({
      query: (queryArg) => ({
        url: `/api/accounts`,
        params: {
          limit: queryArg.limit,
          page: queryArg.page,
          accountTypes: queryArg.accountTypes,
        },
      }),
    }),
    accountsControllerFindOne: build.query<
      AccountsControllerFindOneApiResponse,
      AccountsControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/api/accounts/${queryArg.id}` }),
    }),
    accountsControllerUpdate: build.mutation<
      AccountsControllerUpdateApiResponse,
      AccountsControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/accounts/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.updateAccountDto,
      }),
    }),
    accountsControllerRemove: build.mutation<
      AccountsControllerRemoveApiResponse,
      AccountsControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/accounts/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    accountsControllerGetAccountBalanceHistory: build.query<
      AccountsControllerGetAccountBalanceHistoryApiResponse,
      AccountsControllerGetAccountBalanceHistoryApiArg
    >({
      query: (queryArg) => ({
        url: `/api/accounts/${queryArg.id}/balance-history`,
      }),
    }),
    transactionsControllerFindAllByUser: build.query<
      TransactionsControllerFindAllByUserApiResponse,
      TransactionsControllerFindAllByUserApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transactions`,
        params: {
          month: queryArg.month,
          year: queryArg.year,
          page: queryArg.page,
          limit: queryArg.limit,
          accountTypes: queryArg.accountTypes,
          sortOrder: queryArg.sortOrder,
        },
      }),
    }),
    transactionsControllerFindMonthlySummariesByUser: build.query<
      TransactionsControllerFindMonthlySummariesByUserApiResponse,
      TransactionsControllerFindMonthlySummariesByUserApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transactions/monthly-summaries`,
        params: {
          month: queryArg.month,
          year: queryArg.year,
          limit: queryArg.limit,
          accountTypes: queryArg.accountTypes,
          transactionCategories: queryArg.transactionCategories,
        },
      }),
    }),
    transactionsControllerFindAllByAccount: build.query<
      TransactionsControllerFindAllByAccountApiResponse,
      TransactionsControllerFindAllByAccountApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transactions/account/${queryArg.id}`,
        params: {
          month: queryArg.month,
          year: queryArg.year,
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
    }),
    transactionsControllerFindOne: build.query<
      TransactionsControllerFindOneApiResponse,
      TransactionsControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/api/transactions/${queryArg.id}` }),
    }),
    transactionCategoriesControllerCreate: build.mutation<
      TransactionCategoriesControllerCreateApiResponse,
      TransactionCategoriesControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transaction-categories`,
        method: 'POST',
        body: queryArg.createTransactionCategoryDto,
      }),
    }),
    transactionCategoriesControllerFindAllByUser: build.query<
      TransactionCategoriesControllerFindAllByUserApiResponse,
      TransactionCategoriesControllerFindAllByUserApiArg
    >({
      query: () => ({ url: `/api/transaction-categories` }),
    }),
    transactionCategoriesControllerFindOne: build.query<
      TransactionCategoriesControllerFindOneApiResponse,
      TransactionCategoriesControllerFindOneApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transaction-categories/${queryArg.id}`,
      }),
    }),
    transactionCategoriesControllerUpdate: build.mutation<
      TransactionCategoriesControllerUpdateApiResponse,
      TransactionCategoriesControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transaction-categories/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.updateTransactionCategoryDto,
      }),
    }),
    transactionCategoriesControllerRemove: build.mutation<
      TransactionCategoriesControllerRemoveApiResponse,
      TransactionCategoriesControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transaction-categories/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    transactionCategoriesControllerGetCategorySummary: build.query<
      TransactionCategoriesControllerGetCategorySummaryApiResponse,
      TransactionCategoriesControllerGetCategorySummaryApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transaction-categories/${queryArg.id}/summary`,
      }),
    }),
    userPreferencesControllerFindAll: build.query<
      UserPreferencesControllerFindAllApiResponse,
      UserPreferencesControllerFindAllApiArg
    >({
      query: () => ({ url: `/api/user-preferences` }),
    }),
    userPreferencesControllerUpdate: build.mutation<
      UserPreferencesControllerUpdateApiResponse,
      UserPreferencesControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user-preferences`,
        method: 'PATCH',
        body: queryArg.updateUserPreferenceDto,
      }),
    }),
    userPreferencesControllerFindOne: build.query<
      UserPreferencesControllerFindOneApiResponse,
      UserPreferencesControllerFindOneApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user-preferences/${queryArg.userPreferenceProperty}`,
      }),
    }),
    transactionTemplatesControllerCreate: build.mutation<
      TransactionTemplatesControllerCreateApiResponse,
      TransactionTemplatesControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transaction-templates`,
        method: 'POST',
        body: queryArg.createTransactionTemplateDto,
      }),
    }),
    transactionTemplatesControllerFindAllByUser: build.query<
      TransactionTemplatesControllerFindAllByUserApiResponse,
      TransactionTemplatesControllerFindAllByUserApiArg
    >({
      query: () => ({ url: `/api/transaction-templates` }),
    }),
    transactionTemplatesControllerFindAllManualTypeByUser: build.query<
      TransactionTemplatesControllerFindAllManualTypeByUserApiResponse,
      TransactionTemplatesControllerFindAllManualTypeByUserApiArg
    >({
      query: () => ({ url: `/api/transaction-templates/manual` }),
    }),
    transactionTemplatesControllerFindOne: build.query<
      TransactionTemplatesControllerFindOneApiResponse,
      TransactionTemplatesControllerFindOneApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transaction-templates/${queryArg.id}`,
      }),
    }),
    transactionTemplatesControllerUpdate: build.mutation<
      TransactionTemplatesControllerUpdateApiResponse,
      TransactionTemplatesControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transaction-templates/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.updateTransactionTemplateDto,
      }),
    }),
    transactionTemplatesControllerRemove: build.mutation<
      TransactionTemplatesControllerRemoveApiResponse,
      TransactionTemplatesControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transaction-templates/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    expensesControllerFindAllByUser: build.query<
      ExpensesControllerFindAllByUserApiResponse,
      ExpensesControllerFindAllByUserApiArg
    >({
      query: (queryArg) => ({
        url: `/api/expenses`,
        params: {
          month: queryArg.month,
          year: queryArg.year,
          page: queryArg.page,
          limit: queryArg.limit,
          accountTypes: queryArg.accountTypes,
        },
      }),
    }),
    expensesControllerCreate: build.mutation<
      ExpensesControllerCreateApiResponse,
      ExpensesControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/expenses`,
        method: 'POST',
        body: queryArg.createExpenseDto,
      }),
    }),
    expensesControllerFindMonthlySummariesByuser: build.query<
      ExpensesControllerFindMonthlySummariesByuserApiResponse,
      ExpensesControllerFindMonthlySummariesByuserApiArg
    >({
      query: (queryArg) => ({
        url: `/api/expenses/monthly-summaries`,
        params: {
          month: queryArg.month,
          year: queryArg.year,
          limit: queryArg.limit,
          accountTypes: queryArg.accountTypes,
          transactionCategories: queryArg.transactionCategories,
        },
      }),
    }),
    expensesControllerFindOne: build.query<
      ExpensesControllerFindOneApiResponse,
      ExpensesControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/api/expenses/${queryArg.id}` }),
    }),
    expensesControllerUpdate: build.mutation<
      ExpensesControllerUpdateApiResponse,
      ExpensesControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/expenses/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.updateExpenseDto,
      }),
    }),
    expensesControllerRemove: build.mutation<
      ExpensesControllerRemoveApiResponse,
      ExpensesControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/expenses/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    incomesControllerFindAllByUser: build.query<
      IncomesControllerFindAllByUserApiResponse,
      IncomesControllerFindAllByUserApiArg
    >({
      query: (queryArg) => ({
        url: `/api/incomes`,
        params: {
          month: queryArg.month,
          year: queryArg.year,
          page: queryArg.page,
          limit: queryArg.limit,
          accountTypes: queryArg.accountTypes,
        },
      }),
    }),
    incomesControllerCreate: build.mutation<
      IncomesControllerCreateApiResponse,
      IncomesControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/incomes`,
        method: 'POST',
        body: queryArg.createIncomeDto,
      }),
    }),
    incomesControllerFindMonthlySummariesByuser: build.query<
      IncomesControllerFindMonthlySummariesByuserApiResponse,
      IncomesControllerFindMonthlySummariesByuserApiArg
    >({
      query: (queryArg) => ({
        url: `/api/incomes/monthly-summaries`,
        params: {
          month: queryArg.month,
          year: queryArg.year,
          limit: queryArg.limit,
          accountTypes: queryArg.accountTypes,
          transactionCategories: queryArg.transactionCategories,
        },
      }),
    }),
    incomesControllerFindOne: build.query<
      IncomesControllerFindOneApiResponse,
      IncomesControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/api/incomes/${queryArg.id}` }),
    }),
    incomesControllerUpdate: build.mutation<
      IncomesControllerUpdateApiResponse,
      IncomesControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/incomes/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.updateIncomeDto,
      }),
    }),
    incomesControllerRemove: build.mutation<
      IncomesControllerRemoveApiResponse,
      IncomesControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/incomes/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    transfersControllerFindAllByUser: build.query<
      TransfersControllerFindAllByUserApiResponse,
      TransfersControllerFindAllByUserApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transfers`,
        params: {
          month: queryArg.month,
          year: queryArg.year,
          page: queryArg.page,
          limit: queryArg.limit,
          accountTypes: queryArg.accountTypes,
        },
      }),
    }),
    transfersControllerCreate: build.mutation<
      TransfersControllerCreateApiResponse,
      TransfersControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transfers`,
        method: 'POST',
        body: queryArg.createTransferDto,
      }),
    }),
    transfersControllerFindMonthlySummariesByuser: build.query<
      TransfersControllerFindMonthlySummariesByuserApiResponse,
      TransfersControllerFindMonthlySummariesByuserApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transfers/monthly-summaries`,
        params: {
          month: queryArg.month,
          year: queryArg.year,
          limit: queryArg.limit,
          accountTypes: queryArg.accountTypes,
          transactionCategories: queryArg.transactionCategories,
        },
      }),
    }),
    transfersControllerFindOne: build.query<
      TransfersControllerFindOneApiResponse,
      TransfersControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/api/transfers/${queryArg.id}` }),
    }),
    transfersControllerUpdate: build.mutation<
      TransfersControllerUpdateApiResponse,
      TransfersControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transfers/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.updateTransferDto,
      }),
    }),
    transfersControllerRemove: build.mutation<
      TransfersControllerRemoveApiResponse,
      TransfersControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/transfers/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    healthCheckControllerStuff: build.query<
      HealthCheckControllerStuffApiResponse,
      HealthCheckControllerStuffApiArg
    >({
      query: () => ({ url: `/health-check/ping` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as financerApi };
export type AuthControllerGetAuthenticationStatusApiResponse =
  /** status 200 Returns the user's authentication status and user data if logged in */ AuthenticationStatusDto;
export type AuthControllerGetAuthenticationStatusApiArg = void;
export type AuthControllerLoginGithubApiResponse = unknown;
export type AuthControllerLoginGithubApiArg = void;
export type AuthControllerLoginAuth0ApiResponse = unknown;
export type AuthControllerLoginAuth0ApiArg = void;
export type AuthControllerLoginGithubCallbackApiResponse = unknown;
export type AuthControllerLoginGithubCallbackApiArg = void;
export type AuthControllerLoginAuth0CallbackApiResponse = unknown;
export type AuthControllerLoginAuth0CallbackApiArg = void;
export type AuthControllerLogoutApiResponse = unknown;
export type AuthControllerLogoutApiArg = void;
export type AuthControllerLogoutAuth0ApiResponse = unknown;
export type AuthControllerLogoutAuth0ApiArg = void;
export type UsersControllerFindOwnUserApiResponse = /** status 200  */ UserDto;
export type UsersControllerFindOwnUserApiArg = void;
export type UsersControllerUpdateOwnUserApiResponse =
  /** status 200  */ UserDto;
export type UsersControllerUpdateOwnUserApiArg = {
  updateUserOwnUserDto: UpdateUserOwnUserDto;
};
export type UsersControllerGetAllOwnUserDataApiResponse =
  /** status 200  */ UserDataExportDto;
export type UsersControllerGetAllOwnUserDataApiArg = void;
export type UsersControllerOverrideAllOwnUserDataApiResponse =
  /** status 200  */ {
    payload?: string;
  };
export type UsersControllerOverrideAllOwnUserDataApiArg = {
  userDataImportDto: UserDataImportDto;
};
export type UsersControllerFindAllApiResponse = /** status 200  */ UserDto[];
export type UsersControllerFindAllApiArg = void;
export type UsersControllerFindOneApiResponse = /** status 200  */ UserDto;
export type UsersControllerFindOneApiArg = {
  /** Entity id from users collection. */
  id: string;
};
export type UsersControllerUpdateApiResponse = /** status 200  */ UserDto;
export type UsersControllerUpdateApiArg = {
  /** Entity id from users collection. */
  id: string;
  updateUserDto: UpdateUserDto;
};
export type UsersControllerGetAllOneUserDataApiResponse =
  /** status 200  */ UserDataExportDto;
export type UsersControllerGetAllOneUserDataApiArg = {
  /** Entity id from users collection. */
  id: string;
};
export type AccountsControllerCreateApiResponse = /** status 200  */ {
  payload?: string;
};
export type AccountsControllerCreateApiArg = {
  createAccountDto: CreateAccountDto;
};
export type AccountsControllerFindAllByUserApiResponse =
  /** status 200 Return all user accounts */ AccountDto[];
export type AccountsControllerFindAllByUserApiArg = {
  limit: number;
  page: number;
  accountTypes: string[];
};
export type AccountsControllerFindOneApiResponse =
  /** status 200 Return account by id */ AccountDto;
export type AccountsControllerFindOneApiArg = {
  id: string;
};
export type AccountsControllerUpdateApiResponse = /** status 200  */ AccountDto;
export type AccountsControllerUpdateApiArg = {
  id: string;
  updateAccountDto: UpdateAccountDto;
};
export type AccountsControllerRemoveApiResponse = unknown;
export type AccountsControllerRemoveApiArg = {
  id: string;
};
export type AccountsControllerGetAccountBalanceHistoryApiResponse =
  /** status 200 Return account balance history by id */ AccountBalanceHistoryDto;
export type AccountsControllerGetAccountBalanceHistoryApiArg = {
  id: string;
};
export type TransactionsControllerFindAllByUserApiResponse =
  /** status 200  */ PaginationDto & {
    data?: TransactionDto[];
  };
export type TransactionsControllerFindAllByUserApiArg = {
  month: number;
  year: number;
  page: number;
  limit: number;
  accountTypes: string[];
  sortOrder: string;
};
export type TransactionsControllerFindMonthlySummariesByUserApiResponse =
  /** status 200  */ PaginationDto & {
    data?: TransactionMonthSummaryDto[];
  };
export type TransactionsControllerFindMonthlySummariesByUserApiArg = {
  month: number;
  year: number;
  limit: number;
  accountTypes: string[];
  transactionCategories: string[];
};
export type TransactionsControllerFindAllByAccountApiResponse =
  /** status 200  */ PaginationDto & {
    data?: TransactionDto[];
  };
export type TransactionsControllerFindAllByAccountApiArg = {
  month: number;
  year: number;
  page: number;
  limit: number;
  id: string;
};
export type TransactionsControllerFindOneApiResponse =
  /** status 200 Return transaction by id */ TransactionDto;
export type TransactionsControllerFindOneApiArg = {
  id: string;
};
export type TransactionCategoriesControllerCreateApiResponse =
  /** status 200  */ {
    payload?: string;
  };
export type TransactionCategoriesControllerCreateApiArg = {
  createTransactionCategoryDto: CreateTransactionCategoryDto;
};
export type TransactionCategoriesControllerFindAllByUserApiResponse =
  /** status 200 Return transaction category by id */ TransactionCategoryDto[];
export type TransactionCategoriesControllerFindAllByUserApiArg = void;
export type TransactionCategoriesControllerFindOneApiResponse =
  /** status 200  */ TransactionCategoryDto;
export type TransactionCategoriesControllerFindOneApiArg = {
  id: string;
};
export type TransactionCategoriesControllerUpdateApiResponse =
  /** status 200  */ TransactionCategoryDto;
export type TransactionCategoriesControllerUpdateApiArg = {
  id: string;
  updateTransactionCategoryDto: UpdateTransactionCategoryDto;
};
export type TransactionCategoriesControllerRemoveApiResponse = unknown;
export type TransactionCategoriesControllerRemoveApiArg = {
  id: string;
};
export type TransactionCategoriesControllerGetCategorySummaryApiResponse =
  /** status 200  */ TransactionMonthSummaryDto[];
export type TransactionCategoriesControllerGetCategorySummaryApiArg = {
  id: string;
};
export type UserPreferencesControllerFindAllApiResponse =
  /** status 200  */ UserPreferenceDto[];
export type UserPreferencesControllerFindAllApiArg = void;
export type UserPreferencesControllerUpdateApiResponse =
  /** status 200  */ UserPreferenceDto;
export type UserPreferencesControllerUpdateApiArg = {
  updateUserPreferenceDto: UpdateUserPreferenceDto;
};
export type UserPreferencesControllerFindOneApiResponse =
  /** status 200  */ UserPreferenceDto;
export type UserPreferencesControllerFindOneApiArg = {
  userPreferenceProperty:
    | 'DEFAULT_INCOME_ACCOUNT'
    | 'DEFAULT_EXPENSE_ACCOUNT'
    | 'DEFAULT_TRANSFER_SOURCE_ACCOUNT'
    | 'DEFAULT_TRANSFER_TARGET_ACCOUNT'
    | 'TRANSACTION_LIST_CHUNK_SIZE'
    | 'UPDATE_INVESTMENT_MARKET_VALUE'
    | 'DASHBOARD_SETTINGS'
    | 'STATISTICS_SETTINGS';
};
export type TransactionTemplatesControllerCreateApiResponse =
  /** status 200  */ {
    payload?: string;
  };
export type TransactionTemplatesControllerCreateApiArg = {
  createTransactionTemplateDto: CreateTransactionTemplateDto;
};
export type TransactionTemplatesControllerFindAllByUserApiResponse =
  /** status 200 Return all transaction templates */ TransactionTemplateDto[];
export type TransactionTemplatesControllerFindAllByUserApiArg = void;
export type TransactionTemplatesControllerFindAllManualTypeByUserApiResponse =
  /** status 200 Return all transaction templates of type manual */ TransactionTemplateDto[];
export type TransactionTemplatesControllerFindAllManualTypeByUserApiArg = void;
export type TransactionTemplatesControllerFindOneApiResponse =
  /** status 200 Return transaction template by id */ TransactionTemplateDto;
export type TransactionTemplatesControllerFindOneApiArg = {
  id: string;
};
export type TransactionTemplatesControllerUpdateApiResponse =
  /** status 200  */ TransactionTemplateDto;
export type TransactionTemplatesControllerUpdateApiArg = {
  id: string;
  updateTransactionTemplateDto: UpdateTransactionTemplateDto;
};
export type TransactionTemplatesControllerRemoveApiResponse = unknown;
export type TransactionTemplatesControllerRemoveApiArg = {
  id: string;
};
export type ExpensesControllerFindAllByUserApiResponse =
  /** status 200  */ PaginationDto & {
    data?: ExpenseDto[];
  };
export type ExpensesControllerFindAllByUserApiArg = {
  month: number;
  year: number;
  page: number;
  limit: number;
  accountTypes: string[];
};
export type ExpensesControllerCreateApiResponse = /** status 200  */ {
  payload?: string;
};
export type ExpensesControllerCreateApiArg = {
  createExpenseDto: CreateExpenseDto;
};
export type ExpensesControllerFindMonthlySummariesByuserApiResponse =
  /** status 200  */ PaginationDto & {
    data?: TransactionMonthSummaryDto[];
  };
export type ExpensesControllerFindMonthlySummariesByuserApiArg = {
  month: number;
  year: number;
  limit: number;
  accountTypes: string[];
  transactionCategories: string[];
};
export type ExpensesControllerFindOneApiResponse =
  /** status 200 Return transaction by id */ ExpenseDto;
export type ExpensesControllerFindOneApiArg = {
  id: string;
};
export type ExpensesControllerUpdateApiResponse = /** status 200  */ ExpenseDto;
export type ExpensesControllerUpdateApiArg = {
  id: string;
  updateExpenseDto: UpdateExpenseDto;
};
export type ExpensesControllerRemoveApiResponse = unknown;
export type ExpensesControllerRemoveApiArg = {
  id: string;
};
export type IncomesControllerFindAllByUserApiResponse =
  /** status 200  */ PaginationDto & {
    data?: IncomeDto[];
  };
export type IncomesControllerFindAllByUserApiArg = {
  month: number;
  year: number;
  page: number;
  limit: number;
  accountTypes: string[];
};
export type IncomesControllerCreateApiResponse = /** status 200  */ {
  payload?: string;
};
export type IncomesControllerCreateApiArg = {
  createIncomeDto: CreateIncomeDto;
};
export type IncomesControllerFindMonthlySummariesByuserApiResponse =
  /** status 200  */ PaginationDto & {
    data?: TransactionMonthSummaryDto[];
  };
export type IncomesControllerFindMonthlySummariesByuserApiArg = {
  month: number;
  year: number;
  limit: number;
  accountTypes: string[];
  transactionCategories: string[];
};
export type IncomesControllerFindOneApiResponse =
  /** status 200 Return transaction by id */ IncomeDto;
export type IncomesControllerFindOneApiArg = {
  id: string;
};
export type IncomesControllerUpdateApiResponse = /** status 200  */ IncomeDto;
export type IncomesControllerUpdateApiArg = {
  id: string;
  updateIncomeDto: UpdateIncomeDto;
};
export type IncomesControllerRemoveApiResponse = unknown;
export type IncomesControllerRemoveApiArg = {
  id: string;
};
export type TransfersControllerFindAllByUserApiResponse =
  /** status 200  */ PaginationDto & {
    data?: TransferDto[];
  };
export type TransfersControllerFindAllByUserApiArg = {
  month: number;
  year: number;
  page: number;
  limit: number;
  accountTypes: string[];
};
export type TransfersControllerCreateApiResponse = /** status 200  */ {
  payload?: string;
};
export type TransfersControllerCreateApiArg = {
  createTransferDto: CreateTransferDto;
};
export type TransfersControllerFindMonthlySummariesByuserApiResponse =
  /** status 200  */ PaginationDto & {
    data?: TransactionMonthSummaryDto[];
  };
export type TransfersControllerFindMonthlySummariesByuserApiArg = {
  month: number;
  year: number;
  limit: number;
  accountTypes: string[];
  transactionCategories: string[];
};
export type TransfersControllerFindOneApiResponse =
  /** status 200 Return transaction by id */ TransferDto;
export type TransfersControllerFindOneApiArg = {
  id: string;
};
export type TransfersControllerUpdateApiResponse =
  /** status 200  */ TransferDto;
export type TransfersControllerUpdateApiArg = {
  id: string;
  updateTransferDto: UpdateTransferDto;
};
export type TransfersControllerRemoveApiResponse = unknown;
export type TransfersControllerRemoveApiArg = {
  id: string;
};
export type HealthCheckControllerStuffApiResponse = /** status 200  */ {
  ping?: string;
};
export type HealthCheckControllerStuffApiArg = void;
export type UserDto = {};
export type AuthenticationStatusDto = {
  authenticated: boolean;
  payload?: UserDto;
};
export type UpdateUserOwnUserDto = {
  name?: string;
  nickname?: string;
  profileImageUrl?: string;
};
export type UserPreferenceDto = {};
export type TransactionDto = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  user: string;
  fromAccount: string;
  toAccount: string;
  categories: string[];
};
export type AccountType =
  | 'cash'
  | 'savings'
  | 'investment'
  | 'credit'
  | 'loan'
  | 'long-term savings'
  | 'pre-assigned cash';
export type AccountDto = {
  _id: string;
  name: string;
  type: AccountType;
  balance: number;
  owner: string;
  isDeleted: boolean;
};
export type AccountBalanceChangeDto = {};
export type VisibilityType = 'income' | 'expense' | 'transfer';
export type TransactionCategoryDto = {
  _id: string;
  owner: string;
  name: string;
  visibility: VisibilityType;
  deleted: boolean;
  parent_category_id: string;
};
export type TransactionCategoryMappingDto = {};
export type TransactionTemplateType = 'manual' | 'auto';
export type TransactionType = 'income' | 'expense' | 'transfer' | 'any';
export type TransactionTemplateDto = {
  _id: string;
  templateName: string;
  templateType: TransactionTemplateType;
  templateVisibility: TransactionType;
  amount: number;
  description: string;
  dayOfMonth: number;
  dayOfMonthToCreate: number;
  userId: string;
  fromAccount: string;
  toAccount: string;
  categories: string;
};
export type UserDataExportDto = {
  user: UserDto;
  userPreferences: UserPreferenceDto[];
  transactions: TransactionDto[];
  accounts: AccountDto[];
  accountBalanceChanges: AccountBalanceChangeDto[];
  transactionCategories: TransactionCategoryDto[];
  transactionCategoryMappings: TransactionCategoryMappingDto[];
  transactionTemplates: TransactionTemplateDto[];
};
export type UserDataImportDto = {
  userPreferences: UserPreferenceDto[];
  transactions: TransactionDto[];
  accounts: AccountDto[];
  accountBalanceChanges: AccountBalanceChangeDto[];
  transactionCategories: TransactionCategoryDto[];
  transactionCategoryMappings: TransactionCategoryMappingDto[];
  transactionTemplates: TransactionTemplateDto[];
};
export type Role = 'admin' | 'test-user';
export type UpdateUserDto = {
  name?: string;
  nickname?: string;
  githubId?: string;
  auth0Id?: string;
  profileImageUrl?: string;
  roles?: Role[];
};
export type CreateAccountDto = {
  name: string;
  type: AccountType;
  balance: number;
  owner: string;
  isDeleted: boolean;
};
export type UpdateAccountDto = {
  name?: string;
  type?: AccountType;
  balance?: number;
  owner?: string;
  isDeleted?: boolean;
};
export type AccountBalanceHistoryDto = {};
export type PaginationDto = {
  currentPage: number;
  totalPageCount: number;
  totalRowCount: number;
  limit: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: object;
};
export type TransactionMonthSummaryDto = {
  _id: object;
  count: number;
  totalAmount: number;
};
export type CreateTransactionCategoryDto = {
  name: string;
  visibility: VisibilityType;
  deleted: boolean;
  parent_category_id: string;
};
export type UpdateTransactionCategoryDto = {
  name?: string;
  visibility?: VisibilityType;
  deleted?: boolean;
  parent_category_id?: string;
};
export type UpdateUserPreferenceDto = {};
export type CreateTransactionTemplateDto = {
  templateName: string;
  templateType: TransactionTemplateType;
  templateVisibility: TransactionType;
  amount: number;
  description: string;
  dayOfMonth: number;
  dayOfMonthToCreate: number;
  fromAccount: string;
  toAccount: string;
  categories: string;
};
export type UpdateTransactionTemplateDto = {
  templateName?: string;
  templateType?: TransactionTemplateType;
  templateVisibility?: TransactionType;
  amount?: number;
  description?: string;
  dayOfMonth?: number;
  dayOfMonthToCreate?: number;
  fromAccount?: string;
  toAccount?: string;
  categories?: string;
};
export type ExpenseDto = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  user: string;
  fromAccount: string;
  categories: string[];
};
export type CreateExpenseDto = {
  amount: number;
  description: string;
  date: string;
  fromAccount: string;
  categories: string[];
};
export type UpdateExpenseDto = {
  amount?: number;
  description?: string;
  date?: string;
  fromAccount?: string;
  categories?: string[];
};
export type IncomeDto = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  user: string;
  toAccount: string;
  categories: string[];
};
export type CreateIncomeDto = {
  amount: number;
  description: string;
  date: string;
  toAccount: string;
  categories: string[];
};
export type UpdateIncomeDto = {
  amount?: number;
  description?: string;
  date?: string;
  toAccount?: string;
  categories?: string[];
};
export type TransferDto = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  user: string;
  fromAccount: string;
  toAccount: string;
  categories: string[];
};
export type CreateTransferDto = {
  amount: number;
  description: string;
  date: string;
  fromAccount: string;
  toAccount: string;
  categories: string[];
};
export type UpdateTransferDto = {
  amount?: number;
  description?: string;
  date?: string;
  fromAccount?: string;
  toAccount?: string;
  categories?: string[];
};
export const {
  useAuthControllerGetAuthenticationStatusQuery,
  useAuthControllerLoginGithubQuery,
  useAuthControllerLoginAuth0Query,
  useAuthControllerLoginGithubCallbackQuery,
  useAuthControllerLoginAuth0CallbackQuery,
  useAuthControllerLogoutQuery,
  useAuthControllerLogoutAuth0Query,
  useUsersControllerFindOwnUserQuery,
  useUsersControllerUpdateOwnUserMutation,
  useUsersControllerGetAllOwnUserDataQuery,
  useUsersControllerOverrideAllOwnUserDataMutation,
  useUsersControllerFindAllQuery,
  useUsersControllerFindOneQuery,
  useUsersControllerUpdateMutation,
  useUsersControllerGetAllOneUserDataQuery,
  useAccountsControllerCreateMutation,
  useAccountsControllerFindAllByUserQuery,
  useAccountsControllerFindOneQuery,
  useAccountsControllerUpdateMutation,
  useAccountsControllerRemoveMutation,
  useAccountsControllerGetAccountBalanceHistoryQuery,
  useTransactionsControllerFindAllByUserQuery,
  useTransactionsControllerFindMonthlySummariesByUserQuery,
  useTransactionsControllerFindAllByAccountQuery,
  useTransactionsControllerFindOneQuery,
  useTransactionCategoriesControllerCreateMutation,
  useTransactionCategoriesControllerFindAllByUserQuery,
  useTransactionCategoriesControllerFindOneQuery,
  useTransactionCategoriesControllerUpdateMutation,
  useTransactionCategoriesControllerRemoveMutation,
  useTransactionCategoriesControllerGetCategorySummaryQuery,
  useUserPreferencesControllerFindAllQuery,
  useUserPreferencesControllerUpdateMutation,
  useUserPreferencesControllerFindOneQuery,
  useTransactionTemplatesControllerCreateMutation,
  useTransactionTemplatesControllerFindAllByUserQuery,
  useTransactionTemplatesControllerFindAllManualTypeByUserQuery,
  useTransactionTemplatesControllerFindOneQuery,
  useTransactionTemplatesControllerUpdateMutation,
  useTransactionTemplatesControllerRemoveMutation,
  useExpensesControllerFindAllByUserQuery,
  useExpensesControllerCreateMutation,
  useExpensesControllerFindMonthlySummariesByuserQuery,
  useExpensesControllerFindOneQuery,
  useExpensesControllerUpdateMutation,
  useExpensesControllerRemoveMutation,
  useIncomesControllerFindAllByUserQuery,
  useIncomesControllerCreateMutation,
  useIncomesControllerFindMonthlySummariesByuserQuery,
  useIncomesControllerFindOneQuery,
  useIncomesControllerUpdateMutation,
  useIncomesControllerRemoveMutation,
  useTransfersControllerFindAllByUserQuery,
  useTransfersControllerCreateMutation,
  useTransfersControllerFindMonthlySummariesByuserQuery,
  useTransfersControllerFindOneQuery,
  useTransfersControllerUpdateMutation,
  useTransfersControllerRemoveMutation,
  useHealthCheckControllerStuffQuery,
} = injectedRtkApi;
