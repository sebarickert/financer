export interface ApiResponseWithStatus<PayloadType> {
  status: number;
  payload: PayloadType;
  errors?: string[];
}
export interface IApiResponse<PayloadType> {
  authenticated: boolean;
  errors?: string[];
  payload: PayloadType;
  status: number;
}