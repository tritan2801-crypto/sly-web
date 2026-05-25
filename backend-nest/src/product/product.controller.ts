import { Controller, Get, Post, Body, Req, Query, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('categories')
  async getCategories(@Res() res: Response) {
    try {
      const categories = await this.productService.getCategories();
      return res.status(HttpStatus.OK).json({
        success: true,
        data: categories,
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Get('products')
  async getProducts(
    @Query('category_id') categoryIdStr: string,
    @Query('search') search: string,
    @Query('sort') sort: string,
    @Query('min_price') minPriceStr: string,
    @Query('max_price') maxPriceStr: string,
    @Query('size') size: string,
    @Query('category_group') categoryGroup: string,
    @Query('page') pageStr: string,
    @Query('limit') limitStr: string,
    @Res() res: Response,
  ) {
    try {
      const categoryId = categoryIdStr && categoryIdStr !== '' ? Number(categoryIdStr) : undefined;
      const minPrice = minPriceStr && minPriceStr !== '' ? Number(minPriceStr) : undefined;
      const maxPrice = maxPriceStr && maxPriceStr !== '' ? Number(maxPriceStr) : undefined;
      const page = pageStr && pageStr !== '' ? Number(pageStr) : undefined;
      const limit = limitStr && limitStr !== '' ? Number(limitStr) : 9;

      const result = await this.productService.getProducts(
        categoryId,
        search,
        sort,
        minPrice,
        maxPrice,
        size,
        categoryGroup,
        page,
        limit,
      );

      if (page !== undefined) {
        return res.status(HttpStatus.OK).json({
          success: true,
          data: result.products,
          pagination: {
            total: result.total,
            page,
            limit,
            total_pages: Math.ceil(result.total / limit),
          },
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: true,
          data: result.products,
        });
      }
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Get('products/detail')
  async getProductDetail(
    @Query('slug') slug: string,
    @Query('id') id: string,
    @Res() res: Response,
  ) {
    const slugOrId = slug || id;
    if (!slugOrId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Product identifier (id or slug) is required.',
      });
    }

    try {
      const product = await this.productService.getProductDetail(slugOrId);
      if (!product) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: 'Product not found.',
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        data: product,
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Get('admin/products')
  async getAdminProducts(@Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id || req.session.user_role !== 'admin') {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: 'Forbidden. Admin privileges required.',
      });
    }

    try {
      const products = await this.productService.getAllProductsAdmin();
      return res.status(HttpStatus.OK).json({
        success: true,
        data: products,
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Post('admin/products/create')
  async createProduct(@Body() body: any, @Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id || req.session.user_role !== 'admin') {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: 'Forbidden. Admin privileges required.',
      });
    }

    const name = (body.name || '').trim();
    const price = Number(body.price || 0);
    const variants = body.variants || [];
    const images = body.images || [];

    if (!name || price <= 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Product name and positive price are required.',
      });
    }

    let slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    let slugCheck = slug;
    let counter = 1;
    while (await this.productService.getProductDetail(slugCheck)) {
      slugCheck = `${slug}-${counter}`;
      counter++;
    }
    slug = slugCheck;

    const productData = {
      category_id: body.category_id || null,
      name,
      slug,
      description: (body.description || '').trim(),
      price,
      sale_price: body.sale_price !== undefined && body.sale_price !== '' ? Number(body.sale_price) : null,
      is_new: !!body.is_new,
      is_sale: !!body.is_sale,
      status: body.status || 'active',
    };

    try {
      const productId = await this.productService.createProductDb(productData, variants, images);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Product created successfully.',
        id: productId,
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Post('admin/products/update')
  async updateProduct(@Body() body: any, @Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id || req.session.user_role !== 'admin') {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: 'Forbidden. Admin privileges required.',
      });
    }

    const productId = Number(body.id || 0);
    const name = (body.name || '').trim();
    const price = Number(body.price || 0);
    const variants = body.variants || [];
    const images = body.images || [];

    if (productId <= 0 || !name || price <= 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Valid ID, product name and positive price are required.',
      });
    }

    let slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    let slugCheck = slug;
    let counter = 1;
    while (true) {
      const existing: any = await this.productService.getProductDetail(slugCheck);
      if (existing && existing.id !== productId) {
        slugCheck = `${slug}-${counter}`;
        counter++;
      } else {
        break;
      }
    }
    slug = slugCheck;

    const productData = {
      category_id: body.category_id || null,
      name,
      slug,
      description: (body.description || '').trim(),
      price,
      sale_price: body.sale_price !== undefined && body.sale_price !== '' ? Number(body.sale_price) : null,
      is_new: !!body.is_new,
      is_sale: !!body.is_sale,
      status: body.status || 'active',
    };

    try {
      await this.productService.updateProductDb(productId, productData, variants, images);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Product updated successfully.',
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Post('admin/products/delete')
  async deleteProduct(@Body() body: any, @Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id || req.session.user_role !== 'admin') {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: 'Forbidden. Admin privileges required.',
      });
    }

    const productId = Number(body.id || 0);
    if (productId <= 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Valid product ID is required.',
      });
    }

    try {
      await this.productService.deleteProductDb(productId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Product deleted successfully.',
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Post('admin/categories/create')
  async createCategory(@Body() body: any, @Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id || req.session.user_role !== 'admin') {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: 'Forbidden. Admin privileges required.',
      });
    }

    const name = (body.name || '').trim();
    const description = (body.description || '').trim();
    const parentId = body.parent_id !== undefined && body.parent_id !== '' ? Number(body.parent_id) : null;

    if (!name) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Category name is required.',
      });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    try {
      const catId = await this.productService.createCategoryDb(name, slug, description, parentId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Category created successfully.',
        id: catId,
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Post('admin/categories/update')
  async updateCategory(@Body() body: any, @Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id || req.session.user_role !== 'admin') {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: 'Forbidden. Admin privileges required.',
      });
    }

    const id = Number(body.id || 0);
    const name = (body.name || '').trim();
    const description = (body.description || '').trim();
    const parentId = body.parent_id !== undefined && body.parent_id !== '' ? Number(body.parent_id) : null;

    if (id <= 0 || !name) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Category ID and name are required.',
      });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    try {
      await this.productService.updateCategoryDb(id, name, slug, description, parentId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Category updated successfully.',
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Post('admin/categories/delete')
  async deleteCategory(@Body() body: any, @Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id || req.session.user_role !== 'admin') {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: 'Forbidden. Admin privileges required.',
      });
    }

    const id = Number(body.id || 0);
    if (id <= 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Valid category ID is required.',
      });
    }

    try {
      await this.productService.deleteCategoryDb(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Category deleted successfully.',
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }
}
