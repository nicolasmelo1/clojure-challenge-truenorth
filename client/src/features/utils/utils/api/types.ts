import { AxiosResponse } from "axios";

export type CustomRequestParamsType = {
  isAuthenticated: boolean;
  isADifferentServer?: boolean;
};

export type ExceptionObserverCallbackType = (
  response: AxiosResponse | undefined,
  makeRequestAgain: () => void
) => Promise<void> | void;

export type ExceptionObserverCallbacksType = {
  [callbackName: string]: ExceptionObserverCallbackType;
};

export type ResponseType<R, D> = {
  abort: AbortController | null;
  response: AxiosResponse<R, D>;
};

export type TokensType = {
  token: string;
  refreshToken: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResponseData<T = any> = {
  data: T;
  status: "client-error" | "server-error" | "success" | "redirect";
};
