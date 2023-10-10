import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  isCancel,
  Method,
} from "axios";

import initializeExceptionsObserver from "./observers";
import {
  CustomRequestParamsType,
  ResponseData,
  ResponseType,
  TokensType,
} from "./types";
import storage from "../storage";

/**
 * Responsible for making the requests inside of the application.
 */
function requests() {
  let token = "";
  let prefix = "api";
  let apiPathUrl = "http://localhost:8080";
  const exceptionObserver = initializeExceptionsObserver();

  const setApiPath = (newApiPathUrl: string) => {
    apiPathUrl = newApiPathUrl;
  };

  const setPrefix = (newPrefix: string) => {
    prefix = newPrefix;
  };

  const getUrl = (
    path: string,
    options?: {
      ignorePrefix?: boolean;
    }
  ) => {
    const isHTTPOrHTTPS = /^(http:\/\/|https:\/\/)/.test(path);
    if (isHTTPOrHTTPS) return path;
    return `${apiPathUrl}${
      prefix && prefix !== "" && !options?.ignorePrefix ? `/${prefix}` : ""
    }${path}`;
  };

  async function getTokens() {
    const secureStorage = storage.getSecureStorage();
    const accessTokenInStorage = await Promise.resolve(
      secureStorage?.getItem("accessToken")
    );
    token = accessTokenInStorage || "";

    return {
      accessToken: secureStorage ? accessTokenInStorage : "",
      refreshToken: secureStorage
        ? await Promise.resolve(secureStorage?.getItem("refreshToken"))
        : "",
    };
  }

  async function setTokens(tokens: TokensType) {
    const secureStorage = storage.getSecureStorage();
    token = tokens.token;

    if (secureStorage) {
      await Promise.all([
        Promise.resolve(secureStorage?.setItem("accessToken", tokens.token)),
        Promise.resolve(
          secureStorage?.setItem("refreshToken", tokens.refreshToken)
        ),
      ]);
    }
  }

  async function removeTokens() {
    const secureStorage = storage.getSecureStorage();

    if (secureStorage) {
      await Promise.all([
        Promise.resolve(secureStorage?.removeItem("accessToken")),
        Promise.resolve(secureStorage?.removeItem("refreshToken")),
      ]);
    }
  }

  async function request<D = unknown, R = D>(
    method: Method,
    url: string,
    requestParams?: AxiosRequestConfig<D>,
    customParams?: CustomRequestParamsType
  ): Promise<ResponseType<ResponseData<R>, D>> {
    const requestConfig = {
      method: method,
      url: getUrl(url),
      ...requestParams,
    } as AxiosRequestConfig<D>;
    const isCancelTokenDefined = requestParams?.cancelToken !== undefined;
    let abort = null;
    let isToMakeRequestAgain = false;

    function makeRequestAgain() {
      isToMakeRequestAgain = true;
    }

    async function addAuthentication(requestConfig: AxiosRequestConfig<D>) {
      const { accessToken } = await getTokens();
      const doesTokenExists = !["", null, undefined].includes(accessToken);
      if (doesTokenExists) {
        requestConfig.headers = {
          Authorization: `Bearer ${accessToken}`,
          ...requestConfig.headers,
        };
      }
    }

    async function addAbortController(requestConfig: AxiosRequestConfig<D>) {
      const controller = new AbortController();
      requestConfig.signal = controller.signal;
      return controller;
    }

    if (customParams?.isAuthenticated) await addAuthentication(requestConfig);
    if (isCancelTokenDefined === false)
      abort = await addAbortController(requestConfig);
    const response = await axios.request<
      ResponseData<R>,
      AxiosResponse<ResponseData<R>, D>,
      D
    >(requestConfig);
    return {
      response,
      abort,
    };
    try {
      const response = await axios.request<
        ResponseData<R>,
        AxiosResponse<ResponseData<R>, D>,
        D
      >(requestConfig);
      return {
        response,
        abort,
      };
    } catch (exception) {
      const axiosError = exception as AxiosError<D>;
      // This will guarantee that we will not fire the handlers for the request if the network is out for example.
      const isNotANetworkError = axiosError.code !== "ERR_NETWORK";
      if (isCancel(exception)) return {} as ResponseType<ResponseData<R>, D>;
      if (isNotANetworkError) {
        console.warn(
          "Error on request is not a network error, calling handlers",
          url,
          requestConfig,
          axiosError.response?.data
        );
        await exceptionObserver.fireHandlers<D>(
          axiosError.response,
          makeRequestAgain
        );
      }
      if (isToMakeRequestAgain) {
        return await request<D, R>(method, url, requestParams, customParams);
      } else {
        throw exception;
      }
    }
  }

  const get = <R>(
    url: string,
    requestParams?: AxiosRequestConfig,
    customParams?: CustomRequestParamsType
  ) => {
    return request<unknown, R>("GET", url, requestParams, customParams);
  };

  const del = <R>(
    url: string,
    requestParams?: AxiosRequestConfig,
    customParams?: CustomRequestParamsType
  ) => request<unknown, R>("DELETE", url, requestParams, customParams);

  const put = <D, R>(
    url: string,
    requestParams?: AxiosRequestConfig<D>,
    customParams?: CustomRequestParamsType
  ) => request<D, R>("PUT", url, requestParams, customParams);

  const patch = <D, R>(
    url: string,
    requestParams?: AxiosRequestConfig<D>,
    customParams?: CustomRequestParamsType
  ) => request<D, R>("PATCH", url, requestParams, customParams);

  const post = <D, R>(
    url: string,
    requestParams?: AxiosRequestConfig<D>,
    customParams?: CustomRequestParamsType
  ) => request<D, R>("POST", url, requestParams, customParams);

  return {
    exceptionObserver,
    getUrl,
    request,
    get,
    del,
    put,
    patch,
    post,
    setTokens,
    getTokens,
    removeTokens,
    setApiPath,
    setPrefix,
    setStorage: storage.setUnsecureStorage,
    setSecureStorage: storage.setSecureStorage,
    getToken: () => (token ? token : ""),
  };
}

export default requests();
