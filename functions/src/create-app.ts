import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { URL } from 'url';

import * as admin from 'firebase-admin';
import * as lighthouse from 'lighthouse';
import * as puppeteer from 'puppeteer';
import * as moment from 'moment';

export async function launchChromeAndRunLighthouse(url: string): Promise<any> {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const result = await lighthouse(url, {
    port: (new URL(browser.wsEndpoint())).port,
    output: ['html'],
    logLevel: 'info',
  });

  return result;
}

export async function uploadReport(adminApp: admin.app.App, report: string, html: string, userId: string, appId: string): Promise<any[]> {
  const tempReportFilePath = path.join(os.tmpdir(), 'report.json');
  const tempHtmlFilePath = path.join(os.tmpdir(), 'report.html');
  fs.writeFileSync(tempReportFilePath, JSON.stringify(report, null, 2));
  fs.writeFileSync(tempHtmlFilePath, html);

  const bucket = admin.storage(adminApp).bucket();
  const now = moment().utc().format('YYYYMMDD-HHmmss');
  const [uploadedReportFile] = await bucket.upload(tempReportFilePath, {
    destination: `${userId}/${appId}/${now}-report.json`,
    metadata: {
      contentType: 'application/json',
      cacheControl: 'public, max-age=31536000',
    },
  });
  const [uploadedHtmlFile] = await bucket.upload(tempHtmlFilePath, {
    destination: `${userId}/${appId}/${now}-report.html`,
    metadata: {
      contentType: 'text/html; charset=utf-8',
      cacheControl: 'public, max-age=31536000',
    },
  });

  return [uploadedReportFile, uploadedHtmlFile]
}
