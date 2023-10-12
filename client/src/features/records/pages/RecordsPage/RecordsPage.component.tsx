import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { Filter, Sort } from "../../components";
import * as Styled from "./RecordsPage.styles";
import { useRecords, useRemove } from "../../hooks";
import {
  operationsReferenceTable,
  convertNumberToMoney,
  convertIsoDateToDate,
} from "../../utils";
import { Headers } from "../../../core";

const columns: ColumnDef<{
  operation_type: string;
  operation_response: string;
  amount: number;
  date: string;
  user_balance: number;
  id: number;
}>[] = [
  {
    accessorKey: "operation_type",
    header: "Operation",
    cell: (info) => (
      <Styled.Cell>
        {
          operationsReferenceTable[
            info.getValue() as keyof typeof operationsReferenceTable
          ]
        }
      </Styled.Cell>
    ),
  },
  {
    accessorKey: "operation_response",
    header: "Result",
    cell: (info) => <Styled.Cell>{info.getValue() as string}</Styled.Cell>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: (info) => (
      <Styled.Cell>
        {convertNumberToMoney(info.getValue() as number)}
      </Styled.Cell>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: (info) => (
      <Styled.Cell>
        {convertIsoDateToDate(info.getValue() as string)}
      </Styled.Cell>
    ),
  },
  {
    accessorKey: "user_balance",
    header: "User Balance",
    cell: (info) => (
      <Styled.Cell>
        {convertNumberToMoney(info.getValue() as number)}
      </Styled.Cell>
    ),
  },
  {
    accessorKey: "table_operations",
    header: "",
    cell: () => "",
  },
];

export default function RecordsPage() {
  const {
    data: records,
    fetchData,
    sortsState,
    setSortsState,
    filtersState,
    setFiltersState,
    setPage,
    page: currentPage,
    total,
  } = useRecords();
  const removeRow = useRemove();

  const pages = useMemo(() => {
    const pages = [];
    const maxNumberOfShownPages = 10;
    const startingPage =
      currentPage - maxNumberOfShownPages / 2 > 0
        ? currentPage - maxNumberOfShownPages / 2 + maxNumberOfShownPages <
          total
          ? currentPage - maxNumberOfShownPages / 2
          : total - maxNumberOfShownPages
        : 1;
    for (
      let i = Math.ceil(startingPage);
      i < total && i < startingPage + maxNumberOfShownPages;
      i++
    )
      pages.push(i);
    return pages;
  }, [currentPage, total]);

  function onRemoveRow(rowIndex: number) {
    const recordToDelete = records[rowIndex];
    removeRow(recordToDelete.id).then(() => fetchData());
  }

  const table = useReactTable({
    data: records,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Styled.Container>
      <Headers
        headers={[
          {
            title: "History",
          },
          {
            title: "Calculator",
            link: "/app/operations/calculator",
          },
          {
            title: "Random String",
            link: "/app/operations/random-string",
          },
        ]}
      />
      <Styled.TopButtonsContainer>
        <Styled.SortAndFilterButtons>
          <Filter
            columns={table
              .getFlatHeaders()
              .filter((column) => column.id !== "table_operations")
              .map((column) => ({
                label: column.column.columnDef.header as string,
                value: column.id || "",
                dataType: (["amount", "userBalance"].includes(column.id || "")
                  ? "number"
                  : column.id === "operation_type"
                  ? "operation-type"
                  : column.id === "date"
                  ? "date"
                  : "string") as
                  | "string"
                  | "number"
                  | "date"
                  | "operation-type",
              }))}
            filters={filtersState}
            onApply={(filters) => setFiltersState(filters)}
          />
          <Styled.SortButton>
            <Sort
              sorts={sortsState}
              columns={table
                .getFlatHeaders()
                .filter((column) => column.id !== "table_operations")
                .map((column) => ({
                  label: column.column.columnDef.header as string,
                  value: column.id || "",
                }))}
              onApply={(sorts) => {
                setSortsState(sorts);
              }}
            />
          </Styled.SortButton>
        </Styled.SortAndFilterButtons>
      </Styled.TopButtonsContainer>
      <Styled.PagesContainer>
        {pages.map((page) => (
          <Styled.PageButton
            $selected={page === currentPage}
            key={page}
            onClick={(e) => {
              e.preventDefault();
              if (page !== currentPage) setPage(page);
            }}
          >
            {page}
          </Styled.PageButton>
        ))}
      </Styled.PagesContainer>
      <Styled.TableContainer>
        <Styled.Table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {(
                      cell.column.columnDef as unknown as {
                        accessorKey: string;
                      }
                    ).accessorKey === "table_operations" ? (
                      <Styled.RemoveButton>
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => onRemoveRow(cell.row.index)}
                        />
                      </Styled.RemoveButton>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Styled.Table>
      </Styled.TableContainer>
    </Styled.Container>
  );
}
