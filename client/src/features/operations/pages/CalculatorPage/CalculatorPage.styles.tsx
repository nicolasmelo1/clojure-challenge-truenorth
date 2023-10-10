import styled from "styled-components";
import { Link } from "@tanstack/react-router";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

export const CalculatorContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
`;

export const ButtonsRow = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`;

export const PageTitle = styled.h1<{ $selected: boolean }>`
  font-family: "Arial";
  font-size: 18px;
  text-align: center;
  text-decoration: none;

  color: ${({ $selected }) => ($selected ? "black" : "#c2c2c2c2")};
  border: none;
  background-color: transparent;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PageLink = styled(Link as any)<{ $selected: boolean }>`
  font-family: "Arial";
  font-size: 18px;
  text-align: center;
  text-decoration: none;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  display: flex;
  color: ${({ $selected }) => ($selected ? "black" : "#c2c2c2c2")};
  border: none;
  background-color: transparent;
`;

export const PageTitleDivisor = styled.h1`
  font-family: "Arial";
  font-size: 18px;
  text-align: center;
  padding: 0 10px;
`;

export const PageButton = styled.button<{ $selected: boolean }>`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #c2c2c2c2;
  color: #444444;
  background-color: ${({ $selected }) =>
    $selected ? "#c2c2c2c2" : "transparent"};
  width: 30px;
  height: 30px;
  margin: 1px;
`;
