/**
 * Section: Homepage Shop The Look Lookbook
 * Interactive masonry grid showing outfits with pulsing hotspots that slide out a quick-buy drawer.
 */
export default class ShopTheLook {
    constructor(app) {
        this.app = app;
        this.looks = [
            {
                id: 1,
                title: 'LOOK 01 - BASIC URBAN',
                image: 'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&w=600',
                hotspots: [
                    { top: '38%', left: '48%', productId: 1, name: 'SLY Classic Logo Tee', price: 350000, tooltipAlign: 'top' },
                    { top: '12%', left: '48%', productId: 91, name: 'SLY Signature Streetwear Cap', price: 180000, tooltipAlign: 'bottom' }
                ]
            },
            {
                id: 2,
                title: 'LOOK 02 - OVERSIZED UTILITY',
                image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600',
                hotspots: [
                    { top: '48%', left: '50%', productId: 31, name: 'SLY Heavy Fleece Hoodie', price: 499000, tooltipAlign: 'top' }
                ]
            },
            {
                id: 3,
                title: 'LOOK 03 - STREET TECHWEAR',
                image: 'https://images.pexels.com/photos/1759622/pexels-photo-1759622.jpeg?auto=compress&cs=tinysrgb&w=600',
                hotspots: [
                    { top: '42%', left: '52%', productId: 41, name: 'SLY Techwear Utility Jacket', price: 750000, tooltipAlign: 'top' }
                ]
            },
            {
                id: 4,
                title: 'LOOK 04 - CORE ACCESSORIES',
                image: 'https://images.pexels.com/photos/3018940/pexels-photo-3018940.jpeg?auto=compress&cs=tinysrgb&w=600',
                hotspots: [
                    { top: '14%', left: '52%', productId: 91, name: 'SLY Signature Streetwear Cap', price: 180000, tooltipAlign: 'bottom' },
                    { top: '55%', left: '45%', productId: 101, name: 'SLY Cordura Utility Backpack', price: 390000, tooltipAlign: 'top' }
                ]
            }
        ];
        
        this.container = document.createElement('section');
        this.container.className = 'py-12 sm:py-16 w-full px-4 sm:px-8 lg:px-12 bg-white border-b border-borderMuted';
        
        // Component state
        this.activeLook = null;
        this.loadingProducts = false;
        this.lookProducts = [];
    }

    render() {
        this.container.innerHTML = `
            <!-- Header -->
            <div class="mb-10 text-center sm:text-left">
                <span class="text-accent text-xs font-bold tracking-widest uppercase">STREET CULTURE</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary uppercase mt-1">SHOP THE LOOK</h2>
            </div>

            <!-- Mosaic Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${this.looks.map(look => `
                    <div class="relative aspect-[3/4] bg-zinc-900 border border-borderMuted group select-none">
                        
                        <!-- Look Image Container (overflow hidden to crop image zoom) -->
                        <div class="absolute inset-0 overflow-hidden">
                            <img src="${look.image}" alt="${look.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        
                        <!-- Hotspots -->
                        ${look.hotspots.map(spot => {
                            const tooltipClass = spot.tooltipAlign === 'bottom' 
                                ? 'top-10 origin-top' 
                                : 'bottom-10 origin-bottom';
                            
                            return `
                                <button class="absolute z-20 flex items-center justify-center bg-accent text-white rounded-full w-8 h-8 shadow-lg hover:scale-110 active:scale-95 transition-transform duration-300 focus:outline-none group/spot"
                                        style="top: ${spot.top}; left: ${spot.left};"
                                        data-spot-look="${look.id}"
                                        title="Xem sản phẩm: ${spot.name}">
                                    <span class="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping"></span>
                                    <i data-lucide="plus" class="w-4 h-4 relative z-10"></i>
                                    
                                    <!-- Hover Tooltip -->
                                    <span class="absolute ${tooltipClass} left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1.5 px-3 border border-zinc-800 shadow-xl opacity-0 pointer-events-none transition-all duration-300 scale-95 group-hover/spot:opacity-100 group-hover/spot:scale-100 transform flex items-center space-x-1.5 z-30 whitespace-nowrap">
                                        <span class="uppercase tracking-wider">${spot.name}</span>
                                        <span class="text-accent">•</span>
                                        <span class="text-accent font-extrabold">${this.formatCurrency(spot.price)}</span>
                                    </span>
                                </button>
                            `;
                        }).join('')}

                        <!-- Label Overlay -->
                        <div class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent pt-12 flex items-center justify-between pointer-events-none">
                            <span class="text-white text-xs font-bold tracking-widest uppercase">${look.title}</span>
                            <span class="text-[9px] text-white/70 font-semibold uppercase tracking-wider bg-white/10 px-2 py-0.5 border border-white/20 backdrop-blur-sm">Xem Set Đồ</span>
                        </div>
                        
                        <!-- Click trigger overlay (covers look except hotspots) -->
                        <div class="absolute inset-0 z-10 cursor-pointer" data-trigger-look="${look.id}"></div>
                    </div>
                `).join('')}
            </div>

            <!-- Slide-out Drawer Overlay -->
            <div id="lookbook-drawer-overlay" class="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-300 opacity-0 pointer-events-none">
                <div id="lookbook-drawer" class="absolute right-0 top-0 h-full w-full max-w-md bg-white text-primary flex flex-col shadow-2xl transition-transform duration-300 translate-x-full">
                    
                    <!-- Drawer Header -->
                    <div class="flex items-center justify-between p-5 sm:p-6 border-b border-borderMuted">
                        <h3 class="text-sm font-extrabold uppercase tracking-widest flex items-center">
                            <i data-lucide="tag" class="w-4.5 h-4.5 mr-2 text-accent"></i> CHI TIẾT SET ĐỒ
                        </h3>
                        <button id="lookbook-drawer-close" class="p-2 hover:text-accent transition-colors focus:outline-none">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>

                    <!-- Drawer Content -->
                    <div id="lookbook-drawer-content" class="flex-grow overflow-y-auto p-5 sm:p-6 space-y-6">
                        <!-- Loaded dynamically -->
                    </div>
                </div>
            </div>
        `;

        return this.container;
    }

    mount() {
        // Overlay DOM placement correction
        this.drawerOverlay = this.container.querySelector('#lookbook-drawer-overlay');
        this.drawer = this.container.querySelector('#lookbook-drawer');
        
        if (this.drawerOverlay) {
            const oldOverlay = document.getElementById('lookbook-drawer-overlay');
            if (oldOverlay) {
                oldOverlay.remove();
            }
            document.body.appendChild(this.drawerOverlay);
        }

        // Close bindings
        const closeBtn = this.drawerOverlay.querySelector('#lookbook-drawer-close');
        closeBtn.addEventListener('click', () => this.closeDrawer());
        this.drawerOverlay.addEventListener('click', (e) => {
            if (!this.drawer.contains(e.target)) this.closeDrawer();
        });

        // Click bindings for looks and hotspots
        this.container.querySelectorAll('[data-trigger-look], [data-spot-look]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lookId = parseInt(e.currentTarget.getAttribute('data-trigger-look') || e.currentTarget.getAttribute('data-spot-look'));
                this.openDrawer(lookId);
            });
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    openDrawer(lookId) {
        this.activeLook = this.looks.find(l => l.id === lookId);
        if (!this.activeLook) return;

        // Show Drawer overlay
        this.drawerOverlay.classList.remove('opacity-0', 'pointer-events-none');
        this.drawerOverlay.classList.add('opacity-100', 'pointer-events-auto');
        
        this.drawer.classList.remove('translate-x-full');
        this.drawer.classList.add('translate-x-0');

        // Fetch lookbook products details
        this.fetchLookProducts();
    }

    closeDrawer() {
        this.drawerOverlay.classList.remove('opacity-100', 'pointer-events-auto');
        this.drawerOverlay.classList.add('opacity-0', 'pointer-events-none');
        
        this.drawer.classList.remove('translate-x-0');
        this.drawer.classList.add('translate-x-full');
        
        this.activeLook = null;
        this.lookProducts = [];
    }

    async fetchLookProducts() {
        const container = this.drawerOverlay.querySelector('#lookbook-drawer-content');
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-24 text-zinc-400 space-y-4">
                <div class="spinner"></div>
                <p class="text-[10px] font-bold uppercase tracking-widest">Đang kết nối sản phẩm...</p>
            </div>
        `;

        this.loadingProducts = true;
        const fetched = [];

        try {
            for (const spot of this.activeLook.hotspots) {
                const res = await fetch(`/api/products/detail?id=${spot.productId}`);
                const data = await res.json();
                if (data.success) {
                    fetched.push(data.data);
                }
            }
            this.lookProducts = fetched;
        } catch (e) {
            this.lookProducts = [];
        } finally {
            this.loadingProducts = false;
            this.renderDrawerContent();
        }
    }

    renderDrawerContent() {
        const container = this.drawerOverlay.querySelector('#lookbook-drawer-content');
        if (this.lookProducts.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-16 text-center text-zinc-400 space-y-3">
                    <i data-lucide="alert-circle" class="w-10 h-10"></i>
                    <p class="text-xs font-semibold">Không thể tải thông tin set đồ. Vui lòng thử lại sau.</p>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        container.innerHTML = `
            <!-- Look image summary header -->
            <div class="flex items-center space-x-4 border-b border-borderMuted pb-5 mb-5 select-none">
                <img src="${this.activeLook.image}" alt="${this.activeLook.title}" class="w-16 h-20 object-cover border border-borderMuted bg-neutralMuted" />
                <div class="space-y-1">
                    <span class="text-accent text-[9px] font-black tracking-widest uppercase">CẢM HỨNG PHỐ PHƯỜNG</span>
                    <h4 class="text-sm font-extrabold uppercase tracking-widest">${this.activeLook.title}</h4>
                    <p class="text-[11px] text-zinc-500 font-light">Set trang phục mang phong cách streetwear phóng khoáng và tối giản.</p>
                </div>
            </div>

            <!-- Products List -->
            <div class="space-y-8">
                ${this.lookProducts.map((prod, index) => {
                    const price = parseFloat(prod.price);
                    const salePrice = prod.sale_price ? parseFloat(prod.sale_price) : null;
                    const primaryImg = prod.images.find(img => img.is_hover_alternate === 0)?.image_url 
                                       || (prod.images[0] ? prod.images[0].image_url : 'https://placehold.co/300x400/000000/ffffff?text=SLY');
                    
                    // Exclude variants with 0 stock
                    const activeVariants = prod.variants.filter(v => v.stock > 0);
                    const isOutOfStock = activeVariants.length === 0;

                    return `
                        <div class="space-y-4 border-b border-borderMuted/60 pb-6 last:border-none last:pb-0" data-product-block="${prod.id}">
                            <div class="flex items-start space-x-4">
                                <a href="#product?id=${prod.id}" class="flex-shrink-0 lookbook-product-link">
                                    <img src="${primaryImg}" alt="${prod.name}" class="w-20 h-24 object-cover border border-borderMuted flex-shrink-0 bg-neutralMuted hover:opacity-85 transition-opacity" />
                                </a>
                                <div class="flex-grow min-w-0 space-y-1">
                                    <span class="text-[9px] text-zinc-400 uppercase tracking-widest font-semibold">${prod.category_name}</span>
                                    <a href="#product?id=${prod.id}" class="hover:text-accent transition-colors lookbook-product-link block">
                                        <h5 class="text-sm font-bold uppercase tracking-wider">${prod.name}</h5>
                                    </a>
                                    
                                    <div class="flex items-center space-x-2 pt-1 select-none">
                                        ${salePrice ? `
                                            <span class="text-sm font-extrabold text-accent">${this.formatCurrency(salePrice)}</span>
                                            <span class="text-xs text-zinc-400 line-through">${this.formatCurrency(price)}</span>
                                        ` : `
                                            <span class="text-sm font-extrabold text-primary">${this.formatCurrency(price)}</span>
                                        `}
                                    </div>
                                </div>
                            </div>

                            <!-- Options Form -->
                            ${isOutOfStock ? `
                                <div class="bg-red-50 text-accent text-xs font-bold py-2 px-3 border border-red-150 text-center uppercase tracking-widest select-none">TẠM HẾT HÀNG / OUT OF STOCK</div>
                            ` : `
                                <div class="space-y-3">
                                    <!-- Size selector -->
                                    <div class="space-y-1.5 select-none">
                                        <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">KÍCH CỠ / SELECT SIZE:</span>
                                        <div class="flex flex-wrap gap-2" data-size-selector="${prod.id}">
                                            ${activeVariants.map((v, vIdx) => `
                                                <button class="size-option-btn py-1.5 px-3 border text-xs font-bold tracking-wider transition-colors focus:outline-none ${vIdx === 0 ? 'bg-primary text-white border-primary selected' : 'bg-white text-zinc-650 border-borderMuted hover:border-primary'}" 
                                                        data-variant-id="${v.id}"
                                                        data-size="${v.size}">
                                                    ${v.size}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>

                                    <!-- Add to Cart CTA -->
                                    <button class="btn-add-look-item w-full py-2.5 bg-primary text-white border border-primary font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all duration-300 flex items-center justify-center space-x-2"
                                            data-product-id="${prod.id}"
                                            data-index="${index}">
                                        <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
                                        <span>THÊM VÀO GIỎ HÀNG</span>
                                    </button>
                                </div>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        // Bind events for size triggers
        container.querySelectorAll('[data-size-selector]').forEach(selector => {
            const btns = selector.querySelectorAll('.size-option-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    btns.forEach(b => {
                        b.classList.remove('bg-primary', 'text-white', 'border-primary', 'selected');
                        b.classList.add('bg-white', 'text-zinc-650', 'border-borderMuted');
                    });
                    e.currentTarget.classList.add('bg-primary', 'text-white', 'border-primary', 'selected');
                    e.currentTarget.classList.remove('bg-white', 'text-zinc-650', 'border-borderMuted');
                });
            });
        });

        // Bind events for Quick Add-to-Cart
        container.querySelectorAll('.btn-add-look-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prodId = parseInt(e.currentTarget.getAttribute('data-product-id'));
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                const product = this.lookProducts[index];
                
                // Find selected variant option
                const selector = container.querySelector(`[data-size-selector="${prodId}"]`);
                const selectedBtn = selector ? selector.querySelector('.size-option-btn.selected') : null;
                if (!selectedBtn) return;

                const variantId = parseInt(selectedBtn.getAttribute('data-variant-id'));
                const size = selectedBtn.getAttribute('data-size');
                
                this.addToCart(product, variantId, size, e.currentTarget);
            });
        });

        // Bind events for clicking product links (closes drawer)
        container.querySelectorAll('.lookbook-product-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeDrawer();
            });
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    addToCart(product, variantId, size, buttonEl) {
        // Set loading visual
        const originalHtml = buttonEl.innerHTML;
        buttonEl.disabled = true;
        buttonEl.innerHTML = `
            <div class="spinner w-3.5 h-3.5 border-white border-t-transparent mr-2"></div>
            <span>ĐANG XỬ LÝ...</span>
        `;

        const cart = this.app.state.cart;
        const primaryImg = product.images.find(img => img.is_hover_alternate === 0)?.image_url 
                           || (product.images[0] ? product.images[0].image_url : '');

        // Check if item variant already in cart
        const existingIdx = cart.findIndex(item => item.variant_id === variantId);
        
        if (existingIdx > -1) {
            cart[existingIdx].quantity++;
        } else {
            cart.push({
                product_id: product.id,
                variant_id: variantId,
                name: product.name,
                image: primaryImg,
                size: size,
                color: product.variants.find(v => v.id === variantId)?.color || 'Default',
                price: product.price,
                sale_price: product.sale_price,
                quantity: 1
            });
        }

        // Save state and notify layout
        setTimeout(() => {
            this.app.saveCart();

            // Success feedback animation
            buttonEl.innerHTML = `
                <i data-lucide="check" class="w-3.5 h-3.5"></i>
                <span>THÀNH CÔNG!</span>
            `;
            buttonEl.classList.remove('bg-primary', 'hover:text-primary');
            buttonEl.classList.add('bg-green-600', 'border-green-600');

            if (window.lucide) window.lucide.createIcons();

            setTimeout(() => {
                buttonEl.disabled = false;
                buttonEl.innerHTML = originalHtml;
                buttonEl.classList.remove('bg-green-600', 'border-green-600');
                buttonEl.classList.add('bg-primary', 'hover:text-primary');
                if (window.lucide) window.lucide.createIcons();
                
                // Close Lookbook Drawer and immediately open Cart Drawer in navigation
                this.closeDrawer();
                const cartTrigger = document.getElementById('navbar-cart-trigger');
                if (cartTrigger) {
                    cartTrigger.click();
                }
            }, 1000);
        }, 600);
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
    }
}
