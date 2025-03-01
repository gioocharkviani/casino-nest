import { IsBoolean, IsString } from "class-validator";

export class CreateSwiperComponentDto {
  @IsString()
  link: string;

  @IsBoolean()
  published: boolean;

  @IsString()
  img: string;
}
