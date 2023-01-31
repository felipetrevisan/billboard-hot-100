import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Head from 'next/head';
import { useState } from 'react';
import { ScaleLoader } from 'react-spinners';

import Table from '@/components/Table';
import { columns } from '@/helpers/columns';
import { ChartData, Charts } from '@/interfaces/chart';
import { Download } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { purple } from 'tailwindcss/colors';

export default function Home() {
  const [shouldExport, setShouldExport] = useState<boolean>(false);
  const [date, setDate] = useState<string>();

  const { data, fetchStatus, status, refetch } = useQuery({
    queryKey: ['billboard', date],
    queryFn: () => queryBillboard(date),
    enabled: shouldExport,
  });

  const queryBillboard = (date: string | undefined) => {
    return axios
      .get<Charts>('api/billboard', { params: { date } })
      .then(res => {
        setShouldExport(false);
        return res.data.data;
      });
  };

  const getData = () => {
    refetch();
    setShouldExport(true);
  };

  return (
    <>
      <Head>
        <title>Billboard Export Hot 100</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex flex-col items-center justify-between gap-10">
        <div className="flex gap-5">
          <TextField
            type="date"
            inputProps={{
              className:
                'text-5xl p-6 rounded-lg border border-purple-500 bg-transparent disabled:opacity-60 select-none',
            }}
            onChange={e => setDate(e.target.value)}
            disabled={fetchStatus === 'fetching'}
          />
          <IconButton
            className="text-3xl"
            color="primary"
            onClick={getData}
            disabled={
              fetchStatus === 'fetching' || date === '' || date === undefined
            }
          >
            <Download fontSize="large" />
          </IconButton>
        </div>
        <div className="flex flex-col gap-5">
          <ScaleLoader
            color={purple[500]}
            loading={fetchStatus === 'fetching'}
          />
          {status === 'success' && fetchStatus === 'idle' && (
            <Table<ChartData>
              data={data}
              columns={columns}
              additionalProperties={{ date }}
            />
          )}
        </div>
      </main>
    </>
  );
}

