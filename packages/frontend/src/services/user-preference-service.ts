import {
  ApiResponse,
  UpdateUserPreferenceDto,
  UserPreferenceDto,
  UserPreferenceProperty,
} from '@local/types';

import { parseApiResponse, parseJsonOrThrowError } from '../utils/apiHelper';

export const getAllUserPreferences = async (): Promise<UserPreferenceDto[]> => {
  const accounts = await fetch('/api/accounts');
  return parseJsonOrThrowError(accounts);
};

export const getUserPreferenceByProperty = async (
  property: UserPreferenceProperty
): Promise<UserPreferenceDto> => {
  const userPreference = await fetch(`/api/user-preferences/${property}`);
  return parseJsonOrThrowError(userPreference);
};

export const editUserPreference = async (
  newUserPreferenceData: UpdateUserPreferenceDto
): Promise<ApiResponse<UserPreferenceDto>> => {
  const newUserPreferenceResponse = await fetch('/api/user-preferences', {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUserPreferenceData),
  });

  return parseApiResponse(newUserPreferenceResponse);
};
