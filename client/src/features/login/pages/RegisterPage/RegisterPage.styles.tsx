import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

export const InputsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Label = styled.label`
  font-family: "Arial";
  align-self: flex-start;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 5px;
`;

export const Input = styled.input`
  border: 1px solid #c2c2c2c2;
  margin-bottom: 10px;
  width: 300px;
  border-radius: 5px;
  padding: 10px;
`;

export const RegisterButton = styled.button`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid ${({ disabled }) => (disabled ? "#c2c2c2c2" : "#444444")};
  user-select: none;
  cursor: pointer;
  color: #f2f2f2f2;
  background-color: ${({ disabled }) => (disabled ? "#c2c2c2c2" : "#444444")};
  width: 300px;
  margin: 1px;
`;
