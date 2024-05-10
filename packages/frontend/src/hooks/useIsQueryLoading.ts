/* eslint-disable @typescript-eslint/no-explicit-any */

import { EndpointName } from '$api/emptyFinancerApi';
import { useAppSelector } from '$store/*';

export const useIsQueryLoading = (...targetEndpoints: EndpointName[]) => {
  return useAppSelector(
    (state: any) =>
      state.api &&
      [
        ...(Object.values((state.api as any).queries) as any[]),
        ...(Object.values((state.api as any).mutations) as any[]),
      ]
        .filter(
          ({ endpointName }) =>
            targetEndpoints.length === 0 ||
            targetEndpoints.includes(endpointName)
        )
        .some(({ status }) => status === 'pending')
  );
};
