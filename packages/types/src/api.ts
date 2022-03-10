export interface IApiResponse<T> {
  authenticated: boolean;
  errors?: string[];
  payload: T;
  status: number;
}