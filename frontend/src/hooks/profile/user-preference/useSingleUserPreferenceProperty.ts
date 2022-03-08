import { useEffect, useState } from 'react';

import {
  UserPreferenceProperties,
  useUserPreferences,
} from './useUserPreferences';

export const useSingleUserPreferenceProperty = <PropertyPayload>(
  targetUserPreferenceProperty: UserPreferenceProperties
): [PropertyPayload | undefined, (value: PropertyPayload) => void] => {
  const [userPreferences, setUserPreferences] = useUserPreferences();
  const [propertyValue, setPropertyValue] = useState<
    PropertyPayload | undefined
  >(undefined);

  useEffect(() => {
    const newPropertyValue = userPreferences.find(
      ({ type }) => type === targetUserPreferenceProperty
    )?.payload;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPropertyValue(newPropertyValue as any);
  }, [targetUserPreferenceProperty, userPreferences]);

  const setNewPropertyValue = (value: PropertyPayload) => {
    setUserPreferences([
      ...userPreferences.filter(
        ({ type }) => type !== targetUserPreferenceProperty
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { type: targetUserPreferenceProperty, payload: value as any },
    ]);
  };

  return [propertyValue, setNewPropertyValue];
};
