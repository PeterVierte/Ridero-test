import { IsNotEmpty, IsString } from 'class-validator';

export class FileUploadDto {
  @IsNotEmpty({ message: 'File should not be empty' })
  @IsString({ message: 'File must be a string' })
  mimetype: string;

  @IsNotEmpty({ message: 'File should not be empty' })
  @IsString({ message: 'File must be a string' })
  originalname: string;

  @IsNotEmpty({ message: 'File should not be empty' })
  buffer: Buffer;
}
