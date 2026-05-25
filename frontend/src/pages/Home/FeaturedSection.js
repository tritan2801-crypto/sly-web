/**
 * Section: Homepage Featured Products Grid
 */
export default class FeaturedSection {
    constructor(app) {
        this.app = app;
        this.container = document.createElement('section');
        this.container.className = 'py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
        this.products = [];
        this.loading = true;
    }

    async fetchFeaturedProducts() {
        try {
            const res = await fetch('/api/products?sort=newest');
            const data = await res.json();
            if (data.success) {
                // Show first 4 products for homepage
                this.products = data.data.slice(0, 4);
            }
        } catch (e) {
            this.products = [];
        } finally {
            this.loading = false;
            this.renderContent();
        }
    }

    render() {
        // Initial shell render
        this.container.innerHTML = `
            <div class="mb-10 flex flex-col sm:flex-row items-center justify-between">
                <div class="text-center sm:text-left mb-4 sm:mb-0">
                    <span class="text-accent text-xs font-bold tracking-widest uppercase">MỚI NHẤT</span>
                    <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary uppercase mt-1">SẢN PHẨM KHUYÊN DÙNG</h2>
                </div>
                <a href="#shop" class="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary border-b border-primary hover:text-accent hover:border-accent transition-colors pb-1">Xem tất cả sản phẩm</a>
            </div>

            <div id="featured-products-container" class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <!-- Loading State -->
                <div class="col-span-full flex flex-col items-center justify-center py-20">
                    <div class="spinner mb-4"></div>
                    <p class="text-xs text-zinc-500 uppercase tracking-widest">Đang tải sản phẩm...</p>
                </div>
            </div>
        `;

        this.fetchFeaturedProducts();

        return this.container;
    }

    renderContent() {
        const grid = this.container.querySelector('#featured-products-container');
        if (!grid) return;

        if (this.products.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12 text-zinc-400">
                    <p class="text-sm">Không thể lấy dữ liệu sản phẩm mẫu. Vui lòng kết nối database MySQL.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.products.map(prod => {
            // Find images
            const primaryImg = prod.images.find(img => img.is_hover_alternate === 0)?.image_url 
                               || (prod.images[0] ? prod.images[0].image_url : 'https://placehold.co/300x400/000000/ffffff?text=SLY');
            const alternateImg = prod.images.find(img => img.is_hover_alternate === 1)?.image_url 
                                 || primaryImg;

            const isDiscounted = prod.is_sale && prod.sale_price;
            const originalPrice = parseFloat(prod.price);
            const salePrice = isDiscounted ? parseFloat(prod.sale_price) : null;

            // Badges
            let badgeHtml = '';
            if (prod.is_new) {
                badgeHtml += `<span class="bg-black text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider">New</span>`;
            }
            if (prod.is_sale) {
                const discPct = isDiscounted ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
                badgeHtml += `<span class="bg-accent text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider">- ${discPct}%</span>`;
            }

            return `
                <div class="group flex flex-col cursor-pointer" data-track-hover="${prod.id}" onclick="window.location.hash='#product?id=${prod.id}'">
                    
                    <!-- Image Container with Hover transition -->
                    <div class="relative aspect-[3/4] overflow-hidden bg-zinc-50 border border-borderMuted select-none">
                        
                        <!-- Badges -->
                        <div class="absolute top-2 left-2 z-10 flex flex-col space-y-1">
                            ${badgeHtml}
                        </div>

                        <!-- Image swap elements -->
                        <div class="absolute inset-0 w-full h-full">
                            <img src="${primaryImg}" alt="${prod.name}" 
                                class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
                            <img src="${alternateImg}" alt="${prod.name} Alternate" 
                                class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </div>

                    </div>

                    <!-- Bottom Info -->
                    <div class="mt-4 flex flex-col items-start space-y-1">
                        <span class="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">${prod.category_name}</span>
                        <h3 class="text-sm font-bold text-primary uppercase tracking-wider w-full">${prod.name}</h3>
                        
                        <div class="flex items-center space-x-2 pt-1">
                            ${isDiscounted ? `
                                <span class="text-sm font-bold text-accent">${this.formatCurrency(salePrice)}</span>
                                <span class="text-xs text-zinc-400 line-through">${this.formatCurrency(originalPrice)}</span>
                            ` : `
                                <span class="text-sm font-bold text-primary">${this.formatCurrency(originalPrice)}</span>
                            `}
                        </div>
                    </div>

                </div>
            `;
        }).join('');
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
    }
}
