import styled from "styled-components";

export const ButtonContainer = styled.div`
  position: relative;
`;

export const DropdownContainer = styled.div`
  position: absolute;
  margin-top: 5px;
  border-radius: 10px;
  width: 60vw;
  max-width: 550px;
  min-width: 400px;
  background-color: white;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.24), 0 0 2px rgba(0, 0, 0, 0.16),
    0 3px 4px rgba(0, 0, 0, 0.06), 0 6px 8px rgba(0, 0, 0, 0.06),
    0 12px 16px rgba(0, 0, 0, 0.08), 0 18px 32px rgba(0, 0, 0, 0.06);
`;

export const DropdownInnerContainer = styled.div`
  padding: 1rem;
`;

export const DropdownInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 6px;
  margin-top: 6px;
  justify-content: space-between;
`;

export const SelectorContainer = styled.div`
  width: 120px;
`;

export const BottomButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const FilterInputContainer = styled.input<{ $isSplitted: boolean }>`
  border: 1px solid #c2c2c2c2;
  border-radius: 5px;
  padding: 3px 10px;
  width: ${(props) => (props.$isSplitted ? `20%` : "20%")};
`;

export const FilterButton = styled.button<{ $selected: boolean }>`
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

export const FilterIconContainer = styled.div`
  margin-left: 5px;
`;

export const ResetAndApplyButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
