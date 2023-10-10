import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

export const TableContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
`;

export const TopButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

export const SortAndFilterButtons = styled.div`
  display: flex;
  flex-direction: row;
`;

export const SortButton = styled.div`
  margin-left: 10px;
`;

export const Cell = styled.div`
  width: 100%;
  justify-content: center;
  align-items: center;
  font-family: "Arial";
  font-size: 12px;
  text-align: center;
`;

export const PagesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

export const PageButton = styled.button<{ $selected: boolean }>`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #c2c2c2c2;
  user-select: none;
  cursor: pointer;
  color: #444444;
  background-color: ${({ $selected }) =>
    $selected ? "#c2c2c2c2" : "transparent"};
  width: 30px;
  height: 30px;
  margin: 1px;
`;

export const Table = styled.table`
  margin-top: 10px;
`;

export const RemoveButton = styled.button`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #c2c2c2c2;
  user-select: none;
  cursor: pointer;
  color: red;
  background-color: transparent;
  width: 30px;
  height: 30px;
  margin: 1px;
`;

export const RemoveButtonIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
`;
