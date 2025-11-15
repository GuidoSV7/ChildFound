---
trigger: glob
globs: backend/src/**/*.ts
---

# NestJS Module Structure Rules

## Directory Structure Convention

When creating a new NestJS module, ALWAYS follow this structure:

src/[module-name]/
├── dto/
│   ├── create-[name].dto.ts
│   ├── update-[name].dto.ts
│   └── [other].dto.ts
├── entities/
│   └── [name].entity.ts
├── [name].controller.ts
├── [name].service.ts
└── [name].module.ts


## Naming Conventions

### Folders
- Use **kebab-case** (lowercase with hyphens)
- Examples: `products`, `google-auth`, `user-profiles`

### Files
- DTOs: `create-product.dto.ts`, `update-product.dto.ts`
- Entities: `product.entity.ts` (singular)
- Controllers: `products.controller.ts` (plural if applicable)
- Services: `products.service.ts`
- Modules: `products.module.ts`

## Extended Structure (for complex modules)
 

Ejemplo de controller 
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductPricesService } from './product-prices.service';
import { CreateProductPriceDto } from './dto/create-product-price.dto';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';
import { ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductPrices } from './entities/product-prices.entity';

@Controller('product-prices')
export class ProductPricesController {
  constructor(private readonly productPricesService: ProductPricesService) {}

  @Post()
  @ApiResponse({status:201, description:'Precio de Producto Creado exitosamente', type: ProductPrices})
  @ApiResponse({status:400, description:'Bad Request'})
  create(@Body() createProductPriceDto: CreateProductPriceDto) {
    return this.productPricesService.create(createProductPriceDto);
  }

  @Get()
  findAll( @Query() paginationDto:PaginationDto)  {
    return this.productPricesService.findAll(paginationDto);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.productPricesService.findByProduct(productId);
  }

  @Get('product/:productId/offers')
  @ApiResponse({status:200, description:'Ofertas activas del producto', type: [ProductPrices]})
  findActiveOffersByProduct(@Param('productId') productId: string) {
    return this.productPricesService.findActiveOffersByProduct(productId);
  }

  @Get('offers')
  @ApiResponse({status:200, description:'Todos los productos con ofertas activas'})
  findAllProductsWithOffers() {
    return this.productPricesService.findAllProductsWithOffers();
  }


  @Get('product/:productId/regular-price')
  @ApiResponse({status:200, description:'Precio regular del producto', type: ProductPrices})
  findRegularPriceByProduct(@Param('productId') productId: string) {
    return this.productPricesService.findRegularPriceByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productPricesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string ,
        @Body() updateProductPriceDto: UpdateProductPriceDto) 
        {
    return this.productPricesService.update(id, updateProductPriceDto);
  }

  @Patch(':id/toggle-state')
  @ApiResponse({status:200, description:'Estado del precio alternado exitosamente', type: ProductPrices})
  togglePriceState(@Param('id') id: string) {
    return this.productPricesService.togglePriceState(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productPricesService.remove(id);
  }

  // Endpoints para manejo de stock
  @Patch(':id/stock')
  @ApiOperation({ summary: 'Actualizar stock de un precio específico' })
  @ApiParam({ name: 'id', description: 'ID del precio' })
  @ApiResponse({ status: 200, description: 'Stock actualizado exitosamente', type: ProductPrices })
  @ApiResponse({ status: 404, description: 'Precio no encontrado' })
  updateStock(
    @Param('id') id: string,
    @Body() body: { stock: number }
  ) {
    return this.productPricesService.updateStock(id, body.stock);
  }

  @Patch(':id/stock/decrement')
  @ApiOperation({ summary: 'Decrementar stock de un precio (para ventas)' })
  @ApiParam({ name: 'id', description: 'ID del precio' })
  @ApiResponse({ status: 200, description: 'Stock decrementado exitosamente', type: ProductPrices })
  @ApiResponse({ status: 400, description: 'Stock insuficiente' })
  @ApiResponse({ status: 404, description: 'Precio no encontrado' })
  decrementStock(
    @Param('id') id: string,
    @Body() body: { quantity?: number }
  ) {
    return this.productPricesService.decrementStock(id, body.quantity || 1);
  }

  @Patch(':id/stock/increment')
  @ApiOperation({ summary: 'Incrementar stock de un precio (para reposición)' })
  @ApiParam({ name: 'id', description: 'ID del precio' })
  @ApiResponse({ status: 200, description: 'Stock incrementado exitosamente', type: ProductPrices })
  @ApiResponse({ status: 404, description: 'Precio no encontrado' })
  incrementStock(
    @Param('id') id: string,
    @Body() body: { quantity?: number }
  ) {
    return this.productPricesService.incrementStock(id, body.quantity || 1);
  }

  @Get(':id/stock')
  @ApiOperation({ summary: 'Consultar stock actual de un precio' })
  @ApiParam({ name: 'id', description: 'ID del precio' })
  @ApiResponse({ 
    status: 200, 
    description: 'Stock consultado exitosamente',
    schema: {
      type: 'object',
      properties: {
        priceId: { type: 'string' },
        stock: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Precio no encontrado' })
  async checkStock(@Param('id') id: string) {
    const stock = await this.productPricesService.checkStock(id);
    return { priceId: id, stock };
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Obtener productos con stock bajo' })
  @ApiResponse({ 
    status: 200, 
    description: 'Productos con stock bajo obtenidos exitosamente',
    type: [ProductPrices]
  })
  getLowStockProducts(@Query('threshold') threshold?: string) {
    const thresholdNumber = threshold ? parseInt(threshold) : 10;
    return this.productPricesService.getProductsWithLowStock(thresholdNumber);
  }
}

ejemplo de service

import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './entities/category.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class CategoriesService {
    private readonly logger = new Logger('CategoriesService');

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly dataSource: DataSource,
    ) {}

    async create(createCategoryDto: CreateCategoryDto) {
        try {
            // Si no se proporciona state, por defecto es true
            const categoryData = {
                ...createCategoryDto,
                state: createCategoryDto.state !== undefined ? createCategoryDto.state : true
            };
            
            const category = this.categoryRepository.create(categoryData);
            const savedCategory = await this.categoryRepository.save(category);
            
            return this.findOne(savedCategory.id);
        } catch (error) {
           
            throw new InternalServerErrorException('Error creating category');
        }
    }

    findAll(paginationDto: PaginationDto) {
        const { limit = 10, offset = 0 } = paginationDto;
        return this.categoryRepository.find({
            where: { state: true }, // Solo categorías activas
            take: limit,
            skip: offset,
            order: { name: 'ASC' }
        });
    }

    findAllWithAllStates(paginationDto: PaginationDto) {
        const { limit = 10, offset = 0 } = paginationDto;
        return this.categoryRepository.find({
            take: limit,
            skip: offset,
            order: { name: 'ASC' }
        });
    }

    async findOne(id: string) {
        const category = await this.categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.products', 'products')
            .where('category.id = :id', { id })
            .getOne();

        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }

        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        // First check if the category exists
        const exists = await this.categoryRepository.findOne({ where: { id } });
        if (!exists) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }

        // Create the update object
        const category = await this.categoryRepository.create({
            ...exists,
            ...updateCategoryDto,
        });

        // Create Query Runner
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(category);
            await queryRunner.commitTransaction();
            return this.findOne(id);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Error updating category data');
        } finally {
            await queryRunner.release();
        }
    }

    async remove(id: string) {
        try {
            const category = await this.categoryRepository.findOne({ 
                where: { id } 
            });
            
            if (!category) {
                throw new NotFoundException(`Category with id ${id} not found`);
            }

            // Soft delete: cambiar state a false
            category.state = false;
            await this.categoryRepository.save(category);
            
            return {
                message: `Category with id ${id} was successfully deleted (soft delete).`,
                category
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error while removing category');
        }
    }

    async restore(id: string) {
        try {
            const category = await this.categoryRepository.findOne({ 
                where: { id } 
            });
            
            if (!category) {
                throw new NotFoundException(`Category with id ${id} not found`);
            }

            if (category.state) {
                throw new InternalServerErrorException('Category is not deleted');
            }

            // Restaurar: cambiar state a true
            category.state = true;
            await this.categoryRepository.save(category);
            
            return {
                message: `Category with id ${id} was successfully restored.`,
                category
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException('Error while restoring category');
        }
    }

    async deleteAllCategories() {
        try {
            return await this.categoryRepository
                .createQueryBuilder('category')
                .delete()
                .execute();
        } catch (error) {
           
            throw new InternalServerErrorException(error.message);
        }
    }
}