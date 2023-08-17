import { BadRequestException, Injectable } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class FilesService {
  async uploadAndConvert(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не может быть пустым');
    }

    if (file.mimetype !== 'application/zip') {
      throw new BadRequestException('Некорректный формат файла');
    }

    if (file.buffer.length > 2 * 1024 * 1024 * 1024) {
      throw new BadRequestException(
        'Файл слишком большой. Его размер не должен привышать 2 Гб',
      );
    }

    const namePrefix = Date.now();
    const zipPath = path.join(
      __dirname,
      `../../uploads/archives/archive-${namePrefix}`,
    );
    const htmlPath = `${zipPath}/index.html`;
    const pdfPath = path.join(
      __dirname,
      `../../uploads/pdfs/pdf-${namePrefix}.pdf`,
    );
    await this.extractZip(file.buffer, zipPath);
    await this.convertHtmlToPdf(htmlPath, pdfPath);
    return pdfPath;
  }

  async extractZip(zipData: Buffer, path: string) {
    const zip = new AdmZip(zipData);
    await zip.extractAllTo(path);
  }

  async convertHtmlToPdf(htmlPath: string, pdfPath: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0',
    });
    const pdf = await page.pdf({ format: 'A4', path: pdfPath });
    await browser.close();
    return pdf;
  }
}
