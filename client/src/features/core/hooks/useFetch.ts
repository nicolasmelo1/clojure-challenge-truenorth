import {
  QueryFunctionContext,
  QueryKey,
  useQuery,
} from "@tanstack/react-query";

import { OptionalUseFetchParamsType } from "./types";
import api from "../utils/api";
import { validateData, ValidationError } from "../utils/validate";
import { useCallback } from "react";

/**
 * This function is supposed to be just a wrapper around react-query useQuery hook. It's not
 * intended for it to be too much opinionated so you are free to use however you like.
 * The only idea is to validate the data received from the backend as we used to do with Entities.
 *
 * So suppose the following example:
 *
 * ```
 * import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
 *
 * export class UserDto {
 *  @IsString()
 *  @IsNotEmpty()
 *  @IsEmail()
 *  email!: string;
 *
 *  @IsString()
 *  @IsNotEmpty()
 *  firstName!: string;
 *
 *  @IsString()
 *  @IsNotEmpty()
 *  secondName!: string;
 * }
 *
 * function UserComponent() {
 *   const { data, state, setState, isLoading, error } = useFetch(['user', userId], '/auth/users', UserDto, {
 *      useQueryParams: {
 *        //here we can pass the react query params  example: {refetchOnWindowFocus: false} also cache time
 *        staleTime: 1000 * 60, // 1 minute
 *      }
 *   });
 *
 *   if (data) {
 *      return <div>{`Hello ${data.firstName} ${data.lastName}`}</div>
 *   }
 *
 *   if (error) {
 *      return (
 *        <div>
 *          <h2>{`The data following errors occurred:`}<h2>
 *          {error?.data?.firstName.map((index, error) => (
 *            <p key={index}>{error}</p>
 *          ))}
 *        </div>
 *      );
 *   }
 *   return Loading...
 * }
 * ```
 *
 * If you are working with arrays just add this:
 * ```
 * const { data, state, setState, isLoading, error } = useFetch<UserDto[]>(['user', userId], '/auth/users', UserDto, {
 *      useQueryParams: {
 *        //here we can pass the react query params  example: {refetchOnWindowFocus: false} also cache time
 *        staleTime: 1000 * 60, // 1 minute
 *      }
 *   });
 * ```
 *
 * `data` will be an array now.
 *
 * Reference on useQuery:https://tanstack.com/query/v3/docs/react/guides/queries and https://react-query.tanstack.com/reference/useQuery
 *
 * @param queryKey - The query key of react query. Reference: https://react-query.tanstack.com/guides/query-keys#_top
 * @param url - The url you want to fetch your data from.
 * @param options - Custom options for the hook
 * @param options.initialState - (optional) - The initial state of the internal state of this hook.
 * @param options.customSetState - (optional) - Custom setState function to be updated whenever the state changes inside of the hook.
 * @param options.requestParams - (optional) - If you want to add any new data to the request you can use this function.
 * @param options.useQueryParams - (optional) - Custom options for the useQuery hook.
 */
export default function useFetch<T extends object | T[]>(
  queryKey: QueryKey,
  url: string,
  options?: OptionalUseFetchParamsType<T>
) {
  const { isLoading, error, data, isFetching, isPreviousData, refetch } =
    useQuery<T, ValidationError<T>>({
      queryKey,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      queryFn: useCallback(fetchRequest, []),
      ...options?.useQueryParams,
    });

  function updateState(data: T | null | undefined) {
    if (options?.customSetState) {
      options?.customSetState(data as T);
    }
  }

  async function fetchRequest({ signal }: QueryFunctionContext) {
    const { response } = await api.get<T>(
      url,
      { ...options?.requestParams, signal: signal },
      options?.customRequestParams
    );
    const responseData: T = response.data.data;
    const isResponseAnArray = Array.isArray(responseData);

    updateState(responseData);
    if (isResponseAnArray) {
      return responseData.map((data: T) =>
        options?.zodSchema ? validateData(options.zodSchema, data) : data
      ) as T;
    } else {
      return options?.zodSchema
        ? validateData(options.zodSchema, responseData)
        : responseData;
    }
  }

  return {
    isLoading,
    isFetching,
    isPreviousData,
    refetch,
    error,
    data,
  };
}
