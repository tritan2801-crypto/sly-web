/**
 * Section: Shop Product Grid
 */
export default class ProductGrid {
    constructor(page) {
        this.page = page;
        this.container = document.createElement('div');
        this.container.className = 'flex-grow space-y-6';
        this.products = [];
        this.loading = true;
    }

    async fetchProducts() {
        this.loading = true;
        this.renderPlaceholder();

        const params = this.page.getQueryParams();
        let queryStr = '';

        const apiParams = [];
        if (params.category_id) apiParams.push(`category_id=${params.category_id}`);
        if (params.category_group) apiParams.push(`category_group=${params.category_group}`);
        if (params.size) apiParams.push(`size=${params.size}`);
        if (params.max_price) apiParams.push(`max_price=${params.max_price}`);
        if (params.search) apiParams.push(`search=${encodeURIComponent(params.search)}`);
        if (params.sort) apiParams.push(`sort=${params.sort}`);

        // Pagination parameters
        const page = params.page ? parseInt(params.page) : 1;
        apiParams.push(`page=${page}`);
        apiParams.push(`limit=9`);

        if (apiParams.length > 0) {
            queryStr = '?' + apiParams.join('&');
        }

        try {
            const res = await fetch(`/api/products${queryStr}`);
            const data = await res.json();
            if (data.success) {
                this.products = data.data;
                this.pagination = data.pagination;
            }
        } catch (e) {
            this.products = [];
            this.pagination = null;
        } finally {
            this.loading = false;
            this.renderContent();
            
            // Reset scroll to top of page when catalog finishes loading to prevent mid-page jumps
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }

    render() {
        this.fetchProducts();
        return this.container;
    }

    renderPlaceholder() {
        this.container.innerHTML = `
            <div class="flex items-center justify-between border-b border-borderMuted pb-4">
                <div class="h-4 w-32 bg-zinc-200 animate-pulse"></div>
                <div class="h-8 w-40 bg-zinc-200 animate-pulse"></div>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
                ${Array(6).fill(0).map(() => `
                    <div class="space-y-4 animate-pulse">
                        <div class="aspect-[3/4] bg-zinc-150 border border-borderMuted"></div>
                        <div class="h-3 w-1/3 bg-zinc-200"></div>
                        <div class="h-4 w-2/3 bg-zinc-200"></div>
                        <div class="h-4 w-1/4 bg-zinc-200"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderContent() {
        const params = this.page.getQueryParams();
        const activeSort = params.sort || 'default';

        let activeFiltersHtml = '';
        if (params.size || params.max_price || params.search || params.category_group) {
            activeFiltersHtml = `
                <div class="flex flex-wrap items-center gap-2 mb-4">
                    <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Bộ lọc đang chọn:</span>
                    ${params.category_group ? `<span class="bg-zinc-100 text-zinc-800 text-[10px] font-bold px-2 py-1 uppercase border border-borderMuted">Nhóm: ${params.category_group}</span>` : ''}
                    ${params.size ? `<span class="bg-zinc-100 text-zinc-800 text-[10px] font-bold px-2 py-1 uppercase border border-borderMuted">Size: ${params.size}</span>` : ''}
                    ${params.max_price ? `<span class="bg-zinc-100 text-zinc-800 text-[10px] font-bold px-2 py-1 uppercase border border-borderMuted">Giá dưới: ${this.formatCurrency(params.max_price)}</span>` : ''}
                    ${params.search ? `<span class="bg-zinc-100 text-zinc-800 text-[10px] font-bold px-2 py-1 border border-borderMuted truncate max-w-40">Tìm: "${params.search}"</span>` : ''}
                </div>
            `;
        }

        if (this.products.length === 0) {
            this.container.innerHTML = `
                <div class="border-b border-borderMuted pb-4 flex items-center justify-between">
                    <span class="text-xs text-zinc-500 font-bold uppercase tracking-widest">Sản Phẩm (0)</span>
                </div>
                ${activeFiltersHtml}
                <div class="flex flex-col items-center justify-center py-24 text-center space-y-4">
                    <i data-lucide="info" class="w-12 h-12 text-zinc-300"></i>
                    <h3 class="text-sm font-bold uppercase tracking-wider text-primary">Không tìm thấy sản phẩm</h3>
                    <p class="text-xs text-zinc-400 max-w-xs leading-relaxed">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn để tìm sản phẩm phù hợp.</p>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        // Compile Pagination HTML
        let paginationHtml = '';
        if (this.pagination && this.pagination.total_pages > 1) {
            const currentPage = this.pagination.page;
            const totalPages = this.pagination.total_pages;

            let pagesButtons = '';
            for (let i = 1; i <= totalPages; i++) {
                if (i === currentPage) {
                    pagesButtons += `
                        <button class="w-8 h-8 flex items-center justify-center border border-primary bg-primary text-white text-xs font-bold transition-all select-none">
                            ${i}
                        </button>
                    `;
                } else {
                    pagesButtons += `
                        <button class="w-8 h-8 flex items-center justify-center border border-borderMuted hover:border-primary hover:text-primary text-zinc-600 text-xs font-bold transition-all select-none" data-page-btn="${i}">
                            ${i}
                        </button>
                    `;
                }
            }

            paginationHtml = `
                <!-- Pagination Controls -->
                <div class="flex items-center justify-center space-x-2 pt-12 border-t border-borderMuted/60 mt-12 select-none">
                    <button class="w-8 h-8 flex items-center justify-center border border-borderMuted hover:border-primary text-zinc-600 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed" id="shop-prev-page" ${currentPage === 1 ? 'disabled' : ''}>
                        <i data-lucide="chevron-left" class="w-4 h-4"></i>
                    </button>
                    
                    ${pagesButtons}
                    
                    <button class="w-8 h-8 flex items-center justify-center border border-borderMuted hover:border-primary text-zinc-600 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed" id="shop-next-page" ${currentPage === totalPages ? 'disabled' : ''}>
                        <i data-lucide="chevron-right" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
        }

        this.container.innerHTML = `
            <!-- Top Controls -->
            <div class="border-b border-borderMuted pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <span class="text-xs text-zinc-500 font-bold uppercase tracking-widest">SẢN PHẨM KHẢ DỤNG (${this.pagination ? this.pagination.total : this.products.length})</span>
                
                <!-- Sort Dropdown -->
                <div class="flex items-center space-x-2 text-xs font-bold self-end sm:self-auto">
                    <span class="text-zinc-500 uppercase tracking-widest">Sắp xếp:</span>
                    <select id="shop-sort-select" class="border border-borderMuted bg-white py-1.5 px-3 focus:outline-none focus:border-primary uppercase tracking-wider cursor-pointer text-xs">
                        <option value="default" ${activeSort === 'default' ? 'selected' : ''}>Khuyên dùng</option>
                        <option value="price_asc" ${activeSort === 'price_asc' ? 'selected' : ''}>Giá: Thấp đến Cao</option>
                        <option value="price_desc" ${activeSort === 'price_desc' ? 'selected' : ''}>Giá: Cao đến Thấp</option>
                        <option value="newest" ${activeSort === 'newest' ? 'selected' : ''}>Mới Nhất</option>
                    </select>
                </div>
            </div>

            <!-- Active Filter tags -->
            ${activeFiltersHtml}

            <!-- Products Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                ${this.products.map(prod => {
                    const primaryImg = prod.images.find(img => img.is_hover_alternate === 0)?.image_url 
                                       || (prod.images[0] ? prod.images[0].image_url : 'https://placehold.co/300x400/000000/ffffff?text=SLY');
                    const alternateImg = prod.images.find(img => img.is_hover_alternate === 1)?.image_url 
                                         || primaryImg;

                    const isDiscounted = prod.is_sale && prod.sale_price;
                    const originalPrice = parseFloat(prod.price);
                    const salePrice = isDiscounted ? parseFloat(prod.sale_price) : null;

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
                            
                            <!-- Image container -->
                            <div class="relative aspect-[3/4] overflow-hidden bg-zinc-50 border border-borderMuted select-none">
                                <div class="absolute top-2 left-2 z-10 flex flex-col space-y-1">
                                    ${badgeHtml}
                                </div>
                                <div class="absolute inset-0 w-full h-full">
                                    <img src="${primaryImg}" alt="${prod.name}" 
                                        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
                                    <img src="${alternateImg}" alt="${prod.name} Alternate" 
                                        class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                </div>
                            </div>

                            <!-- Text info -->
                            <div class="mt-4 flex flex-col items-start space-y-1">
                                <span class="text-[9px] text-zinc-500 uppercase tracking-widest font-medium">${prod.category_name}</span>
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
                }).join('')}
            </div>

            <!-- Pagination Grid bottom -->
            ${paginationHtml}
        `;

        // Bind Sort Change event
        const sortSelect = this.container.querySelector('#shop-sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const sortVal = e.target.value;
                if (sortVal === 'default') {
                    delete params.sort;
                } else {
                    params.sort = sortVal;
                }
                
                // Reset page to 1 when sort changes
                delete params.page;
                
                this.updateHash(params);
            });
        }

        // Bind Page Click events
        this.container.querySelectorAll('[data-page-btn]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetPage = e.currentTarget.getAttribute('data-page-btn');
                params.page = targetPage;
                this.updateHash(params);
            });
        });

        const prevBtn = this.container.querySelector('#shop-prev-page');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const targetPage = this.pagination.page - 1;
                params.page = targetPage;
                this.updateHash(params);
            });
        }

        const nextBtn = this.container.querySelector('#shop-next-page');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const targetPage = this.pagination.page + 1;
                params.page = targetPage;
                this.updateHash(params);
            });
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    updateHash(params) {
        const queryStr = Object.keys(params)
            .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        window.location.hash = queryStr ? `#shop?${queryStr}` : '#shop';
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
    }
}
