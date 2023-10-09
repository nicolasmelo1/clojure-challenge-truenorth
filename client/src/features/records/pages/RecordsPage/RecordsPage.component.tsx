import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import * as Styled from "./RecordsPage.styles";
import { useState } from "react";

const columns: ColumnDef<{
  operation: string;
  firstName: string;
  amount: number;
  date: string;
  userBalance: number;
}>[] = [
  {
    accessorKey: "operation",
    header: "Operation",
    cell: (info) => info.renderValue(),
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: (info) => info.renderValue(),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: (info) => info.renderValue(),
  },
  { accessorKey: "date", header: "Date", cell: (info) => info.renderValue() },
  {
    accessorKey: "userBalance",
    header: "User Balance",
    cell: (info) => info.renderValue(),
  },
];

const defaultData = [
  {
    amount: 0,
    date: "heeey",
    firstName: "John",
    operation: "Soma",
    userBalance: 123,
  },
  {
    amount: 0,
    date: "heeey",
    firstName: "John",
    operation: "Soma",
    userBalance: 123,
  },
];
export default function RecordsPage() {
  const [data, setData] = useState(() => [...defaultData]);

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  table.getRowModel().rows.map((row) =>
    row.getVisibleCells().map((cell) => {
      console.log(flexRender(cell.column.columnDef.cell, cell.getContext()));
    })
  );
  return (
    <Styled.Container>
      <h1>Recorddds</h1>
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
