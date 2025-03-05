import { UserDataImportDto } from './user-data-import.dto';

describe('UserDataImportDto', () => {
  it('should create an empty instance', () => {
    const dto = new UserDataImportDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with provided properties', () => {
    const dto = new UserDataImportDto({
      userPreferences: [],
      transactions: [],
      accounts: [],
      accountBalanceChanges: [],
      transactionCategories: [],
      transactionCategoryMappings: [],
      transactionTemplates: [],
      transactionTemplateLogs: [],
    });

    expect(dto).toBeDefined();
    expect(dto.userPreferences).toEqual([]);
    expect(dto.transactions).toEqual([]);
    expect(dto.accounts).toEqual([]);
    expect(dto.accountBalanceChanges).toEqual([]);
    expect(dto.transactionCategories).toEqual([]);
    expect(dto.transactionCategoryMappings).toEqual([]);
    expect(dto.transactionTemplates).toEqual([]);
    expect(dto.transactionTemplateLogs).toEqual([]);
  });

  it('should create an instance with partial properties', () => {
    const dto = new UserDataImportDto({
      userPreferences: [],
      transactions: [],
      accounts: [],
      accountBalanceChanges: [],
      transactionCategories: [],
      transactionCategoryMappings: [],
      transactionTemplates: [],
      transactionTemplateLogs: [],
    });

    expect(dto).toBeDefined();
    expect(dto.userPreferences).toEqual([]);
    expect(dto.transactions).toEqual([]);
  });

  it('should not contain user property', () => {
    const dto = new UserDataImportDto();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    expect((dto as any).user).toBeUndefined();
  });
});
