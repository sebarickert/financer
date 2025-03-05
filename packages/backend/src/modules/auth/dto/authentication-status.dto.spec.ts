import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AuthenticationStatusDto } from './authentication-status.dto';

import { UserDto } from '@/users/dto/user.dto';

describe('AuthenticationStatusDto', () => {
  const validUserDto = {
    name: '',
    nickname: '',
    githubId: null,
    auth0Id: null,
    profileImageUrl: null,
    roles: [],
    theme: 'AUTO',
  } as unknown as UserDto;

  const validDto = {
    authenticated: true,
    payload: validUserDto,
    hasAccounts: true,
  };

  describe('constructor', () => {
    it('should create a valid DTO instance with all properties', () => {
      const dto = new AuthenticationStatusDto(validDto);

      expect(dto).toBeDefined();
      expect(dto.authenticated).toEqual(validDto.authenticated);
      expect(dto.payload).toEqual(validDto.payload);
      expect(dto.hasAccounts).toEqual(validDto.hasAccounts);
    });

    it('should create a valid DTO instance with partial properties', () => {
      const partialDto = new AuthenticationStatusDto({ authenticated: true });

      expect(partialDto).toBeDefined();
      expect(partialDto.authenticated).toEqual(true);
      expect(partialDto.payload).toBeUndefined();
      expect(partialDto.hasAccounts).toBeUndefined();
    });

    it('should create an empty DTO instance when no data is provided', () => {
      const dto = new AuthenticationStatusDto();

      expect(dto).toBeDefined();
      expect(dto.authenticated).toBeUndefined();
      expect(dto.payload).toBeUndefined();
      expect(dto.hasAccounts).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should validate a valid full DTO', async () => {
      const dto = plainToInstance(AuthenticationStatusDto, validDto);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate a valid partial DTO', async () => {
      const dto = plainToInstance(AuthenticationStatusDto, {
        authenticated: true,
      });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate an empty DTO', async () => {
      const dto = plainToInstance(AuthenticationStatusDto, {});
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});
