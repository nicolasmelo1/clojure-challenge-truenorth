import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Filter, Sort } from "../../components";
import * as Styled from "./RecordsPage.styles";
import { useRecords } from "../../hooks";
import {
  operationsReferenceTable,
  convertNumberToMoney,
  convertIsoDateToDate,
} from "../../utils";
import { useMemo } from "react";

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
];

export default function RecordsPage() {
  const {
    data: records,
    sortsState,
    setSortsState,
    filtersState,
    setFiltersState,
    setPage,
    page: currentPage,
    total,
  } = useRecords();

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
    console.log(startingPage + maxNumberOfShownPages < total);
    for (
      let i = Math.ceil(startingPage);
      i < total && i < startingPage + maxNumberOfShownPages;
      i++
    )
      pages.push(i);
    return pages;
  }, [currentPage, total]);

  const table = useReactTable({
    data: records,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Styled.Container>
      <Styled.TitleContainer>
        <Styled.PageTitle $selected={true}>User Records</Styled.PageTitle>
        <Styled.PageTitleDivisor>{"/"}</Styled.PageTitleDivisor>
        <Styled.PageLink to="/app/operations/calculator" $selected={false}>
          Calculator
        </Styled.PageLink>
      </Styled.TitleContainer>
      <Styled.TopButtonsContainer>
        <Styled.SortAndFilterButtons>
          <Filter
            columns={table.getFlatHeaders().map((column) => ({
              label: column.column.columnDef.header as string,
              value: column.id || "",
              dataType: (["amount", "userBalance"].includes(column.id || "")
                ? "number"
                : column.id === "operation_type"
                ? "operation-type"
                : "string") as "string" | "number" | "date" | "operation-type",
            }))}
            filters={filtersState}
            onApply={(filters) => setFiltersState(filters)}
          />
          <Styled.SortButton>
            <Sort
              sorts={sortsState}
              columns={table.getFlatHeaders().map((column) => ({
                label: column.column.columnDef.header as string,
                value: column.id || "",
              }))}
              onApply={(sorts) => {
                console.log("sorts", sorts);
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
