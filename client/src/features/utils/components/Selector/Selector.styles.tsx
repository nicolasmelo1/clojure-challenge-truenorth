import styled from "styled-components";

export const Container = styled.div`
  position: relative;
`;

export const DropdownContainer = styled.div`
  position: absolute;
  z-index: 2;
  padding: 5px;
  border-radius: 10px;
  border-color: #f2f2f2;
  background-color: white;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.24), 0 0 2px rgba(0, 0, 0, 0.16),
    0 3px 4px rgba(0, 0, 0, 0.06), 0 6px 8px rgba(0, 0, 0, 0.06),
    0 12px 16px rgba(0, 0, 0, 0.08), 0 18px 32px rgba(0, 0, 0, 0.06);
`;

export const OptionsList = styled.div`
  flex-direction: column;
  width: 100%;
`;

export const Option = styled.button`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  user-select: none;
  padding: 5px;
  border: 1px solid #c2c2c2c2;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
`;
