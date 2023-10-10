import styled from "styled-components";

export const ButtonContainer = styled.div`
  position: relative;
`;

export const DropdownContainer = styled.div`
  position: absolute;
  margin-top: 5px;
  border-radius: 10px;
  width: 50vw;
  max-width: 280px;
  min-width: 250px;
  background-color: white;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.24), 0 0 2px rgba(0, 0, 0, 0.16),
    0 3px 4px rgba(0, 0, 0, 0.06), 0 6px 8px rgba(0, 0, 0, 0.06),
    0 12px 16px rgba(0, 0, 0, 0.08), 0 18px 32px rgba(0, 0, 0, 0.06);
`;

export const DropdownInnerContainer = styled.div`
  padding: 1rem;
`;

export const ColumnButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 2px;
  margin-top: 2px;
  justify-content: space-between;
  flex-direction: row;
`;

export const SelectorContainer = styled.div`
  width: 120px;
`;

export const SortColumnLabel = styled.label`
  font-family: "Arial";
  font-size: 12px;
`;
export const SortColumnRow = styled.label``;

export const SortButton = styled.button<{ $selected: boolean }>`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  display: flex;
  padding: 5px 10px;
  user-select: none;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #c2c2c2c2;
  color: #444444;
  background-color: ${({ $selected }) =>
    $selected ? "#c2c2c2c2" : "transparent"};
  margin: 1px;
`;

export const SortIconContainer = styled.div`
  margin-left: 5px;
`;

export const BottomButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  justify-content: space-between;
  width: 100%;
`;
