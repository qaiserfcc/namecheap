import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ example: 'Chiltan Pure' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'chiltan-pure' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Natural and organic products', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  enableCOD?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  enableSubscriptions?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  enableLoyaltyPoints?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  enableInternationalShip?: boolean;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  enableReviews?: boolean;
}

export class UpdateBrandDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  enableCOD?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  enableSubscriptions?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  enableLoyaltyPoints?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  enableInternationalShip?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  enableReviews?: boolean;
}
