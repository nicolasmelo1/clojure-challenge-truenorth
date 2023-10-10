import styled from "styled-components";

export const Container = styled.div`
  position: relative;
`;

export const DropdownContainer = styled.div`
  position: absolute;
  z-index: 2;
  margin-top: 5px;
  border-radius: 10px;
  border-color: #f2f2f2;
  background-color: white;
`;

export const OptionsList = styled.div`
  flex-direction: column;
  width: 100%;
`;

export const Option = styled.button`
  flex-direction: column;
  width: 100%;
`;
