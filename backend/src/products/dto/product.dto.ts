import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({ example: 'Organic Argan Oil' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'organic-argan-oil' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 2500 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  officialPrice: number;

  @ApiProperty({ example: 1999 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  discountedPrice: number;

  @ApiProperty({ example: 100, default: 0 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  officialPrice?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  discountedPrice?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
