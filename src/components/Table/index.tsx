import { GoogleSheetStorage } from '@/config/storage/google-sheet';
import { ChartData, Charts } from '@/interfaces/chart';
import { CloudDownload, ContentCopy } from '@mui/icons-material';
import {
  IconButton,
  Paper,
  Table as MTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar
} from '@mui/material';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

type Props<T> = {
  columns: ColumnDef<T, any>[];
  data: T[];
  additionalProperties?: any;
};

export default function Table<T>({
  columns,
  data,
  additionalProperties,
}: Props<T>) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = getRowModel();

  const selectAllContent = () => {
    const range = document.createRange();
    range.selectNodeContents(tableRef.current!);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const exportData = async () => {
    setExporting(true);
    const storage = new GoogleSheetStorage();

    const response: Charts = {
      data: data as ChartData[],
      date: additionalProperties?.date,
    };

    const result = await storage.save(response);

    if (result) {
      toast('Tabela exportada com sucesso para seu Google Sheet');
    } else {
      toast('Ocorreu um erro ao exportar para seu Google Sheet');
    }

    setExporting(false);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        overflow: 'auto',
        maxHeight: '600px',
        height: '600px',
        borderRadius: '10px',
        miWwidth: '45vw'
      }}
      ref={tableRef}
    >
      <Toolbar className="flex justify-end items-center">
        <IconButton
          size="large"
          aria-label="copy to clipboard"
          color="inherit"
          onClick={selectAllContent}
          disabled={!data.length}
        >
          <ContentCopy />
        </IconButton>
        <IconButton
          size="large"
          aria-label="export data"
          edge="end"
          color="inherit"
          onClick={exportData}
          disabled={exporting || !data.length}
        >
          <CloudDownload />
        </IconButton>
      </Toolbar>
      <MTable>
        <TableHead>
          {getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableCell key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div className="select-none">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map(row => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MTable>
    </TableContainer>
  );
}
