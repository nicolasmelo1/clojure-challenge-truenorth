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
  justify-content: space-between;
  flex-direction: row;
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

export const FilterInputContainer = styled.input<{ isSplitted: boolean }>`
  width: ${(props) => (props.isSplitted ? `20%` : "40%")};
`;
