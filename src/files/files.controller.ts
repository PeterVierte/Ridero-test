import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Response,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { fileStorage } from './storage';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Response() res) {
    const pdfPath = await this.filesService.uploadAndConvert(file);
    res.set({
      'Content-Disposition': 'attachment; filename="generated.pdf"',
    });
    res.download(pdfPath);
  }
}
