import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

import { useClickOutside } from "../../../core/hooks";
import * as Styled from "./Sort.styles";
import { Selector } from "../../../core";

type Props = {
  columns: {
    value: string;
    label: string;
  }[];
  sorts: {
    field: string;
    order: "asc" | "desc";
  }[];
  onApply: (filter: Props["sorts"]) => void;
};
export default function Sort(props: Props) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortsState, setSortsState] = useState<Props["sorts"]>(props.sorts);
  const sortOptions = useMemo(() => {
    return [
      {
        label: () => <FontAwesomeIcon icon={faSortUp} />,
        value: "asc",
      },
      {
        label: () => <FontAwesomeIcon icon={faSortDown} />,
        value: "desc",
      },
    ];
  }, []);

  const clickOutsideRef = useClickOutside(() => {
    setIsSortOpen(false);
  });

  return (
    <Styled.ButtonContainer ref={clickOutsideRef}>
      <Styled.SortButton
        $selected={isSortOpen}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsSortOpen(!isSortOpen);
        }}
      >
        {props.sorts.length > 0
          ? `${props.sorts.length} ${
              props.sorts.length > 1 ? "sorts" : "sort"
            } selected`
          : "Sort"}
        <Styled.SortIconContainer>
          <FontAwesomeIcon icon={faSort} />
        </Styled.SortIconContainer>
      </Styled.SortButton>
      {isSortOpen ? (
        <Styled.DropdownContainer>
          <Styled.DropdownInnerContainer>
            {props.columns.map((column) => {
              const selectedColumn = sortsState.find(
                (sort) => sort.field === column.value
              );
              const selectedSortOption = sortOptions.find(
                (sortOption) => sortOption.value === selectedColumn?.order
              );

              return (
                <Styled.ColumnButtonContainer key={column.value}>
                  <Styled.SortColumnLabel>
                    {column.label}
                  </Styled.SortColumnLabel>
                  <Selector
                    label={<FontAwesomeIcon icon={faSort} />}
                    showSearch={false}
                    clickOnSameOptionToUnselect={true}
                    closeOnSelect={true}
                    selectedOption={selectedSortOption}
                    onSelectOption={(option) => {
                      if (typeof option === "string") {
                        const sortStateToModify = sortsState.find(
                          (sortState) => sortState.field === column.value
                        );
                        if (sortStateToModify)
                          sortStateToModify.order = option as "asc" | "desc";
                        else
                          sortsState.push({
                            field: column.value,
                            order: option as "asc" | "desc",
                          });

                        setSortsState([...sortsState]);
                      } else
                        setSortsState(
                          sortsState.filter(
                            (sort) => sort.field !== column.value
                          )
                        );
                    }}
                    options={sortOptions}
                  />
                </Styled.ColumnButtonContainer>
              );
            })}
            <Styled.BottomButtonsContainer>
              <Styled.SortButton
                $selected={false}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSortsState([]);
                  props.onApply([]);
                  setIsSortOpen(false);
                }}
              >
                {"Reset"}
              </Styled.SortButton>
              <Styled.SortButton
                $selected={true}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  props.onApply(sortsState);
                  setIsSortOpen(false);
                }}
              >
                {"Apply"}
              </Styled.SortButton>
            </Styled.BottomButtonsContainer>
          </Styled.DropdownInnerContainer>
        </Styled.DropdownContainer>
      ) : null}
    </Styled.ButtonContainer>
  );
}
