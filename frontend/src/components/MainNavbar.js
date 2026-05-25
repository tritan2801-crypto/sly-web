/**
 * Redesigned Navbar Component
 * Header matching Image 2 (≡ MENU, underline search, center SLY®, right login label, bag with orange badge)
 * Left Drawer matching Image 1 (categories, arrows, policies list, socials footer)
 */
export default class MainNavbar {
    constructor(app) {
        this.app = app;
        this.container = document.createElement('header');
        this.container.className = 'fixed top-0 left-0 w-full z-50 bg-white text-primary border-b border-borderMuted shadow-sm transition-all duration-300 transform';
        
        // Component state
        this.isLeftMenuOpen = false;
        this.isCartOpen = false;

        // Listen for global updates
        window.addEventListener('sly-cart-updated', () => this.updateCartUI());
        window.addEventListener('sly-auth-updated', () => this.updateProfileUI());
    }

    render() {
        const cartCount = this.app.state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const user = this.app.state.user;

        this.container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-14 sm:h-16">
                    
                    <!-- LEFT: Menu Trigger & Search Box (Image 2) -->
                    <div class="flex items-center space-x-6 flex-1 justify-start">
                        <!-- Menu Hamburg Trigger -->
                        <button id="navbar-menu-trigger" class="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors py-2 focus:outline-none">
                            <i data-lucide="menu" class="w-4 h-4"></i>
                            <span class="hidden sm:inline">MENU</span>
                        </button>
                        
                        <!-- Underlined Search Box -->
                        <div class="hidden md:flex items-center border-b border-primary pb-1 space-x-2 max-w-xs">
                            <i data-lucide="search" class="w-4 h-4 text-zinc-500"></i>
                            <input type="text" id="navbar-header-search" class="bg-transparent border-none text-xs font-semibold w-36 sm:w-44 focus:outline-none focus:ring-0 text-primary" placeholder="Tìm kiếm..." />
                        </div>
                    </div>

                    <!-- CENTER: Brand Logo (Image 2) -->
                    <div class="flex-shrink-0 text-center">
                        <a href="#home" class="text-2xl sm:text-3xl font-black tracking-[0.25em] text-primary hover:text-accent transition-colors font-sans uppercase relative pr-2">
                            SLY<span class="absolute top-1 text-[10px] font-bold text-primary select-none">®</span>
                        </a>
                    </div>

                    <!-- RIGHT: User Profile & Cart Trigger (Image 2) -->
                    <div class="flex items-center space-x-6 flex-1 justify-end">
                        <!-- Login / Profile Label -->
                        <a href="#account" id="navbar-profile-btn" class="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-accent transition-colors">
                            <i data-lucide="user" class="w-4.5 h-4.5"></i>
                            <span class="hidden md:inline" id="navbar-profile-text">
                                ${user ? user.name : 'ĐĂNG NHẬP / ĐĂNG KÝ'}
                            </span>
                        </a>

                        <!-- Shopping Bag -->
                        <button id="navbar-cart-trigger" class="p-1 relative text-primary hover:text-accent transition-colors focus:outline-none" title="Giỏ hàng" data-track-cta="navbar_cart">
                            <i data-lucide="shopping-bag" class="w-5.5 h-5.5"></i>
                            <span id="cart-badge" class="absolute -bottom-1.5 -right-1.5 bg-[#F35E1A] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border border-white transition-transform ${cartCount > 0 ? 'scale-100' : 'scale-0'}">
                                ${cartCount}
                            </span>
                        </button>
                    </div>

                </div>
            </div>

            <!-- LEFT SIDE NAVIGATION DRAWER (Image 1) -->
            <div id="left-menu-overlay" class="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-300 opacity-0 pointer-events-none">
                <div id="left-menu-drawer" class="absolute left-0 top-0 h-full w-full max-w-sm bg-[#FAFAFA] text-primary flex flex-col justify-between shadow-2xl transition-transform duration-300 -translate-x-full">
                    
                    <!-- Top drawer content -->
                    <div class="p-5 sm:p-6 space-y-5 flex-grow overflow-y-auto">
                        <!-- Search container with Close Button -->
                        <div class="flex items-center justify-between border-b border-zinc-350 pb-1.5">
                            <div class="flex items-center space-x-2 flex-grow">
                                <i data-lucide="search" class="w-4 h-4 text-zinc-550"></i>
                                <input type="text" id="left-drawer-search-input" class="bg-transparent border-none text-xs font-semibold w-full focus:outline-none focus:ring-0 text-primary" placeholder="Tìm kiếm..." />
                            </div>
                            <button id="left-menu-close" class="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-zinc-550 hover:text-accent transition-colors">
                                <i data-lucide="x" class="w-3.5 h-3.5"></i>
                                <span>Đóng</span>
                            </button>
                        </div>

                        <!-- Categories List (TOPS, OUTWEARS, BOTTOMS, ACCESSORIES, BRAND MASSAGE) -->
                        <nav class="space-y-4">
                            <!-- TOPS -->
                            <div class="space-y-1.5">
                                <button class="w-full flex items-center justify-between text-left py-1 group text-sm font-extrabold uppercase tracking-wider hover:text-accent transition-colors menu-toggle-btn" data-toggle-target="sub-tops">
                                    <span>TOPS</span>
                                    <span class="arrow-icon text-accent transition-transform duration-300 rotate-90">
                                        <svg class="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </span>
                                </button>
                                <div id="sub-tops" class="subcategory-wrapper flex flex-wrap items-center gap-x-2 text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1 select-none transition-all duration-300 max-h-12 opacity-100 overflow-hidden">
                                    <a href="#shop?category_id=11" class="hover:text-accent transition-colors py-0.5">TEE</a>
                                    <span class="text-zinc-350">|</span>
                                    <a href="#shop?category_id=12" class="hover:text-accent transition-colors py-0.5">POLO</a>
                                    <span class="text-zinc-350">|</span>
                                    <a href="#shop?category_id=13" class="hover:text-accent transition-colors py-0.5">SHIRT</a>
                                    <span class="text-zinc-350">|</span>
                                    <a href="#shop?category_group=tops" class="hover:text-accent transition-colors py-0.5">ALL</a>
                                </div>
                            </div>

                            <!-- OUTWEARS -->
                            <div class="space-y-1.5">
                                <button class="w-full flex items-center justify-between text-left py-1 group text-sm font-extrabold uppercase tracking-wider hover:text-accent transition-colors menu-toggle-btn" data-toggle-target="sub-outwears">
                                    <span>OUTWEARS</span>
                                    <span class="arrow-icon text-accent transition-transform duration-300 rotate-90">
                                        <svg class="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </span>
                                </button>
                                <div id="sub-outwears" class="subcategory-wrapper flex flex-wrap items-center gap-x-2 text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1 select-none transition-all duration-300 max-h-12 opacity-100 overflow-hidden">
                                    <a href="#shop?category_id=21" class="hover:text-accent transition-colors py-0.5">HOODIE</a>
                                    <span class="text-zinc-355 text-zinc-300">|</span>
                                    <a href="#shop?category_id=22" class="hover:text-accent transition-colors py-0.5">JACKET</a>
                                    <span class="text-zinc-355 text-zinc-300">|</span>
                                    <a href="#shop?category_id=23" class="hover:text-accent transition-colors py-0.5">SWEATER</a>
                                    <span class="text-zinc-355 text-zinc-300">|</span>
                                    <a href="#shop?category_group=outwears" class="hover:text-accent transition-colors py-0.5">ALL</a>
                                </div>
                            </div>

                            <!-- BOTTOMS -->
                            <div class="space-y-1.5">
                                <button class="w-full flex items-center justify-between text-left py-1 group text-sm font-extrabold uppercase tracking-wider hover:text-accent transition-colors menu-toggle-btn" data-toggle-target="sub-bottoms">
                                    <span>BOTTOMS</span>
                                    <span class="arrow-icon text-accent transition-transform duration-300 rotate-90">
                                        <svg class="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </span>
                                </button>
                                <div id="sub-bottoms" class="subcategory-wrapper flex flex-wrap items-center gap-x-2 text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1 select-none transition-all duration-300 max-h-12 opacity-100 overflow-hidden">
                                    <a href="#shop?category_id=31" class="hover:text-accent transition-colors py-0.5">SHORT</a>
                                    <span class="text-zinc-355 text-zinc-300">|</span>
                                    <a href="#shop?category_id=32" class="hover:text-accent transition-colors py-0.5">PANT</a>
                                    <span class="text-zinc-355 text-zinc-300">|</span>
                                    <a href="#shop?category_group=bottoms" class="hover:text-accent transition-colors py-0.5">ALL</a>
                                </div>
                            </div>

                            <!-- ACCESSORIES -->
                            <div class="space-y-1.5">
                                <button class="w-full flex items-center justify-between text-left py-1 group text-sm font-extrabold uppercase tracking-wider hover:text-accent transition-colors menu-toggle-btn" data-toggle-target="sub-accessories">
                                    <span>ACCESSORIES</span>
                                    <span class="arrow-icon text-accent transition-transform duration-300 rotate-90">
                                        <svg class="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </span>
                                </button>
                                <div id="sub-accessories" class="subcategory-wrapper flex flex-wrap items-center gap-x-2 text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1 select-none transition-all duration-300 max-h-12 opacity-100 overflow-hidden">
                                    <a href="#shop?category_id=41" class="hover:text-accent transition-colors py-0.5">WALLET</a>
                                    <span class="text-zinc-355 text-zinc-300">|</span>
                                    <a href="#shop?category_id=42" class="hover:text-accent transition-colors py-0.5">CAP</a>
                                    <span class="text-zinc-355 text-zinc-300">|</span>
                                    <a href="#shop?category_id=43" class="hover:text-accent transition-colors py-0.5">BACKPACKS</a>
                                    <span class="text-zinc-355 text-zinc-300">|</span>
                                    <a href="#shop?category_group=accessories" class="hover:text-accent transition-colors py-0.5">ALL</a>
                                </div>
                            </div>
                            
                            <a href="#brand-story" id="left-drawer-brand-btn" class="block py-1 text-sm font-extrabold uppercase tracking-wider hover:text-accent transition-colors">
                                BRAND MASSAGE
                            </a>
                        </nav>

                        <!-- Policies List (WORLDWIDE SHIPPING, BẢO QUẢN SẢN PHẨM, etc.) -->
                        <div class="pt-4 border-t border-zinc-250 flex flex-col space-y-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-800">
                            <button class="text-left hover:text-accent transition-colors py-0.5 focus:outline-none" data-policy-item="shipping">WORLDWIDE SHIPPING</button>
                            <button class="text-left hover:text-accent transition-colors py-0.5 focus:outline-none" data-policy-item="care">BẢO QUẢN SẢN PHẨM</button>
                            <button class="text-left hover:text-accent transition-colors py-0.5 focus:outline-none" data-policy-item="returns">CHÍNH SÁCH ĐỔI - TRẢ HÀNG</button>
                            <button class="text-left hover:text-accent transition-colors py-0.5 focus:outline-none" data-policy-item="privacy">CHÍNH SÁCH BẢO MẬT</button>
                            <a href="#member" id="left-drawer-member-btn" class="text-left hover:text-accent transition-colors py-0.5">HỆ THỐNG THÀNH VIÊN</a>
                            <button class="text-left hover:text-accent transition-colors py-0.5 focus:outline-none" data-policy-item="stores">HỆ THỐNG CỬA HÀNG</button>
                        </div>
                    </div>

                    <!-- Footer: Socials & Copyright (Image 1) -->
                    <div class="p-4 border-t border-zinc-250 text-center space-y-3">
                        <div class="flex justify-center space-x-5 text-[10px] font-bold uppercase tracking-wider text-zinc-550">
                            <a href="https://facebook.com" target="_blank" class="hover:text-accent transition-colors">FACEBOOK</a>
                            <a href="https://shopee.vn" target="_blank" class="hover:text-accent transition-colors">SHOPEE</a>
                            <a href="https://tiktok.com" target="_blank" class="hover:text-accent transition-colors">TIKTOK</a>
                            <a href="https://instagram.com" target="_blank" class="hover:text-accent transition-colors">INSTAGRAM</a>
                        </div>
                        <p class="text-[9px] text-zinc-400 font-medium">Copyright 2026 © SLY</p>
                    </div>

                </div>
            </div>

            <!-- RIGHT SIDE CART DRAWER OVERLAY -->
            <div id="cart-drawer-overlay" class="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-300 opacity-0 pointer-events-none">
                <div id="cart-drawer" class="absolute right-0 top-0 h-full w-full max-w-md bg-white text-primary flex flex-col shadow-2xl transition-transform duration-300 translate-x-full">
                    <!-- Drawer Header -->
                    <div class="flex items-center justify-between p-6 border-b border-borderMuted">
                        <h3 class="text-xl font-bold uppercase tracking-wider flex items-center">
                            <i data-lucide="shopping-bag" class="w-5 h-5 mr-2"></i> Giỏ Hàng (${cartCount})
                        </h3>
                        <button id="cart-drawer-close" class="p-2 hover:text-accent transition-colors">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>

                    <!-- Drawer Items List -->
                    <div id="drawer-items-container" class="flex-grow overflow-y-auto p-6 space-y-6">
                        <!-- Items rendered dynamically -->
                    </div>

                    <!-- Drawer Footer -->
                    <div class="p-6 border-t border-borderMuted bg-neutralMuted space-y-4">
                        <div class="flex justify-between items-center text-sm font-medium">
                            <span>Tạm tính:</span>
                            <span id="drawer-subtotal" class="text-lg font-bold text-accent">0đ</span>
                        </div>
                        <p class="text-xs text-zinc-500">Phí vận chuyển và thuế được tính khi thanh toán.</p>
                        <div class="grid grid-cols-2 gap-3">
                            <button id="drawer-btn-cart" class="w-full py-3 bg-white text-primary border border-primary font-bold text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-colors duration-300">Xem Giỏ Hàng</button>
                            <button id="drawer-btn-checkout" class="w-full py-3 bg-primary text-white border border-primary font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-primary transition-colors duration-300" data-track-cta="drawer_checkout">Thanh Toán</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Policy info overlays -->
            <div id="policy-modal" class="fixed inset-0 bg-black/75 z-[60] backdrop-blur-sm flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
                <div class="bg-white text-primary w-full max-w-md p-6 sm:p-8 relative shadow-2xl">
                    <button id="policy-modal-close" class="absolute top-4 right-4 text-zinc-400 hover:text-accent p-2">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                    <h3 id="policy-modal-title" class="text-sm font-extrabold uppercase tracking-wider text-accent border-b border-borderMuted pb-2 mb-4">CHÍNH SÁCH</h3>
                    <div id="policy-modal-content" class="text-xs sm:text-sm text-zinc-650 leading-relaxed space-y-3 font-light">
                        <!-- Loaded dynamically -->
                    </div>
                </div>
            </div>
        `;
        
        return this.container;
    }

    mount() {
        // Move overlay/modals to document.body to prevent layout distortion from transformed parents (fixed positioning containing block bug)
        this.leftOverlay = this.container.querySelector('#left-menu-overlay');
        this.leftDrawer = this.container.querySelector('#left-menu-drawer');
        this.cartOverlay = this.container.querySelector('#cart-drawer-overlay');
        this.cartDrawer = this.container.querySelector('#cart-drawer');
        this.policyModal = this.container.querySelector('#policy-modal');

        if (this.leftOverlay) document.body.appendChild(this.leftOverlay);
        if (this.cartOverlay) document.body.appendChild(this.cartOverlay);
        if (this.policyModal) document.body.appendChild(this.policyModal);

        // --- Header Selectors ---
        const menuBtn = this.container.querySelector('#navbar-menu-trigger');
        const headerSearch = this.container.querySelector('#navbar-header-search');
        const cartTrigger = this.container.querySelector('#navbar-cart-trigger');

        // --- Left Drawer Selectors ---
        const leftClose = this.leftOverlay.querySelector('#left-menu-close');
        const leftSearch = this.leftOverlay.querySelector('#left-drawer-search-input');
        const leftDrawerBrandBtn = this.leftOverlay.querySelector('#left-drawer-brand-btn');
        const leftDrawerMemberBtn = this.leftOverlay.querySelector('#left-drawer-member-btn');

        // --- Right Drawer Selectors ---
        const cartClose = this.cartOverlay.querySelector('#cart-drawer-close');
        const btnCart = this.cartOverlay.querySelector('#drawer-btn-cart');
        const btnCheckout = this.cartOverlay.querySelector('#drawer-btn-checkout');

        // --- Policies modal Selectors ---
        const policyClose = this.policyModal.querySelector('#policy-modal-close');

        // Toggle Left Menu Drawer
        menuBtn.addEventListener('click', () => this.openLeftMenu());
        leftClose.addEventListener('click', () => this.closeLeftMenu());
        this.leftOverlay.addEventListener('click', (e) => {
            if (!this.leftDrawer.contains(e.target)) this.closeLeftMenu();
        });

        // Close left drawer when clicking page anchors inside it
        leftDrawerBrandBtn.addEventListener('click', () => this.closeLeftMenu());
        leftDrawerMemberBtn.addEventListener('click', () => this.closeLeftMenu());
        this.leftOverlay.querySelectorAll('a[href^="#shop"]').forEach(link => {
            link.addEventListener('click', () => this.closeLeftMenu());
        });

        // Header Search submit
        headerSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = headerSearch.value.trim();
                if (query) {
                    window.location.hash = `#shop?search=${encodeURIComponent(query)}`;
                    headerSearch.value = '';
                }
            }
        });

        // Left Drawer Search submit
        leftSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = leftSearch.value.trim();
                if (query) {
                    this.closeLeftMenu();
                    window.location.hash = `#shop?search=${encodeURIComponent(query)}`;
                    leftSearch.value = '';
                }
            }
        });

        // Left Drawer Categories group accordion toggle click
        this.leftOverlay.querySelectorAll('.menu-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetId = btn.getAttribute('data-toggle-target');
                const targetEl = this.leftOverlay.querySelector(`#${targetId}`);
                const arrowEl = btn.querySelector('.arrow-icon');
                
                if (targetEl.classList.contains('max-h-0')) {
                    // Expand
                    targetEl.classList.remove('max-h-0', 'opacity-0', 'pointer-events-none');
                    targetEl.classList.add('max-h-12', 'opacity-100', 'pointer-events-auto');
                    if (arrowEl) {
                        arrowEl.classList.add('rotate-90');
                        arrowEl.classList.remove('rotate-0');
                    }
                } else {
                    // Collapse
                    targetEl.classList.remove('max-h-12', 'opacity-100', 'pointer-events-auto');
                    targetEl.classList.add('max-h-0', 'opacity-0', 'pointer-events-none');
                    if (arrowEl) {
                        arrowEl.classList.add('rotate-0');
                        arrowEl.classList.remove('rotate-90');
                    }
                }
            });
        });

        // Toggle Right Cart Drawer
        cartTrigger.addEventListener('click', () => this.openCartDrawer());
        cartClose.addEventListener('click', () => this.closeCartDrawer());
        this.cartOverlay.addEventListener('click', (e) => {
            if (!this.cartDrawer.contains(e.target)) this.closeCartDrawer();
        });

        // Redirects
        btnCart.addEventListener('click', () => {
            this.closeCartDrawer();
            window.location.hash = '#cart';
        });
        btnCheckout.addEventListener('click', () => {
            this.closeCartDrawer();
            window.location.hash = '#cart?checkout=true';
        });

        // Policies click handlers
        this.leftOverlay.querySelectorAll('[data-policy-item]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.getAttribute('data-policy-item');
                this.showPolicy(type);
            });
        });

        policyClose.addEventListener('click', () => {
            this.policyModal.classList.remove('opacity-100', 'pointer-events-auto');
            this.policyModal.classList.add('opacity-0', 'pointer-events-none');
        });
        
        this.policyModal.addEventListener('click', (e) => {
            const modalBox = this.policyModal.querySelector('.bg-white');
            if (modalBox && !modalBox.contains(e.target)) {
                this.policyModal.classList.remove('opacity-100', 'pointer-events-auto');
                this.policyModal.classList.add('opacity-0', 'pointer-events-none');
            }
        });

        // Smart Sticky Header (Reveal on scroll up, hide on scroll down, transparent at top of Home)
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isHome = window.location.hash.split('?')[0] === '#home' || window.location.hash === '';
            
            // 1. Transparent theme toggle
            if (currentScrollY === 0 && isHome) {
                this.container.classList.add('header-transparent-theme');
            } else {
                this.container.classList.remove('header-transparent-theme');
            }
            
            // 2. Scroll direction toggle (Hide/Show)
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                // Scrolling down - Hide header
                this.container.classList.add('-translate-y-full');
            } else {
                // Scrolling up - Show header
                this.container.classList.remove('-translate-y-full');
            }
            
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        window.addEventListener('hashchange', handleScroll);

        // Listen to global open policy requests
        window.addEventListener('sly-open-policy', (e) => {
            this.showPolicy(e.detail.type);
        });

        this.updateCartUI();
    }

    openLeftMenu() {
        this.isLeftMenuOpen = true;
        this.leftOverlay.classList.remove('opacity-0', 'pointer-events-none');
        this.leftOverlay.classList.add('opacity-100', 'pointer-events-auto');
        
        this.leftDrawer.classList.remove('-translate-x-full');
        this.leftDrawer.classList.add('translate-x-0');
    }

    closeLeftMenu() {
        this.isLeftMenuOpen = false;
        this.leftOverlay.classList.remove('opacity-100', 'pointer-events-auto');
        this.leftOverlay.classList.add('opacity-0', 'pointer-events-none');
        
        this.leftDrawer.classList.remove('translate-x-0');
        this.leftDrawer.classList.add('-translate-x-full');
    }

    openCartDrawer() {
        this.isCartOpen = true;
        this.cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
        this.cartOverlay.classList.add('opacity-100', 'pointer-events-auto');
        
        this.cartDrawer.classList.remove('translate-x-full');
        this.cartDrawer.classList.add('translate-x-0');

        this.updateCartUI();
    }

    closeCartDrawer() {
        this.isCartOpen = false;
        this.cartOverlay.classList.remove('opacity-100', 'pointer-events-auto');
        this.cartOverlay.classList.add('opacity-0', 'pointer-events-none');
        
        this.cartDrawer.classList.remove('translate-x-0');
        this.cartDrawer.classList.add('translate-x-full');
    }

    updateProfileUI() {
        const user = this.app.state.user;
        const profileText = this.container.querySelector('#navbar-profile-text');
        if (profileText) {
            profileText.innerText = user ? user.name : 'ĐĂNG NHẬP / ĐĂNG KÝ';
        }
    }

    showPolicy(type) {
        const titleEl = this.policyModal.querySelector('#policy-modal-title');
        const contentEl = this.policyModal.querySelector('#policy-modal-content');

        const policies = {
            shipping: {
                title: 'WORLDWIDE SHIPPING (VẬN CHUYỂN TOÀN CẦU)',
                content: `
                    <p>SLY cung cấp dịch vụ giao hàng toàn quốc và quốc tế với tiêu chuẩn tối ưu:</p>
                    <p><strong>• Nội thành TP.HCM:</strong> Giao nhanh trong 24h. Đơn hàng hỏa tốc nhận trong 2h.</p>
                    <p><strong>• Ngoại thành & Tỉnh thành khác:</strong> Giao hàng qua GHN/GHTK trong 2 - 3 ngày làm việc.</p>
                    <p><strong>• Quốc tế:</strong> Vận chuyển qua DHL/FedEx tùy khu vực trong 7 - 14 ngày.</p>
                    <p><strong>• Ưu đãi:</strong> Miễn phí giao hàng toàn quốc cho mọi hóa đơn trị giá từ 500.000đ.</p>
                `
            },
            care: {
                title: 'BẢO QUẢN SẢN PHẨM STREETWEAR',
                content: `
                    <p>Để duy trì phom dáng của chất vải thun định lượng cao 250gsm - 350gsm và giữ hình in decal bền bỉ:</p>
                    <p><strong>1. Giặt đúng cách:</strong> Khuyến khích giặt tay hoặc lộn ngược mặt trong áo phơi giặt máy bằng túi giặt ở nhiệt độ thường.</p>
                    <p><strong>2. Phơi khô:</strong> Tránh phơi trực tiếp dưới ánh nắng gắt để giữ màu nguyên bản tốt nhất.</p>
                    <p><strong>3. Là ủi:</strong> Tuyệt đối không ủi trực tiếp lên các chi tiết hình in. Khuyến khích là hơi nước nhẹ.</p>
                `
            },
            returns: {
                title: 'CHÍNH SÁCH ĐỔI - TRẢ HÀNG 7 NGÀY',
                content: `
                    <p>SLY áp dụng chính sách đổi trả linh hoạt hỗ trợ tối đa cho khách hàng:</p>
                    <p>• Hỗ trợ đổi trả trong vòng <strong>7 ngày</strong> kể từ khi đơn hàng được xác nhận nhận thành công.</p>
                    <p>• Chấp nhận đổi sản phẩm do lỗi sản xuất, nhầm size, phom dáng hoặc đổi sang sản phẩm khác bằng/hơn giá trị.</p>
                    <p>• Sản phẩm gửi về phải còn nguyên nhãn mác, chưa qua giặt là hoặc sử dụng.</p>
                `
            },
            privacy: {
                title: 'CHÍNH SÁCH BẢO MẬT THÔNG TIN',
                content: `
                    <p>SLY cam kết tôn trọng bảo mật thông tin cá nhân khách hàng tuyệt đối:</p>
                    <p>• Dữ liệu email, số điện thoại, và lịch sử đơn hàng chỉ phục vụ mục đích vận chuyển, tích lũy điểm Loyalty và chăm sóc khách hàng.</p>
                    <p>• Hệ thống bảo mật mã hóa SSL ngăn chặn rò rỉ dữ liệu thông tin giao dịch.</p>
                    <p>• SLY cam kết không chuyển giao, bán hoặc chia sẻ thông tin khách hàng cho bên thứ ba vì bất kỳ mục đích nào.</p>
                `
            },
            stores: {
                title: 'HỆ THỐNG CỬA HÀNG SLY CLOTHING',
                content: `
                    <p>Chào đón các bạn ghé thăm để trực tiếp trải nghiệm chất lượng vải và phom dáng:</p>
                    <p><strong>• Chi nhánh 1:</strong> 123 Nguyễn Trãi, Phường 2, Quận 5, TP. Hồ Chí Minh.</p>
                    <p><strong>• Chi nhánh 2:</strong> 456 Lê Văn Sỹ, Phường 14, Quận 3, TP. Hồ Chí Minh.</p>
                    <p>• Thời gian mở cửa: 9:00 AM - 10:00 PM hằng ngày.</p>
                `
            }
        };

        const policy = policies[type];
        if (policy) {
            titleEl.innerText = policy.title;
            contentEl.innerHTML = policy.content;
            
            this.policyModal.classList.remove('opacity-0', 'pointer-events-none');
            this.policyModal.classList.add('opacity-100', 'pointer-events-auto');
        }
    }

    updateCartUI() {
        const cart = this.app.state.cart;
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Update Badge
        const badge = this.container.querySelector('#cart-badge');
        if (badge) {
            badge.innerText = cartCount;
            if (cartCount > 0) {
                badge.classList.remove('scale-0');
                badge.classList.add('scale-100');
            } else {
                badge.classList.remove('scale-100');
                badge.classList.add('scale-0');
            }
        }

        // Update items lists inside drawer
        const itemsContainer = this.cartDrawer ? this.cartDrawer.querySelector('#drawer-items-container') : null;
        const subtotalEl = this.cartDrawer ? this.cartDrawer.querySelector('#drawer-subtotal') : null;
        if (!itemsContainer) return;

        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64 text-zinc-400 space-y-4">
                    <i data-lucide="shopping-bag" class="w-12 h-12 text-zinc-350"></i>
                    <p class="text-sm font-semibold uppercase tracking-wider">Giỏ hàng trống</p>
                    <a href="#shop" class="px-6 py-2 bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-accent transition-colors">Mua ngay</a>
                </div>
            `;
            if (subtotalEl) subtotalEl.innerText = '0đ';
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        let subtotal = 0;
        let itemsHtml = '';

        cart.forEach((item, index) => {
            const itemPrice = item.sale_price ? parseFloat(item.sale_price) : parseFloat(item.price);
            const total = itemPrice * item.quantity;
            subtotal += total;

            itemsHtml += `
                <div class="flex items-start space-x-4 border-b border-borderMuted pb-4">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-20 object-cover border border-borderMuted flex-shrink-0 bg-neutralMuted" />
                    <div class="flex-grow min-w-0">
                        <h4 class="text-sm font-bold uppercase tracking-wider">${item.name}</h4>
                        <p class="text-xs text-zinc-500 mt-1">Size: ${item.size} | Color: ${item.color || 'Default'}</p>
                        <div class="flex items-center justify-between mt-3">
                            <!-- Quantity selector -->
                            <div class="flex items-center border border-borderMuted">
                                <button class="px-2 py-0.5 hover:bg-neutralMuted text-xs font-bold btn-qty-dec" data-index="${index}">-</button>
                                <span class="px-3 py-0.5 text-xs font-medium">${item.quantity}</span>
                                <button class="px-2 py-0.5 hover:bg-neutralMuted text-xs font-bold btn-qty-inc" data-index="${index}">+</button>
                            </div>
                            <!-- Price -->
                            <span class="text-sm font-bold text-accent">${this.formatCurrency(itemPrice)}</span>
                        </div>
                    </div>
                    <button class="text-zinc-400 hover:text-accent p-1 btn-item-remove" data-index="${index}">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
        });

        itemsContainer.innerHTML = itemsHtml;
        if (subtotalEl) subtotalEl.innerText = this.formatCurrency(subtotal);

        // Bind Quantity adjustment and remove buttons
        itemsContainer.querySelectorAll('.btn-qty-dec').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity--;
                    this.app.saveCart();
                }
            });
        });

        itemsContainer.querySelectorAll('.btn-qty-inc').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                cart[idx].quantity++;
                this.app.saveCart();
            });
        });

        itemsContainer.querySelectorAll('.btn-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                cart.splice(idx, 1);
                this.app.saveCart();
            });
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
    }
}
