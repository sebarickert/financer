import { StartQueryActionCreatorOptions } from '@reduxjs/toolkit/query';

import {
  emptyFinancerApi,
  EndpointName,
  FinancerApiEndpointName,
} from '$api/emptyFinancerApi';
import { financerApi } from '$api/generated/financerApi';
import { createStore } from '$store';

type ArgType<EndpointNameType extends EndpointName> =
  EndpointNameType extends FinancerApiEndpointName
    ? Parameters<
        (typeof financerApi.endpoints)[EndpointNameType]['initiate']
      >[0]
    : never;

type EndpointReturnType<EndpointNameType extends EndpointName> =
  EndpointNameType extends FinancerApiEndpointName
    ? ReturnType<
        ReturnType<(typeof financerApi.endpoints)[EndpointNameType]['initiate']>
      >
    : never;

export const getServerData = async <EndpointNameType extends EndpointName>(
  endpointName: EndpointNameType,
  args?: ArgType<EndpointNameType>,
  options?: StartQueryActionCreatorOptions,
): Promise<EndpointReturnType<EndpointNameType>> => {
  const getEndpoint = () => {
    if (endpointName in emptyFinancerApi.endpoints) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (emptyFinancerApi.endpoints as any)[endpointName];
    } else if (endpointName in financerApi.endpoints) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (financerApi.endpoints as any)[endpointName];
    }
  };

  const endpoint = getEndpoint();

  // We have to create new store for each request to shared cache between requests
  const store = createStore();

  const result = store.dispatch(
    endpoint.initiate(args, options),
  ) as EndpointReturnType<EndpointNameType>;

  const data = await result; // NOSONAR

  // @ts-expect-error - We have to unsubscribe the query to avoid memory leaks
  result.unsubscribe();

  return data;
};
