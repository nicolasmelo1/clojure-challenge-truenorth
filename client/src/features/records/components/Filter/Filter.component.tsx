import { Fragment, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTrash } from "@fortawesome/free-solid-svg-icons";

import { Selector } from "../../../utils";
import * as Styled from "./Filter.styles";
import { useClickOutside } from "../../../utils/hooks";
import { uuid } from "../../../utils/utils";

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
              const isOperationTypeSelected =
                selectedColumn?.dataType === "operation-type";
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
                  ) : isOperationTypeSelected ? (
                    <Selector
                      label="Operation type"
                      closeOnSelect={true}
                      searchPlaceholder="Search for an operation"
                      selectedOption={selectedOperationTypeOption}
                      options={operationOptions}
                      onSelectOption={(option) => {
                        filter.value = option;
                        setFiltersState([...filtersState]);
                      }}
                    />
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
                {"+"}
              </Styled.FilterButton>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Styled.FilterButton
                  $selected={false}
                  type="button"
                  disabled={filtersState?.length === 0}
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
              </div>
            </Styled.BottomButtonsContainer>
          </Styled.DropdownInnerContainer>
        </Styled.DropdownContainer>
      ) : null}
    </Styled.ButtonContainer>
  );
}
