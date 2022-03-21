export enum SuccessApifulResponseCode {
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
}

type ApiErrorResponse = {
  status: number;
  error: string;
  message: string | string[];
};

type ApiSuccessResponse<PayloadType> = {
  status: SuccessApifulResponseCode;
  payload: PayloadType;
};

export type ApiResponse<PayloadType> =
  | ApiSuccessResponse<PayloadType>
  | ApiErrorResponse;
export interface IApiResponse<PayloadType> {
  authenticated: boolean;
  errors?: string[];
  payload: PayloadType;
  status: number;
}
