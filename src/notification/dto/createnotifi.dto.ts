import { IsNotEmpty, IsOptional, IsEnum, IsString, IsDate, IsISO8601, } from 'class-validator';
import { notifiCategory } from '@prisma/client';

export class CreateNotificationDto {
  
  @IsNotEmpty()
  @IsString()
  recipientId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(notifiCategory)
  category?: notifiCategory;

  @IsOptional()
  @IsISO8601() 
  readAt?: Date;

  @IsOptional()
  @IsISO8601() 
  trigerAt?: Date;
}
