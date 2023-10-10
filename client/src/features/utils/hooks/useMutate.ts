import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { ZodType } from "zod";

import {
  FetchMutateParams,
  MutationTypes,
  OptionalUseMutateParamsType,
  PaginatedData,
} from "./types";
import api from "../utils/api";
import { callPaginationCallback } from "../utils";
import { validateData, ValidationError } from "../utils/validate";
import { ResponseData } from "../utils";

/**
 * Mutate and validate the data mutated. This hook is a wrapper around react-query's
 * useMutation hook. To use it, just call `mutate` function with your data and this will
 * do the rest. This is similar to useQuery hook but it makes more sense since it validates
 * everything before sending.
 *
 * If you have many operations happening (for example a creation and a update) in the same screen
 * you will need to create one useMutate for each operation.
 *
 * Similar to useQuery hook, this hook is not opinionated in any way so you can still add your own
 * render logic when displaying the errors in the formulary to the user.
 *
 * Reference on useMutation: https://react-query.tanstack.com/guides/mutations and https://react-query.tanstack.com/reference/useMutation
 *
 * @param methodType - The request method, can be either PUT, PATCH, POST or DELETE.
 * @param queryKey - The query key of react query. Reference: https://react-query.tanstack.com/guides/query-keys#_top
 * @param url - The url you want to fetch your data from.
 * @param schema - The schema to validate.
 * @param options - Custom options for the hook
 * @param options.initialState - (optional) - The initial state of the internal state of this hook.
 * @param options.customSetState - (optional) - Custom setState function to be updated whenever the state changes inside of the hook.
 * @param options.requestParams - (optional) - If you want to add any new data to the request you can use this function.
 * @param options.useMutationParams - (optional) - Custom options for the useMutation hook.
 */
export default function useMutate<D extends object | D[], R = D>(
  methodType: MutationTypes,
  queryKey: QueryKey | QueryKey[],
  url: string,
  schema?: ZodType<D>,
  options?: OptionalUseMutateParamsType<D, R>
) {
  const [state, setState] = useState<R | null | undefined>(
    options?.initialState || null
  );
  const urlRef = useRef(url);
  const queryKeyRef = useRef(queryKey);
  const queryClient = useQueryClient();
  const { data, error, isLoading, mutate, mutateAsync } = useMutation<
    R,
    ValidationError<D>,
    FetchMutateParams<D>
  >(fetchMutate, {
    onSuccess: (data) => {
      updateState(data);
    },
    ...options?.useMutationParams,
  });

  function onInvalidateQueries(
    data: R,
    queryKey?: QueryKey | QueryKey[],
    usedMethodType: MutationTypes = methodType
  ) {
    const queryKeyToInvalidateAsStringOrArray = queryKey
      ? queryKey
      : queryKeyRef.current;
    const isQueryKeyAnArray = Array.isArray(
      queryKeyToInvalidateAsStringOrArray
    );
    const queryKeyAsArray = isQueryKeyAnArray
      ? queryKeyToInvalidateAsStringOrArray
      : [queryKeyToInvalidateAsStringOrArray];
    const isMultipleQueryKeys = queryKeyAsArray.every(
      (queryKeyOrDeeplyNestedQueryKey) =>
        Array.isArray(queryKeyOrDeeplyNestedQueryKey)
    );
    const isUpdatingOrCreating = [
      MutationTypes.PATCH,
      MutationTypes.POST,
      MutationTypes.PUT,
    ].includes(usedMethodType);

    const queryKeysToInvalidate = isMultipleQueryKeys
      ? queryKeyAsArray
      : [queryKeyAsArray];
    for (const queryKeyToInvalidate of queryKeysToInvalidate) {
      if (isUpdatingOrCreating)
        queryClient.setQueriesData(queryKeyToInvalidate, data);
      else if (options?.shouldInvalidateQueries !== false)
        queryClient.removeQueries(queryKeyToInvalidate);
      if (options?.shouldInvalidateQueries)
        void queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
    }
  }

  function updateState(data: R | undefined) {
    setState(data);
    if (options?.customSetState) options?.customSetState(data);
  }

  async function fetchMutate(data: FetchMutateParams<D>) {
    const requestParamsToUse = data.customOptions?.customRequestParams
      ? data.customOptions.customRequestParams
      : options?.requestParams;
    const methodTypeToUse = data.customOptions?.customMethodType
      ? data.customOptions.customMethodType
      : methodType;
    const queryKeyToUse: QueryKey | QueryKey[] = data.customOptions
      ?.customQueryKeys
      ? data.customOptions.customQueryKeys
      : queryKeyRef.current;
    const urlToUse = data.customOptions?.customUrl
      ? data.customOptions.customUrl
      : urlRef.current;

    if (schema && Array.isArray(data.data))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data.data as any) = await Promise.all(
        data.data.map((dataToValidate) => validateData(schema, dataToValidate))
      );
    else if (schema)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data.data as any) = await validateData(schema, data.data as object);

    try {
      const { response } = await api.request<D, R>(
        methodTypeToUse,
        urlToUse,
        {
          data: data.data,
          ...(requestParamsToUse ? requestParamsToUse : {}),
        },
        options?.customRequestParams
      );
      if (
        options?.paginationCallback &&
        "pagination" in (response.data.data as object)
      )
        await callPaginationCallback<R>(
          response.data as ResponseData<PaginatedData<R>>,
          options.paginationCallback
        );
      const responseData = response?.data.data as R;

      onInvalidateQueries(responseData, queryKeyToUse, methodTypeToUse);

      return responseData;
    } catch (error) {
      const axiosError = error as AxiosError<R, D>;
      throw new ValidationError({ data: null, request: axiosError });
    }
  }

  useEffect(() => {
    if (options?.preventRefMutation) return;
    urlRef.current = url;
    queryKeyRef.current = queryKey;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, queryKey]);

  return {
    urlRef,
    queryClient,
    data,
    isLoading,
    error,
    mutate,
    fetchMutate,
    mutateAsync,
    state,
    setState,
  };
}
