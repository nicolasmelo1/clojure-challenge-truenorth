import {
  QueryKey,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { Dispatch, SetStateAction } from "react";
import { ZodType } from "zod";

import { CustomRequestParamsType } from "../utils/api/types";
import { ValidationError } from "../utils/validate";

export enum MutationTypes {
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}
export type PaginatedData<D> = {
  pagination: {
    cursor: string | number;
  };
  data: D;
};

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type ValidationErrorDataType<T> = {
  [P in keyof T]?: string[];
};

export type OptionalUseHooksParamsType<T, R> = {
  initialState?: R;
  customSetState?: Dispatch<SetStateAction<R | undefined>>;
  customRequestParams?: CustomRequestParamsType;
  validationGroups?: string[];
  requestParams?: AxiosRequestConfig<T>;
  paginationCallback?: (data: {
    cursor: number | string;
  }) => void | Promise<void>;
};

export type OptionalUseFetchParamsType<T, R = T> = {
  useQueryParams?: UseQueryOptions<R, ValidationError<T>>;
  zodSchema?: ZodType;
} & OptionalUseHooksParamsType<T, R>;

export type OptionalUseInfiniteFetchParamsType<T, R = T> = {
  useInfiniteQueryParams?: UseInfiniteQueryOptions<
    PaginatedData<R[]>,
    ValidationError<T>
  >;
  zodSchema?: ZodType;
  pageParam?: {
    name: string;
  };
} & OptionalUseHooksParamsType<T, R> & {
    initialState?: R[];
    customSetState?: Dispatch<SetStateAction<R[]>>;
  };

export type FetchMutateParams<D> = {
  data: D;
  customOptions?: {
    customQueryKeys?: QueryKey | QueryKey[];
    customUrl?: string;
    customMethodType?: MutationTypes;
    customRequestParams?: OptionalUseHooksParamsType<
      D,
      unknown
    >["customRequestParams"];
  };
};

export type OptionalUseMutateParamsType<T, R = T> = {
  useMutationParams?: UseMutationOptions<
    R | void,
    ValidationError<T>,
    FetchMutateParams<T>
  >;
  shouldInvalidateQueries?: boolean;
  /**
   * by design, the useMutate hook will mutate the ref of the url and queryKey, if you want to prevent this mutation you can set this flag to true.
   */
  preventRefMutation?: boolean;
} & OptionalUseHooksParamsType<T, R>;
