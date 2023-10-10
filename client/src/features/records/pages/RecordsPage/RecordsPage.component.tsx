import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Filter, Sort } from "../../components";
import * as Styled from "./RecordsPage.styles";
import { useRecords } from "../../hookts";
import {
  operationsReferenceTable,
  convertNumberToMoney,
  convertIsoDateToDate,
} from "../../utils";

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
  } = useRecords();

  const table = useReactTable({
    data: records,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });
  console.log("aqui");
  return (
    <Styled.Container>
      <h1>Recorddds</h1>
      <Styled.TopButtonsContainer>
        <Styled.SortAndFilterButtons>
          <Filter
            columns={table.getFlatHeaders().map((column) => ({
              label: column.column.columnDef.header as string,
              value: column.id || "",
              dataType: (["amount", "userBalance"].includes(column.id || "")
                ? "number"
                : "string") as "string" | "number" | "date",
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
      <Styled.TableContainer>
        <table>
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
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </Styled.TableContainer>
    </Styled.Container>
  );
}
