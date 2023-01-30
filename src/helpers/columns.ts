import { ChartData } from '@/interfaces/chart';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ChartData>();

export const columns = [
  columnHelper.accessor('rank', {
    header: 'Rank',
    cell: info => info.getValue(),
  }),

  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => (/^\d/.test(info.getValue()!) ? '' : info.getValue()),
  }),

  columnHelper.accessor('song', {
    header: 'Song',
    cell: info => info.getValue(),
  }),

  columnHelper.accessor('artist', {
    header: 'Artist',
    cell: info => info.getValue(),
  }),

  columnHelper.accessor('lastWeek', {
    header: 'Last Week',
    cell: info => info.getValue(),
  }),

  columnHelper.accessor('peakPos', {
    header: 'Peak Position',
    cell: info => info.getValue(),
  }),

  columnHelper.accessor('wksOnChart', {
    header: 'WKS on Chart',
    cell: info => info.getValue(),
  }),
];
