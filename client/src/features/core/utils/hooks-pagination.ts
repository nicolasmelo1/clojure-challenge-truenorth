import { OptionalUseHooksParamsType } from "../hooks/types";
import { ResponseData } from "./api/types";

/**
 * Responsible for calling the pagination callback so we can update the pagination state when a new request comes. This is all handled automatically.
 *
 * You still need to explicitly set the pagination in the request params though, we do not add it automatically for you because we don't want to
 * be opinionated
 *
 * @param data - The data returned from the request
 * @param options - The options passed to the useMutate or useFetch hook
 */
export default async function callPaginationCallback<D, R = D>(
  data: ResponseData<{
    pagination: {
      cursor: string | number;
    };
    data: D;
  }>,
  paginationCallback: OptionalUseHooksParamsType<D, R>["paginationCallback"]
) {
  const doesResponseHavePagination =
    typeof data.data.pagination === "object" && data.data.pagination !== null;
  const isPaginationCallbackDefined = typeof paginationCallback === "function";

  if (doesResponseHavePagination && isPaginationCallbackDefined) {
    await Promise.resolve(paginationCallback(data.data.pagination));
  }
}
