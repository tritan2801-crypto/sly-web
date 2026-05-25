import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.categories.findMany({
      orderBy: [
        { parent_id: 'asc' },
        { id: 'asc' },
      ],
    });
  }

  async getProductDetail(slugOrId: string | number) {
    const isId = !isNaN(Number(slugOrId));
    const where = isId ? { id: Number(slugOrId) } : { slug: String(slugOrId) };

    const product = await this.prisma.products.findUnique({
      where,
      include: {
        categories: true,
        product_images: {
          orderBy: { sort_order: 'asc' },
        },
        product_variants: true,
      },
    });

    if (!product) return null;

    // Sort variants by size custom ordering: S, M, L, XL, OS
    const sizeOrder = ['S', 'M', 'L', 'XL', 'OS'];
    const variants = [...product.product_variants].sort((a, b) => {
      const idxA = sizeOrder.indexOf(a.size);
      const idxB = sizeOrder.indexOf(b.size);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });

    return {
      id: product.id,
      category_id: product.category_id,
      category_name: product.categories?.name || null,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      sale_price: product.sale_price ? Number(product.sale_price) : null,
      is_new: product.is_new,
      is_sale: product.is_sale,
      status: product.status,
      created_at: product.created_at,
      updated_at: product.updated_at,
      images: product.product_images.map(img => ({
        image_url: img.image_url,
        sort_order: img.sort_order,
        is_hover_alternate: img.is_hover_alternate,
      })),
      variants: variants.map(v => ({
        id: v.id,
        size: v.size,
        color: v.color,
        stock: v.stock,
        sku: v.sku,
      })),
    };
  }

  async getProducts(
    categoryId?: number,
    search?: string,
    sort?: string,
    minPrice?: number,
    maxPrice?: number,
    size?: string,
    categoryGroup?: string,
    page?: number,
    limit?: number,
  ) {
    // We will query all active products and filter them in-memory to handle the category hierarchy & custom price sorting accurately
    const productsList = await this.prisma.products.findMany({
      where: {
        status: 'active',
      },
      include: {
        categories: true,
        product_images: {
          orderBy: { sort_order: 'asc' },
        },
        product_variants: true,
      },
    });

    // 1. Map to domain products
    let items = productsList.map(product => {
      const sizeOrder = ['S', 'M', 'L', 'XL', 'OS'];
      const variants = [...product.product_variants].sort((a, b) => {
        const idxA = sizeOrder.indexOf(a.size);
        const idxB = sizeOrder.indexOf(b.size);
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });

      return {
        id: product.id,
        category_id: product.category_id,
        category_name: product.categories?.name || null,
        parent_category_id: product.categories?.parent_id || null,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        sale_price: product.sale_price ? Number(product.sale_price) : null,
        is_new: product.is_new,
        is_sale: product.is_sale,
        status: product.status,
        created_at: product.created_at,
        updated_at: product.updated_at,
        images: product.product_images.map(img => ({
          image_url: img.image_url,
          sort_order: img.sort_order,
          is_hover_alternate: img.is_hover_alternate,
        })),
        variants: variants.map(v => ({
          id: v.id,
          size: v.size,
          color: v.color,
          stock: v.stock,
          sku: v.sku,
        })),
      };
    });

    // 2. Filter in-memory
    if (categoryId !== undefined && categoryId !== null) {
      items = items.filter(
        item =>
          item.category_id === categoryId ||
          item.parent_category_id === categoryId,
      );
    }

    if (categoryGroup) {
      if (categoryGroup === 'tops') {
        items = items.filter(item => [11, 12, 13].includes(item.category_id || 0));
      } else if (categoryGroup === 'outwears') {
        items = items.filter(item => [21, 22, 23].includes(item.category_id || 0));
      } else if (categoryGroup === 'bottoms') {
        items = items.filter(item => [31, 32].includes(item.category_id || 0));
      } else if (categoryGroup === 'accessories') {
        items = items.filter(item => [41, 42, 43].includes(item.category_id || 0));
      }
    }

    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(s) ||
          (item.description && item.description.toLowerCase().includes(s)),
      );
    }

    if (minPrice !== undefined && minPrice !== null) {
      items = items.filter(item => {
        const effectivePrice = item.sale_price !== null ? item.sale_price : item.price;
        return effectivePrice >= minPrice;
      });
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      items = items.filter(item => {
        const effectivePrice = item.sale_price !== null ? item.sale_price : item.price;
        return effectivePrice <= maxPrice;
      });
    }

    if (size) {
      items = items.filter(item =>
        item.variants.some(v => v.size === size && v.stock > 0),
      );
    }

    // 3. Sort in-memory
    if (sort === 'price_asc') {
      items.sort((a, b) => {
        const pA = a.sale_price !== null ? a.sale_price : a.price;
        const pB = b.sale_price !== null ? b.sale_price : b.price;
        return pA - pB;
      });
    } else if (sort === 'price_desc') {
      items.sort((a, b) => {
        const pA = a.sale_price !== null ? a.sale_price : a.price;
        const pB = b.sale_price !== null ? b.sale_price : b.price;
        return pB - pA;
      });
    } else if (sort === 'newest') {
      items.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    } else {
      // Default: is_new DESC, created_at DESC
      items.sort((a, b) => {
        if (a.is_new && !b.is_new) return -1;
        if (!a.is_new && b.is_new) return 1;
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    }

    const total = items.length;

    // 4. Paginate
    if (page !== undefined && page !== null && limit !== undefined && limit !== null) {
      const offset = (page - 1) * limit;
      items = items.slice(offset, offset + limit);
    }

    return {
      products: items,
      total,
    };
  }

  async getAllProductsAdmin() {
    const products = await this.prisma.products.findMany({
      orderBy: { id: 'desc' },
      include: {
        categories: true,
        product_images: {
          orderBy: { sort_order: 'asc' },
        },
        product_variants: true,
      },
    });

    const sizeOrder = ['S', 'M', 'L', 'XL', 'OS'];

    return products.map(product => {
      const variants = [...product.product_variants].sort((a, b) => {
        const idxA = sizeOrder.indexOf(a.size);
        const idxB = sizeOrder.indexOf(b.size);
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });

      return {
        id: product.id,
        category_id: product.category_id,
        category_name: product.categories?.name || null,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        sale_price: product.sale_price ? Number(product.sale_price) : null,
        is_new: product.is_new,
        is_sale: product.is_sale,
        status: product.status,
        created_at: product.created_at,
        updated_at: product.updated_at,
        images: product.product_images.map(img => ({
          image_url: img.image_url,
          sort_order: img.sort_order,
          is_hover_alternate: img.is_hover_alternate,
        })),
        variants: variants.map(v => ({
          id: v.id,
          size: v.size,
          color: v.color,
          stock: v.stock,
          sku: v.sku,
        })),
      };
    });
  }

  async createProductDb(data: any, variants: any[], images: any[]) {
    // Run in transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Create product
      const product = await tx.products.create({
        data: {
          category_id: data.category_id ? Number(data.category_id) : null,
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          sale_price: data.sale_price,
          is_new: data.is_new,
          is_sale: data.is_sale,
          status: data.status,
        },
      });

      // 2. Create variants
      for (const v of variants) {
        if (!v.size) continue;
        const sku = v.sku || `SKU-${product.id}-${v.size}-${Math.floor(Math.random() * 900 + 100)}`;
        await tx.product_variants.create({
          data: {
            product_id: product.id,
            size: v.size,
            color: v.color || null,
            stock: Number(v.stock || 0),
            sku: sku,
          },
        });
      }

      // 3. Create images
      for (let idx = 0; idx < images.length; idx++) {
        const imgUrl = images[idx];
        if (!imgUrl) continue;
        await tx.product_images.create({
          data: {
            product_id: product.id,
            image_url: imgUrl,
            sort_order: idx,
            is_hover_alternate: idx === 1,
          },
        });
      }

      return product.id;
    });
  }

  async updateProductDb(productId: number, data: any, variants: any[], images: any[]) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Update product
      await tx.products.update({
        where: { id: productId },
        data: {
          category_id: data.category_id ? Number(data.category_id) : null,
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          sale_price: data.sale_price,
          is_new: data.is_new,
          is_sale: data.is_sale,
          status: data.status,
        },
      });

      // 2. Sync variants (Delete then Insert)
      await tx.product_variants.deleteMany({
        where: { product_id: productId },
      });

      for (const v of variants) {
        if (!v.size) continue;
        const sku = v.sku || `SKU-${productId}-${v.size}-${Math.floor(Math.random() * 900 + 100)}`;
        await tx.product_variants.create({
          data: {
            product_id: productId,
            size: v.size,
            color: v.color || null,
            stock: Number(v.stock || 0),
            sku: sku,
          },
        });
      }

      // 3. Sync images (Delete then Insert)
      await tx.product_images.deleteMany({
        where: { product_id: productId },
      });

      for (let idx = 0; idx < images.length; idx++) {
        const imgUrl = images[idx];
        if (!imgUrl) continue;
        await tx.product_images.create({
          data: {
            product_id: productId,
            image_url: imgUrl,
            sort_order: idx,
            is_hover_alternate: idx === 1,
          },
        });
      }

      return true;
    });
  }

  async deleteProductDb(productId: number) {
    return this.prisma.$transaction(async (tx) => {
      await tx.product_variants.deleteMany({
        where: { product_id: productId },
      });

      await tx.product_images.deleteMany({
        where: { product_id: productId },
      });

      await tx.products.delete({
        where: { id: productId },
      });

      return true;
    });
  }

  async createCategoryDb(name: string, slug: string, description: string | null, parentId: number | null) {
    const category = await this.prisma.categories.create({
      data: {
        name,
        slug,
        description,
        parent_id: parentId ? Number(parentId) : null,
      },
    });
    return category.id;
  }

  async updateCategoryDb(id: number, name: string, slug: string, description: string | null, parentId: number | null) {
    await this.prisma.categories.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        parent_id: parentId ? Number(parentId) : null,
      },
    });
    return true;
  }

  async deleteCategoryDb(id: number) {
    await this.prisma.categories.delete({
      where: { id },
    });
    return true;
  }
}
