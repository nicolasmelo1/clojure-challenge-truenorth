import { Fragment, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTrash } from "@fortawesome/free-solid-svg-icons";

import { Selector } from "../../../core";
import * as Styled from "./Filter.styles";
import { useClickOutside } from "../../../core/hooks";
import { uuid } from "../../../core/utils";

type Props = {
  columns: {
    value: string;
    label: string;
    dataType: "number" | "string" | "date" | "operation-type";
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
  const operationOptions = useMemo(() => {
    return [
      { label: "Addition", value: "addition" },
      { label: "Subtraction", value: "subtraction" },
      { label: "Multiplication", value: "multiplication" },
      { label: "Division", value: "division" },
      { label: "Square root", value: "square_root" },
      { label: "Random String", value: "random_string" },
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
    columnDataType: "number" | "string" | "date" | "operation-type"
  ) {
    if (columnDataType === "string" || columnDataType === "operation-type")
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

  function getInputTypeByColumnDataType(
    selectedColumn: (typeof props.columns)[number] | undefined,
    isSplitted: boolean,
    placeholder: string,
    value: (typeof operationOptions)[number] | string | undefined,
    filter: (typeof filtersState)[number],
    onChange?: ((value: string) => void) | undefined
  ) {
    const isDateTypeSelected = selectedColumn?.dataType === "date";
    const isOperationTypeSelected =
      selectedColumn?.dataType === "operation-type";
    const onChangeFunction = onChange
      ? onChange
      : (value: string) => {
          filter.value = value;
          setFiltersState([...filtersState]);
        };
    if (isOperationTypeSelected)
      return (
        <Selector
          label="Operation type"
          closeOnSelect={isSplitted}
          searchPlaceholder={placeholder}
          selectedOption={value as (typeof operationOptions)[number]}
          options={operationOptions}
          onSelectOption={(option) => onChangeFunction(option)}
        />
      );
    else if (isDateTypeSelected)
      return (
        <Styled.FilterInputContainer
          $isSplitted={isSplitted}
          type="date"
          placeholder={placeholder}
          value={value as string}
          onChange={(e) => onChangeFunction(e.target.value)}
        />
      );
    else
      return (
        <Styled.FilterInputContainer
          $isSplitted={false}
          type="text"
          placeholder="Value"
          value={filter.value}
          onChange={(e) => onChangeFunction(e.target.value)}
        />
      );
  }

  return (
    <Styled.ButtonContainer ref={clickOutsideRef}>
      <Styled.FilterButton
        $selected={isShowingFilter}
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
        <Styled.FilterIconContainer>
          <FontAwesomeIcon icon={faFilter} />
        </Styled.FilterIconContainer>
      </Styled.FilterButton>
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
              const selectedOperationTypeOption = operationOptions.find(
                (operationOption) => operationOption.value === filter.value
              );
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
                      {getInputTypeByColumnDataType(
                        selectedColumn,
                        true,
                        "Value",
                        filter.value.split("<->")[0] || "",
                        filter,
                        (value) => {
                          const valueSplitted = filter.value.split("<->");
                          if (valueSplitted.length === 2) {
                            filter.value = `${value}<->${valueSplitted[1]}`;
                          } else {
                            filter.value = `${value}<->`;
                          }
                          setFiltersState([...filtersState]);
                        }
                      )}
                      {getInputTypeByColumnDataType(
                        selectedColumn,
                        true,
                        "Value",
                        filter.value.split("<->")[1] || "",
                        filter,
                        (value) => {
                          const valueSplitted = filter.value.split("<->");
                          if (valueSplitted.length === 2) {
                            filter.value = `${valueSplitted[0]}<->${value}`;
                          } else {
                            filter.value = `<->${value}`;
                          }
                          setFiltersState([...filtersState]);
                        }
                      )}
                    </Fragment>
                  ) : (
                    getInputTypeByColumnDataType(
                      selectedColumn,
                      false,
                      "",
                      selectedOperationTypeOption,
                      filter
                    )
                  )}
                  <Styled.FilterButton
                    $selected={false}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFiltersState(
                        filtersState?.filter((f) => f.uuid !== filter.uuid)
                      );
                    }}
                  >
                    {"Remove"}
                    <FontAwesomeIcon icon={faTrash} />
                  </Styled.FilterButton>
                </Styled.DropdownInputContainer>
              );
            })}
            <Styled.BottomButtonsContainer>
              <Styled.FilterButton
                $selected={true}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onAddFilterClick();
                }}
              >
                {"Add new filter"}
              </Styled.FilterButton>
              <Styled.ResetAndApplyButtonsContainer>
                <Styled.FilterButton
                  $selected={false}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    props.onApply([]);
                    onCloseFilter([]);
                  }}
                >
                  {"Reset"}
                </Styled.FilterButton>
                <Styled.FilterButton
                  $selected={true}
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
                </Styled.FilterButton>
              </Styled.ResetAndApplyButtonsContainer>
            </Styled.BottomButtonsContainer>
          </Styled.DropdownInnerContainer>
        </Styled.DropdownContainer>
      ) : null}
    </Styled.ButtonContainer>
  );
}
