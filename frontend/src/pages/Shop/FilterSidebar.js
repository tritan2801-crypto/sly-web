/**
 * Section: Shop Filter Sidebar
 */
export default class FilterSidebar {
    constructor(page) {
        this.page = page;
        this.container = document.createElement('aside');
        this.container.className = 'w-full md:w-64 flex-shrink-0 bg-white border border-borderMuted p-6 space-y-8';
    }

    render() {
        const queryParams = this.page.getQueryParams();
        let activeGroup = queryParams.category_group || '';
        const activeSubcatId = queryParams.category_id ? parseInt(queryParams.category_id) : null;

        if (activeSubcatId) {
            if ([11, 12, 13].includes(activeSubcatId)) activeGroup = 'tops';
            else if ([21, 22, 23].includes(activeSubcatId)) activeGroup = 'outwears';
            else if ([31, 32].includes(activeSubcatId)) activeGroup = 'bottoms';
            else if ([41, 42, 43].includes(activeSubcatId)) activeGroup = 'accessories';
        }

        const activeSize = queryParams.size || '';
        const maxPriceVal = queryParams.max_price ? parseInt(queryParams.max_price) : 1000000;

        // Core categories list
        const categories = [
            { 
                group: 'tops', 
                name: 'ÁO THUN & SƠ MI / TOPS', 
                subs: [
                    { id: 11, name: 'T-Shirt' },
                    { id: 12, name: 'Polo' },
                    { id: 13, name: 'Shirt' }
                ]
            },
            { 
                group: 'outwears', 
                name: 'ÁO KHOÁC / OUTWEARS', 
                subs: [
                    { id: 21, name: 'Hoodie' },
                    { id: 22, name: 'Jacket' },
                    { id: 23, name: 'Sweater' }
                ]
            },
            { 
                group: 'bottoms', 
                name: 'QUẦN / BOTTOMS', 
                subs: [
                    { id: 31, name: 'Short' },
                    { id: 32, name: 'Pant' }
                ]
            },
            { 
                group: 'accessories', 
                name: 'PHỤ KIỆN / ACCESSORIES', 
                subs: [
                    { id: 41, name: 'Wallet' },
                    { id: 42, name: 'Cap' },
                    { id: 43, name: 'Backpacks' }
                ]
            }
        ];

        const sizes = ['S', 'M', 'L', 'XL', 'OS'];

        this.container.innerHTML = `
            <!-- Categories Filter -->
            <div class="space-y-4">
                <h3 class="text-xs font-bold uppercase tracking-wider text-primary border-b border-primary pb-2 flex items-center justify-between">
                    <span>DANH MỤC</span>
                    <i data-lucide="menu" class="w-3.5 h-3.5"></i>
                </h3>
                <ul class="space-y-2 text-sm font-medium">
                    <li>
                        <button class="w-full text-left py-1 hover:text-accent transition-colors flex items-center justify-between ${activeGroup === '' ? 'text-accent font-bold' : 'text-zinc-650'}" data-cat-group="">
                            <span>Tất Cả Sản Phẩm</span>
                            <i data-lucide="chevron-right" class="w-3 h-3"></i>
                        </button>
                    </li>
                    ${categories.map(cat => {
                        const isGroupActive = activeGroup === cat.group;
                        return `
                            <li class="space-y-1">
                                <button class="w-full text-left py-1 hover:text-accent transition-colors flex items-center justify-between ${isGroupActive && !activeSubcatId ? 'text-accent font-bold' : 'text-zinc-650'}" data-cat-group="${cat.group}">
                                    <span>${cat.name}</span>
                                    <i data-lucide="chevron-right" class="w-3 h-3 ${isGroupActive ? 'rotate-90 text-accent' : ''} transition-transform"></i>
                                </button>
                                ${isGroupActive ? `
                                    <ul class="pl-4 space-y-1.5 border-l border-zinc-200 mt-1 pb-1 text-xs font-semibold text-zinc-500">
                                        ${cat.subs.map(sub => `
                                            <li>
                                                <button class="w-full text-left py-0.5 hover:text-accent transition-colors ${activeSubcatId === sub.id ? 'text-accent font-extrabold' : ''}" data-cat-id="${sub.id}">
                                                    • ${sub.name}
                                                </button>
                                            </li>
                                        `).join('')}
                                    </ul>
                                ` : ''}
                            </li>
                        `;
                    }).join('')}
                </ul>
            </div>

            <!-- Size Filter -->
            <div class="space-y-4">
                <h3 class="text-xs font-bold uppercase tracking-wider text-primary border-b border-primary pb-2 flex items-center justify-between">
                    <span>KÍCH CỠ / SIZE</span>
                    <i data-lucide="scissors" class="w-3.5 h-3.5"></i>
                </h3>
                <div class="grid grid-cols-5 gap-2">
                    ${sizes.map(sz => `
                        <button class="py-2 text-center text-xs font-bold border transition-colors ${activeSize === sz ? 'bg-primary text-white border-primary' : 'bg-white text-zinc-650 border-borderMuted hover:border-primary'}" data-size="${sz}">
                            ${sz}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Price Filter -->
            <div class="space-y-4">
                <h3 class="text-xs font-bold uppercase tracking-wider text-primary border-b border-primary pb-2 flex items-center justify-between">
                    <span>KHOẢNG GIÁ</span>
                    <i data-lucide="sliders" class="w-3.5 h-3.5"></i>
                </h3>
                <div class="space-y-2">
                    <input type="range" id="price-range-slider" min="0" max="1000000" step="55000" value="${maxPriceVal}" class="w-full accent-accent h-1 bg-zinc-200" />
                    <div class="flex justify-between items-center text-xs font-bold text-zinc-550 pt-1">
                        <span>0đ</span>
                        <span id="price-range-label" class="text-accent">${this.formatCurrency(maxPriceVal)}</span>
                    </div>
                </div>
            </div>

            <!-- Clear Filter Trigger -->
            <button id="btn-clear-filters" class="w-full py-2.5 bg-zinc-100 text-zinc-700 font-bold text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-colors duration-300">
                Xóa Bộ Lọc
            </button>
        `;

        return this.container;
    }

    mount() {
        const queryParams = this.page.getQueryParams();

        // 1. Categories Click
        this.container.querySelectorAll('[data-cat-group]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const group = e.currentTarget.getAttribute('data-cat-group');
                delete queryParams.category_id; // Clear sub-category ID
                if (group) {
                    queryParams.category_group = group;
                } else {
                    delete queryParams.category_group;
                }
                this.updateHash(queryParams);
            });
        });

        // 1.1 Subcategories Click
        this.container.querySelectorAll('[data-cat-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const subId = e.currentTarget.getAttribute('data-cat-id');
                delete queryParams.category_group; // Clear group since we filter by exact subcategory ID
                if (subId) {
                    queryParams.category_id = subId;
                } else {
                    delete queryParams.category_id;
                }
                this.updateHash(queryParams);
            });
        });

        // 2. Size Click
        this.container.querySelectorAll('[data-size]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sz = e.target.getAttribute('data-size');
                if (queryParams.size === sz) {
                    delete queryParams.size; // Toggle off
                } else {
                    queryParams.size = sz;
                }
                this.updateHash(queryParams);
            });
        });

        // 3. Price Slider
        const slider = this.container.querySelector('#price-range-slider');
        const label = this.container.querySelector('#price-range-label');
        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            label.innerText = this.formatCurrency(val);
        });
        slider.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            queryParams.max_price = val;
            this.updateHash(queryParams);
        });

        // 4. Clear Filters
        this.container.querySelector('#btn-clear-filters').addEventListener('click', () => {
            const emptyParams = {};
            if (queryParams.id) {
                emptyParams.id = queryParams.id;
            }
            this.updateHash(emptyParams);
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    updateHash(params) {
        delete params.page; // Reset to page 1 when filters are changed
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
