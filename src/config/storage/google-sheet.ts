import { Charts } from '@/interfaces/chart';
import { Storage } from '@/interfaces/storage';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export class GoogleSheetStorage implements Storage {
  private doc: GoogleSpreadsheet;

  constructor() {
    this.doc = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID);

    this.authorize();
  }

  async authorize(): Promise<void> {
    await this.doc.useServiceAccountAuth({
      client_email: process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY!.replace(
        /\\n/g,
        '\n'
      ),
    });
  }

  async save(data: Charts) {
    try {
      await this.doc.loadInfo();
      const sheet = await this.doc.addSheet({
        title: data.date || 'Sem Titulo',
        headerValues: [
          'rank',
          'status',
          'song',
          'artist',
          'lastWeek',
          'peakPos',
          'wksOnChart',
        ],
        gridProperties: {
          columnCount: 7,
          rowCount: data.data.length + 1,
          frozenRowCount: 1,
          columnGroupControlAfter: true,
          rowGroupControlAfter: true,
        },
      });

      const newData = data.data.map(row => {
        return {
          rank: row.rank!,
          status: /^\d/.test(row.status!) ? '' : row.status!.replace(/\s/,''),
          song: row.song!,
          artist: row.artist!,
          lastWeek: row.lastWeek!,
          peakPos: row.peakPos!,
          wksOnChart: row.wksOnChart!,
        };
      });

      sheet.addRows(newData);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
