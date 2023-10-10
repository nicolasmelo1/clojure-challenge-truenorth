import { useMemo, useState } from "react";
import { useClickOutside } from "../../../utils/hooks";
import * as Styled from "./Sort.styles";
import { Selector } from "../../../utils";

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
        label: "Asc",
        value: "asc",
      },
      {
        label: "Desc",
        value: "desc",
      },
    ];
  }, []);

  const clickOutsideRef = useClickOutside(() => {
    setIsSortOpen(false);
  });

  return (
    <Styled.ButtonContainer ref={clickOutsideRef}>
      <button
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
      </button>
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
                  <label>{column.label}</label>
                  <Selector
                    label="Asc/Desc"
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
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                console.log("apply");
                props.onApply(sortsState);
                setIsSortOpen(false);
              }}
            >
              {"Apply"}
            </button>
          </Styled.DropdownInnerContainer>
        </Styled.DropdownContainer>
      ) : null}
    </Styled.ButtonContainer>
  );
}
