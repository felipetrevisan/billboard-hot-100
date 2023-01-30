export type ChartData = {
  rank: string | undefined;
  song: string | undefined;
  artist: string | undefined;
  status: string | undefined;
  lastWeek: string | undefined;
  peakPos: string | undefined;
  wksOnChart: string | undefined;
};

export type Charts = {
  data: ChartData[];
  date: string;
};
