import { AxiosResponse } from "axios";

import {
  ExceptionObserverCallbacksType,
  ExceptionObserverCallbackType,
} from "./types";

export default function initializeExceptionsObserver() {
  const callbacks: ExceptionObserverCallbacksType = {};

  function addCallback(
    callback: ExceptionObserverCallbackType,
    callbackName: string | null = null
  ) {
    if (callbackName === null) callbackName = callback.name;
    callbacks[callbackName] = callback;
  }

  async function fireHandlers<D>(
    response: AxiosResponse<D> | undefined,
    makeRequestAgain: () => void
  ) {
    const callbacksToCall = Object.values(callbacks);
    const promises = callbacksToCall.map((callback) =>
      Promise.resolve(callback(response, makeRequestAgain))
    );
    await Promise.all(promises);
  }

  return {
    addCallback,
    fireHandlers,
  };
}
