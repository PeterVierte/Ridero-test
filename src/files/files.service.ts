import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as decompress from 'decompress';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { createErrorLog, createSuccessLog } from '../../utils/createLogs';

@Injectable()
export class FilesService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  async uploadAndConvert(file: Express.Multer.File) {
    if (!file) {
      this.logger.error(createErrorLog('Получен пустой файл'));
      throw new BadRequestException('Файл не может быть пустым');
    }

    if (file.mimetype !== 'application/zip') {
      this.logger.error(createErrorLog('Получен файл в некорректном формате'));
      throw new BadRequestException('Некорректный формат файла');
    }

    if (file.size > 2 * 1024 * 1024 * 1024) {
      this.logger.error(
        createErrorLog('Получен файл размером больше, чем 2 Гб'),
      );
      throw new BadRequestException(
        'Файл слишком большой. Его размер не должен привышать 2 Гб',
      );
    }

    const startTime = performance.now();
    const startMemory = process.memoryUsage();

    const fileName = file.filename;
    const zipPath = path.join(__dirname, `../../../uploads/zips/${fileName}`);
    const destinationZipPath = path.join(
      __dirname,
      `../../../uploads/archives/archive-${fileName.split('.')[0]}`,
    );
    const htmlPath = `${destinationZipPath}/index.html`;
    const pdfPath = `${destinationZipPath}/${fileName.split('.')[0]}.pdf`;
    await this.extractZip(zipPath, destinationZipPath);
    await this.convertHtmlToPdf(htmlPath, pdfPath);

    const endTime = performance.now();
    const endMemory = process.memoryUsage();

    const timeSpent = endTime - startTime;
    const memoryUsed = endMemory.rss - startMemory.rss;

    this.logger.info(
      createSuccessLog(`${fileName.split('.')[0]}.pdf}`, timeSpent, memoryUsed),
    );

    return pdfPath;
  }

  async extractZip(zipPath: string, destPath: string) {
    await decompress(zipPath, destPath);
  }

  async convertHtmlToPdf(htmlPath: string, pdfPath: string) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0',
    });
    await page.pdf({ format: 'A4', path: pdfPath });
    await browser.close();
  }
}
