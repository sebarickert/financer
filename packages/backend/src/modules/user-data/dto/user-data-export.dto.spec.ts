import { UserDataExportDto } from './user-data-export.dto';

import { UserDto } from '@/users/dto/user.dto';

describe('UserDataExportDto', () => {
  it('should create an empty instance', () => {
    const dto = new UserDataExportDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with provided properties', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
    } as unknown as UserDto;

    const dto = new UserDataExportDto({
      user: mockUser,
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
    expect(dto.user).toBe(mockUser);
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
    const mockUser = {
      id: '1',
      email: 'test@example.com',
    } as unknown as UserDto;

    const dto = new UserDataExportDto({
      user: mockUser,
      userPreferences: [],
      accountBalanceChanges: [],
      transactions: [],
      accounts: [],
      transactionCategories: [],
      transactionCategoryMappings: [],
      transactionTemplates: [],
      transactionTemplateLogs: [],
    });

    expect(dto).toBeDefined();
    expect(dto.user).toBe(mockUser);
    expect(dto.userPreferences).toEqual([]);
    expect(dto.accountBalanceChanges).toEqual([]);
    expect(dto.transactions).toEqual([]);
    expect(dto.accounts).toEqual([]);
    expect(dto.transactionCategories).toEqual([]);
    expect(dto.transactionCategoryMappings).toEqual([]);
    expect(dto.transactionTemplates).toEqual([]);
    expect(dto.transactionTemplateLogs).toEqual([]);
  });
});
