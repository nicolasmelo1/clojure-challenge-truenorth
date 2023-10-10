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
  text-align: center;
`;
