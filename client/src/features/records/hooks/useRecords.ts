import { useContext, useEffect, useMemo, useState } from "react";
import { AuthenticationContext, api } from "../../core";

export default function useRecords() {
  const [data, setData] = useState<
    {
      operation_type: string;
      operation_response: string;
      amount: number;
      date: string;
      user_balance: number;
      id: number;
    }[]
  >([]);
  const [total, setTotal] = useState(1);
  const [page, setPage] = useState(1);
  const [filtersState, _setFiltersState] = useState<
    {
      field: string;
      operation: string;
      value: string;
    }[]
  >([]);
  const [sortsState, _setSortsState] = useState<
    {
      field: string;
      order: "asc" | "desc";
    }[]
  >([]);
  const { isAuthenticated } = useContext(AuthenticationContext);

  const searchParams = useMemo(() => {
    const fieldsReference = {
      operation_type: "operation-type",
      operation_response: "operation-response",
      user_balance: "user-balance",
    };
    const queryParams = {
      page: page,
    } as {
      page: number;
      "filter-fields"?: string[];
      "filter-operations"?: string[];
      "filter-values"?: string[];
      "sorting-fields"?: string[];
      "sorting-orders"?: string[];
    };
    for (const filter of filtersState) {
      if (queryParams["filter-fields"])
        queryParams["filter-fields"].push(
          fieldsReference[filter.field as keyof typeof fieldsReference]
            ? fieldsReference[filter.field as keyof typeof fieldsReference]
            : filter.field
        );
      else
        queryParams["filter-fields"] = [
          fieldsReference[filter.field as keyof typeof fieldsReference]
            ? fieldsReference[filter.field as keyof typeof fieldsReference]
            : filter.field,
        ];

      if (queryParams["filter-operations"])
        queryParams["filter-operations"].push(filter.operation);
      else queryParams["filter-operations"] = [filter.operation];

      if (queryParams["filter-values"])
        queryParams["filter-values"].push(filter.value);
      else queryParams["filter-values"] = [filter.value];
    }

    for (const sort of sortsState) {
      if (queryParams["sorting-fields"])
        queryParams["sorting-fields"].push(
          fieldsReference[sort.field as keyof typeof fieldsReference]
            ? fieldsReference[sort.field as keyof typeof fieldsReference]
            : sort.field
        );
      else
        queryParams["sorting-fields"] = [
          fieldsReference[sort.field as keyof typeof fieldsReference]
            ? fieldsReference[sort.field as keyof typeof fieldsReference]
            : sort.field,
        ];

      if (queryParams["sorting-orders"])
        queryParams["sorting-orders"].push(sort.order);
      else queryParams["sorting-orders"] = [sort.order];
    }
    return queryParams;
  }, [page, filtersState, sortsState]);

  const stringfiedFilters = JSON.stringify(filtersState);
  const stringfiedSorts = JSON.stringify(sortsState);

  function fetchData() {
    if (isAuthenticated) {
      api
        .get<{
          pagination: {
            page: number;
            total: number;
          };
          records: {
            operation_type: string;
            operation_response: string;
            amount: number;
            date: string;
            user_balance: number;
            id: number;
          }[];
        }>("/records", { params: searchParams }, { isAuthenticated: true })
        .then((response) => {
          if (response.response.data.data) {
            setTotal(response.response.data.data.pagination.total);
            setData(response.response.data.data.records);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, stringfiedSorts, page, stringfiedFilters]);

  return {
    data: data,
    fetchData,
    error: {},
    page,
    total,
    setPage,
    filtersState,
    setFiltersState: (filters: typeof filtersState) => {
      setPage(1);
      _setFiltersState(filters);
    },
    sortsState,
    setSortsState: (sorts: typeof sortsState) => _setSortsState(sorts),
  };
}
