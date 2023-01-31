// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Charts } from '@/interfaces/chart';
import chrome from 'chrome-aws-lambda';
import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Charts>
) {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ data: [], date: '' });
  }

  const options =
    process.env.NODE_ENV === 'production'
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : {};

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(0);

  await page.goto(`${process.env.BILLBOARD_API_URL}/${date}`);
  await page.waitForSelector('.chart-results-list');

  const resultsSelector = '.o-chart-results-list-row-container';

  const results = await page.evaluate((resultsSelector: string) => {
    return [...document.querySelectorAll(resultsSelector)].map(item => {
      const rank = item
        .querySelector('ul > li:nth-child(1) > span')
        ?.textContent?.trim();
      const song = item
        .querySelector(
          'ul > li:nth-child(4) > ul > li:nth-child(1) > #title-of-a-story'
        )
        ?.textContent?.trim();
      const artist = item
        .querySelector('ul > li:nth-child(4) > ul > li:nth-child(1) > span')
        ?.textContent?.trim();
      const status =
        item
          .querySelector('ul > li:nth-child(3) > span')
          ?.textContent?.trim() ?? '';
      const lastWeek = item
        .querySelector('ul > li:nth-child(4) > ul > li:nth-child(4) > span')
        ?.textContent?.trim();
      const peakPos = item
        .querySelector('ul > li:nth-child(4) > ul > li:nth-child(5) > span')
        ?.textContent?.trim();
      const wksOnChart = item
        .querySelector('ul > li:nth-child(4) > ul > li:nth-child(6) > span')
        ?.textContent?.trim();

      return {
        rank,
        song,
        artist,
        status,
        lastWeek,
        peakPos,
        wksOnChart,
      };
    });
  }, resultsSelector);

  await browser.close();

  return res.status(200).json({ data: results, date: date as string });
}

