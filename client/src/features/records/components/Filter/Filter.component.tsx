import { Fragment, useMemo, useState } from "react";

import { Selector } from "../../../utils";
import * as Styled from "./Filter.styles";
import { useClickOutside } from "../../../utils/hooks";
import { uuid } from "../../../utils/utils";

type Props = {
  columns: {
    value: string;
    label: string;
    dataType: "number" | "string" | "date";
  }[];
  filters: {
    field: string;
    operation: string;
    value: string;
  }[];
  onApply: (filter: Props["filters"]) => void;
};
export default function Filter(props: Props) {
  const [isShowingFilter, setIsShowingFilter] = useState(false);
  const [filtersState, setFiltersState] = useState<
    {
      uuid: string;
      field: string;
      operation: string;
      value: string;
    }[]
  >(
    Array.isArray(props.filters)
      ? props.filters.map((filter) => {
          return {
            uuid: uuid(),
            field: filter.field,
            operation: filter.operation,
            value: filter.value,
          };
        })
      : []
  );
  const filterOperationOptions = useMemo(() => {
    return [
      { label: "is equal", value: "equal" },
      { label: "is between", value: "between" },
      { label: "is greater than", value: "greater-than" },
      { label: "is less than", value: "less-than" },
      { label: "is not equal", value: "not-equal" },
    ];
  }, []);

  const clickOutsideRef = useClickOutside(() => {
    onCloseFilter();
  });

  function onCloseFilter(newFiltersState?: typeof filtersState) {
    const filteredFiltersState = newFiltersState
      ? newFiltersState
      : filtersState.filter(
          (filterState) =>
            filterState.value !== "" &&
            filterState.field !== "" &&
            filterState.operation !== ""
        );
    setIsShowingFilter(false);
    setFiltersState(filteredFiltersState);
  }

  function onFilterClick() {
    setIsShowingFilter(!isShowingFilter);
  }

  function getFilteredOperationOptionsByColumnDataType(
    columnDataType: "number" | "string" | "date"
  ) {
    if (columnDataType === "string")
      return filterOperationOptions.filter(
        (filterOperationOption) =>
          !["between", "greater-than", "less-than"].includes(
            filterOperationOption.value
          )
      );
    else return filterOperationOptions;
  }

  function onAddFilterClick() {
    setFiltersState([
      ...(filtersState ?? []),
      {
        uuid: uuid(),
        field: "",
        operation: "",
        value: "",
      },
    ]);
  }

  return (
    <Styled.ButtonContainer ref={clickOutsideRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onFilterClick();
        }}
      >
        {props.filters.length > 0
          ? `${props.filters.length} ${
              props.filters.length > 1 ? "filters" : "filter"
            } selected`
          : "Add filter"}
      </button>
      {isShowingFilter ? (
        <Styled.DropdownContainer>
          <Styled.DropdownInnerContainer>
            {filtersState?.map((filter) => {
              const selectedColumn = props.columns.find(
                (column) => column.value === filter.field
              );
              const filteredOperationOptions =
                getFilteredOperationOptionsByColumnDataType(
                  selectedColumn?.dataType || "string"
                );
              const isBetweenOperationSelected = filter.operation === "between";
              return (
                <Styled.DropdownInputContainer key={filter.uuid}>
                  <Styled.SelectorContainer>
                    <Selector
                      label="Field type"
                      closeOnSelect={true}
                      searchPlaceholder="Search for a field"
                      selectedOption={selectedColumn}
                      options={props.columns}
                      onSelectOption={(option) => {
                        filter.field = option;
                        filter.value = "";
                        setFiltersState([...filtersState]);
                      }}
                    />
                  </Styled.SelectorContainer>
                  <Styled.SelectorContainer>
                    <Selector
                      label="Operation type"
                      closeOnSelect={true}
                      searchPlaceholder="Search for an operation"
                      selectedOption={filterOperationOptions.find(
                        (filterOperationOption) =>
                          filterOperationOption.value === filter.operation
                      )}
                      options={filteredOperationOptions}
                      onSelectOption={(option) => {
                        filter.operation = option;
                        setFiltersState([...filtersState]);
                      }}
                    />
                  </Styled.SelectorContainer>
                  {isBetweenOperationSelected ? (
                    <Fragment>
                      <Styled.FilterInputContainer
                        $isSplitted={true}
                        type="text"
                        placeholder="Value"
                        value={filter.value.split("<->")[0] || ""}
                        onChange={(e) => {
                          const valueSplitted = filter.value.split("<->");
                          if (valueSplitted.length === 2) {
                            filter.value = `${e.target.value}<->${valueSplitted[1]}`;
                          } else {
                            filter.value = `${e.target.value}<->`;
                          }
                          setFiltersState([...filtersState]);
                        }}
                      />
                      <Styled.FilterInputContainer
                        $isSplitted={true}
                        type="text"
                        placeholder="Value"
                        value={filter.value.split("<->")[1] || ""}
                        onChange={(e) => {
                          const valueSplitted = filter.value.split("<->");
                          if (valueSplitted.length === 2) {
                            filter.value = `${valueSplitted[0]}<->${e.target.value}`;
                          } else {
                            filter.value = `<->${e.target.value}`;
                          }
                          setFiltersState([...filtersState]);
                        }}
                      />
                    </Fragment>
                  ) : (
                    <Styled.FilterInputContainer
                      $isSplitted={false}
                      type="text"
                      placeholder="Value"
                      value={filter.value}
                      onChange={(e) => {
                        filter.value = e.target.value;
                        setFiltersState([...filtersState]);
                      }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFiltersState(
                        filtersState?.filter((f) => f.uuid !== filter.uuid)
                      );
                    }}
                  >
                    {"Remove"}
                  </button>
                </Styled.DropdownInputContainer>
              );
            })}
            <Styled.BottomButtonsContainer>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onAddFilterClick();
                }}
              >
                {"+"}
              </button>
              <div>
                <button
                  type="button"
                  disabled={filtersState?.length === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    props.onApply([]);
                    onCloseFilter([]);
                  }}
                >
                  {"Reset"}
                </button>
                <button
                  type="button"
                  disabled={filtersState?.length === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    const filteredFiltersState = filtersState.filter(
                      (filterState) =>
                        filterState.value !== "" &&
                        filterState.field !== "" &&
                        filterState.operation !== ""
                    );
                    props.onApply(filteredFiltersState);
                    onCloseFilter(filteredFiltersState);
                  }}
                >
                  {"Apply"}
                </button>
              </div>
            </Styled.BottomButtonsContainer>
          </Styled.DropdownInnerContainer>
        </Styled.DropdownContainer>
      ) : null}
    </Styled.ButtonContainer>
  );
}
