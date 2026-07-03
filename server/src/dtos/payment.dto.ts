import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  courseId!: string;
}
