/**
 * Page Component: Minimalist Luxury Product Detail Page (Inspired by Zara, COS, and Fear of God)
 * Hash Route: #product?id=X
 */
import Button from '../../components/ui/button.js';

export default class ProductDetailPage {
    constructor(app) {
        this.app = app;
        this.container = document.createElement('div');
        this.container.className = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16 pb-24 md:pb-16';
        
        // State
        this.product = null;
        this.relatedProducts = [];
        this.outfitSuggestions = [];
        this.selectedSize = '';
        this.selectedVariant = null;
        this.quantity = 1;
        this.activeImageIdx = 0;
        
        // Modal states
        this.isLightboxOpen = false;
        
        this.productId = this.getParamsId();
    }

    getParamsId() {
        const hash = window.location.hash;
        if (!hash.includes('?')) return null;
        const queryStr = hash.split('?')[1];
        const pairs = queryStr.split('&');
        let id = null;
        pairs.forEach(pair => {
            const [key, val] = pair.split('=');
            if (key === 'id') id = parseInt(val);
        });
        return id;
    }

    async fetchDetails() {
        if (!this.productId) return;
        
        try {
            // 1. Fetch current product detail
            const res = await fetch(`/api/products/detail?id=${this.productId}`);
            const data = await res.json();
            if (data.success) {
                this.product = data.data;
                // Set default first available variant/size
                const availableVariant = this.product.variants.find(v => v.stock > 0);
                if (availableVariant) {
                    this.selectedSize = availableVariant.size;
                    this.selectedVariant = availableVariant;
                }
                
                // 2. Fetch related products of the same category
                const relRes = await fetch(`/api/products?category_id=${this.product.category_id}`);
                const relData = await relRes.json();
                if (relData.success) {
                    // Filter out current product, limit to 4 items
                    this.relatedProducts = relData.data
                        .filter(p => p.id !== this.product.id)
                        .slice(0, 4);
                }
                
                // 3. Fetch outfit suggestion products (excluding items sharing the current product's parent category group)
                const allRes = await fetch('/api/products');
                const allData = await allRes.json();
                if (allData.success) {
                    // Determine the forbidden category IDs based on current product's parent category
                    let forbiddenCatIds = [];
                    const currentCat = parseInt(this.product.category_id);
                    
                    if ([11, 12, 13, 21, 22, 23].includes(currentCat)) {
                        // Current product is an upper-body item (Tops/Outwears). Filter out all Tops/Outwears.
                        forbiddenCatIds = [11, 12, 13, 21, 22, 23];
                    } else if ([31, 32].includes(currentCat)) {
                        // Current product is a Bottoms item. Filter out all Bottoms.
                        forbiddenCatIds = [31, 32];
                    } else if ([41, 42, 43].includes(currentCat)) {
                        // Current product is an Accessories item. Filter out all Accessories.
                        forbiddenCatIds = [41, 42, 43];
                    }

                    // Filter products belonging to other parent category groups
                    const otherCatsProducts = allData.data.filter(p => !forbiddenCatIds.includes(parseInt(p.category_id)));
                    
                    // Group by category_id to select diverse items
                    const grouped = {};
                    otherCatsProducts.forEach(p => {
                        if (!grouped[p.category_id]) {
                            grouped[p.category_id] = [];
                        }
                        grouped[p.category_id].push(p);
                    });
                    
                    // Select up to 4 diverse products round-robin
                    const suggested = [];
                    const catIds = Object.keys(grouped);
                    
                    for (let i = 0; i < 4; i++) {
                        if (catIds.length === 0) break;
                        const catIdIdx = i % catIds.length;
                        const catId = catIds[catIdIdx];
                        const list = grouped[catId];
                        if (list && list.length > 0) {
                            suggested.push(list.shift());
                        } else {
                            catIds.splice(catIdIdx, 1);
                            i--; // Retry this index
                        }
                    }
                    this.outfitSuggestions = suggested.slice(0, 4);
                }
            }
        } catch (e) {
            console.error('Error fetching product details:', e);
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-32 text-zinc-400 space-y-4">
                <div class="spinner"></div>
                <p class="text-[10px] font-bold uppercase tracking-widest">Đang tải thông tin sản phẩm...</p>
            </div>
        `;
        
        this.fetchDetails().then(() => {
            if (!this.product) {
                this.container.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-32 text-center space-y-4">
                        <i data-lucide="alert-circle" class="w-12 h-12 text-accent"></i>
                        <h2 class="text-lg font-bold uppercase tracking-wider">Không tìm thấy sản phẩm</h2>
                        <p class="text-xs text-zinc-400 max-w-xs">Sản phẩm có thể đã ngừng kinh doanh hoặc đường dẫn không chính xác.</p>
                        <a href="#shop" class="px-8 py-3 bg-primary text-white border border-primary text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-all">Quay lại cửa hàng</a>
                    </div>
                `;
                if (window.lucide) window.lucide.createIcons();
                return;
            }
            this.renderPageContent();
        });

        return this.container;
    }

    mount() {
        // Router compatibility. Real binding happens dynamically after details fetch.
    }

    renderPageContent() {
        const primaryImg = this.product.images.find(img => img.is_hover_alternate === 0)?.image_url 
                           || this.product.images[0]?.image_url;
        const activeImgUrl = this.product.images[this.activeImageIdx]?.image_url || primaryImg;
        
        const isDiscounted = this.product.is_sale && this.product.sale_price;
        const originalPrice = parseFloat(this.product.price);
        const salePrice = isDiscounted ? parseFloat(this.product.sale_price) : null;
        
        // Badges
        let badgeHtml = '';
        if (this.product.is_new) {
            badgeHtml += `<span class="bg-black text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider">New</span>`;
        }
        if (isDiscounted) {
            const discPct = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
            badgeHtml += `<span class="bg-accent text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider">- ${discPct}%</span>`;
        }

        // Custom details accordion blocks
        const detailsManifesto = [
            {
                id: 'tab-material',
                title: 'CHẤT LIỆU / MATERIAL',
                content: `Được sản xuất từ vải 100% Premium Cotton dệt kim dày dặn định lượng 250gsm (cho áo thun) / 400gsm bông xốp mịn (cho hoodie). Sợi vải trải qua công đoạn chải kỹ giúp bề mặt cực êm ái, co giãn tự nhiên và hạn chế xơ lông khi giặt.`
            },
            {
                id: 'tab-fit',
                title: 'PHOM DÁNG / FIT & COMFORT',
                content: `Thiết kế phom dáng rộng (Oversized Boxy Fit) tối giản, vai trễ phóng khoáng chuẩn phong cách Streetwear đương đại. Bo cổ dày dặn 2.5cm dệt sườn đôi giúp ôm gọn phom dáng và không bị nhão sau thời gian dài sử dụng.`
            },
            {
                id: 'tab-construction',
                title: 'CHI TIẾT THIẾT KẾ / DETAILS',
                content: `Đường may móc xích đôi vai gia cố độ bền tuyệt đối. Hoạ tiết thêu nổi Typography mật độ chỉ cao sắc nét, hoặc công nghệ in chuyển nhiệt phản quang cao cấp chống bong tróc hay rạn nứt hình vẽ.`
            },
            {
                id: 'tab-care',
                title: 'HƯỚNG DẪN BẢO QUẢN / CARE GUIDE',
                content: `Khuyến khích giặt tay hoặc giặt máy chế độ nhẹ bằng túi giặt ở nhiệt độ thường. Lộn trái áo khi giặt và tránh dùng chất tẩy mạnh. Không là/ủi trực tiếp lên bề mặt hình in/thêu.`
            }
        ];

        this.container.innerHTML = `
            <!-- Page Breadcrumb -->
            <nav class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 select-none pb-2 border-b border-borderMuted/60">
                <a href="#home" class="hover:text-primary transition-colors">TRANG CHỦ</a>
                <span class="mx-2 text-zinc-300">/</span>
                <a href="#shop" class="hover:text-primary transition-colors">CỬA HÀNG</a>
                <span class="mx-2 text-zinc-300">/</span>
                <span class="text-zinc-650">${this.product.category_name}</span>
                <span class="mx-2 text-zinc-300">/</span>
                <span class="text-primary font-black">${this.product.name}</span>
            </nav>

            <!-- Main Product Area (2-Column Grid) -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                <!-- LEFT COLUMN: Product Images Gallery (55% / 7 cols) -->
                <div class="md:col-span-7 space-y-4">
                    <!-- Featured Image Container -->
                    <div class="zoom-image-container relative aspect-[3/4] w-full overflow-hidden bg-zinc-50 border border-borderMuted select-none cursor-zoom-in group">
                        
                        <!-- Badges -->
                        <div class="absolute top-4 left-4 z-10 flex flex-col space-y-1.5">
                            ${badgeHtml}
                        </div>

                        <!-- Zoom CTA Button overlay -->
                        <button id="gallery-zoom-btn" class="absolute bottom-4 right-4 z-10 bg-white/90 text-primary hover:bg-primary hover:text-white p-2.5 shadow-lg backdrop-blur-sm border border-borderMuted/40 transition-colors focus:outline-none">
                            <i data-lucide="maximize-2" class="w-4 h-4"></i>
                        </button>

                        <img src="${activeImgUrl}" class="zoom-image absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out" alt="${this.product.name}" />
                    </div>

                    <!-- Alternate thumbnail lists -->
                    <div class="flex items-center space-x-3 overflow-x-auto pb-2 select-none scrollbar-none">
                        ${this.product.images.map((img, idx) => `
                            <button class="w-20 h-24 border-2 transition-all flex-shrink-0 bg-zinc-50 overflow-hidden ${idx === this.activeImageIdx ? 'border-primary ring-2 ring-zinc-100' : 'border-borderMuted hover:border-zinc-400'}" data-thumb-idx="${idx}">
                                <img src="${img.image_url}" class="w-full h-full object-cover" />
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- RIGHT COLUMN: Product Information Details (45% / 5 cols) -->
                <div class="md:col-span-5 space-y-8">
                    <!-- Title & Category -->
                    <div class="space-y-2">
                        <span class="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest">${this.product.category_name}</span>
                        <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-wider text-primary leading-tight">${this.product.name}</h1>
                    </div>

                    <!-- Price Section -->
                    <div class="pb-5 border-b border-borderMuted/60">
                        ${isDiscounted ? `
                            <div class="flex items-baseline space-x-3.5">
                                <span class="text-2xl font-black text-accent">${this.formatCurrency(salePrice)}</span>
                                <span class="text-sm font-bold text-zinc-400 line-through">${this.formatCurrency(originalPrice)}</span>
                            </div>
                        ` : `
                            <span class="text-2xl font-black text-primary">${this.formatCurrency(originalPrice)}</span>
                        `}
                    </div>

                    <!-- Short Description -->
                    <p class="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
                        ${this.product.description || 'Chưa có thông tin mô tả chi tiết cho sản phẩm này.'}
                    </p>

                    <!-- Custom Variant/Size Selector dropdown/list -->
                    <div class="space-y-3.5">
                        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-primary">
                            <span>CHỌN KÍCH CỠ / SELECT SIZE:</span>
                            <span id="detail-stock-indicator" class="text-[10px] text-zinc-500 font-semibold lowercase">
                                ${this.selectedVariant ? `còn lại ${this.selectedVariant.stock} sản phẩm` : 'hết hàng'}
                            </span>
                        </div>
                        <div class="flex flex-wrap gap-2.5">
                            ${this.product.variants.map(v => {
                                const outOfStock = v.stock === 0;
                                const isSelected = this.selectedSize === v.size;
                                return `
                                    <button class="size-select-box px-5 py-2.5 text-xs font-bold border transition-all duration-300 ${outOfStock ? 'bg-zinc-50 text-zinc-350 border-zinc-200 cursor-not-allowed line-through' : (isSelected ? 'bg-black text-white border-black font-extrabold shadow-sm' : 'bg-white text-zinc-700 border-borderMuted hover:border-black hover:scale-102')}" 
                                        data-size-btn="${v.size}" ${outOfStock ? 'disabled' : ''}>
                                        ${v.size}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                        
                        <!-- Size Guide link -->
                        <button id="size-guide-trigger" class="text-[10px] font-bold text-zinc-500 hover:text-accent tracking-widest uppercase flex items-center transition-colors focus:outline-none">
                            <i data-lucide="help-circle" class="w-3.5 h-3.5 mr-1.5"></i> BẢNG HƯỚNG DẪN CHỌN SIZE
                        </button>
                    </div>

                    <!-- Quantity Selector & Add to Cart -->
                    <div class="space-y-4 pt-4 border-t border-borderMuted/60">
                        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                            
                            <!-- Quantity adjustment stepper -->
                            <div class="flex items-center border border-borderMuted w-32 bg-white select-none">
                                <button id="detail-qty-dec" class="w-10 py-3 hover:bg-zinc-50 font-extrabold text-sm transition-colors focus:outline-none">-</button>
                                <input type="text" id="detail-qty-val" class="w-12 text-center text-xs font-bold border-0 focus:outline-none focus:ring-0" value="${this.quantity}" readonly />
                                <button id="detail-qty-inc" class="w-10 py-3 hover:bg-zinc-50 font-extrabold text-sm transition-colors focus:outline-none">+</button>
                            </div>

                            <!-- Beige Luxury Add to Cart CTA (Step 10) -->
                            <div class="flex-grow">
                                ${this.selectedVariant ? `
                                    <button id="detail-btn-add-cart" class="w-full py-3.5 bg-[#D89A73] hover:bg-[#c5855e] text-white border border-[#D89A73] hover:border-[#c5855e] font-extrabold text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2.5 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none" data-track-cta="detail_add_cart">
                                        <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                                        <span>THÊM VÀO GIỎ HÀNG</span>
                                    </button>
                                ` : `
                                    <button class="w-full py-3.5 bg-zinc-300 text-zinc-500 border border-zinc-300 font-extrabold text-xs uppercase tracking-widest cursor-not-allowed flex items-center justify-center space-x-2" disabled>
                                        <i data-lucide="slash" class="w-4 h-4"></i>
                                        <span>HẾT HÀNG / SOLD OUT</span>
                                    </button>
                                `}
                            </div>

                        </div>
                    </div>

                    <!-- Shipping & Warranty Policies (Step 11) -->
                    <div class="bg-zinc-50 p-4 border border-borderMuted/80 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-center space-y-2 select-none">
                        <p class="flex items-center justify-center">
                            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5 mr-2 text-accent"></i> Đổi trả miễn phí trong vòng 7 ngày
                        </p>
                        <p class="flex items-center justify-center">
                            <i data-lucide="truck" class="w-3.5 h-3.5 mr-2 text-accent"></i> MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN TRÊN 800K
                        </p>
                    </div>

                    <!-- Details Accordions (Step 7) -->
                    <div class="border-t border-borderMuted/60 divide-y divide-borderMuted/60 pt-4">
                        ${detailsManifesto.map(tab => `
                            <div class="py-3">
                                <button class="w-full flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-primary py-1.5 focus:outline-none detail-manifesto-header" data-tab-header="${tab.id}">
                                    <span>${tab.title}</span>
                                    <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-zinc-400 transform transition-transform duration-300 tab-chevron"></i>
                                </button>
                                <div id="${tab.id}" class="max-h-0 opacity-0 overflow-hidden transition-all duration-300 mt-2 text-xs text-zinc-500 leading-relaxed font-light">
                                    <p>${tab.content}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                </div>

            </div>

            <!-- RELATED PRODUCTS SECTION (Step 12) -->
            ${this.relatedProducts.length > 0 ? `
                <div class="border-t border-borderMuted/60 pt-16 space-y-10">
                    <div class="text-center sm:text-left">
                        <span class="text-zinc-400 text-xs font-bold tracking-widest uppercase">CÙNG DANH MỤC</span>
                        <h2 class="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase mt-1">SẢN PHẨM LIÊN QUAN</h2>
                    </div>

                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        ${this.relatedProducts.map(rel => {
                            const relPrice = parseFloat(rel.price);
                            const relSale = rel.is_sale && rel.sale_price ? parseFloat(rel.sale_price) : null;
                            const relImg = rel.images.find(img => img.is_hover_alternate === 0)?.image_url 
                                           || (rel.images[0] ? rel.images[0].image_url : '');
                            const relAltImg = rel.images.find(img => img.is_hover_alternate === 1)?.image_url 
                                              || relImg;
                            
                            return `
                                <div class="group flex flex-col cursor-pointer" onclick="window.location.hash='#product?id=${rel.id}'">
                                    <div class="relative aspect-[3/4] overflow-hidden bg-zinc-50 border border-borderMuted select-none">
                                        ${rel.is_sale ? `
                                            <div class="absolute top-2 left-2 z-10">
                                                <span class="bg-accent text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">Sale</span>
                                            </div>
                                        ` : ''}
                                        <div class="absolute inset-0 w-full h-full">
                                            <img src="${relImg}" alt="${rel.name}" 
                                                class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
                                            <img src="${relAltImg}" alt="${rel.name} Alternate" 
                                                class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                        </div>
                                    </div>
                                    <div class="mt-4 flex flex-col items-start space-y-1">
                                        <span class="text-[9px] text-zinc-400 uppercase tracking-widest font-semibold">${rel.category_name}</span>
                                        <h4 class="text-xs font-bold uppercase tracking-wider text-primary group-hover:text-accent transition-colors">${rel.name}</h4>
                                        <div class="flex items-center space-x-2 pt-0.5">
                                            ${relSale ? `
                                                <span class="text-xs font-black text-accent">${this.formatCurrency(relSale)}</span>
                                                <span class="text-[10px] text-zinc-400 line-through">${this.formatCurrency(relPrice)}</span>
                                            ` : `
                                                <span class="text-xs font-black text-primary">${this.formatCurrency(relPrice)}</span>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- OUTFIT SUGGESTION SECTION -->
            ${this.outfitSuggestions.length > 0 ? `
                <div class="border-t border-borderMuted/60 pt-16 space-y-10">
                    <div class="text-center sm:text-left">
                        <span class="text-accent text-xs font-bold tracking-widest uppercase">HOÀN THIỆN PHONG CÁCH</span>
                        <h2 class="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase mt-1">GỢI Ý PHỐI ĐỒ</h2>
                    </div>

                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        ${this.outfitSuggestions.map(sug => {
                            const sugPrice = parseFloat(sug.price);
                            const sugSale = sug.is_sale && sug.sale_price ? parseFloat(sug.sale_price) : null;
                            const sugImg = sug.images.find(img => img.is_hover_alternate === 0)?.image_url 
                                           || (sug.images[0] ? sug.images[0].image_url : '');
                            const sugAltImg = sug.images.find(img => img.is_hover_alternate === 1)?.image_url 
                                              || sugImg;
                            
                            return `
                                <div class="group flex flex-col cursor-pointer" onclick="window.location.hash='#product?id=${sug.id}'">
                                    <div class="relative aspect-[3/4] overflow-hidden bg-zinc-50 border border-borderMuted select-none">
                                        ${sug.is_sale ? `
                                            <div class="absolute top-2 left-2 z-10">
                                                <span class="bg-accent text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">Sale</span>
                                            </div>
                                        ` : ''}
                                        <div class="absolute inset-0 w-full h-full">
                                            <img src="${sugImg}" alt="${sug.name}" 
                                                class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
                                            <img src="${sugAltImg}" alt="${sug.name} Alternate" 
                                                class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                        </div>
                                    </div>
                                    <div class="mt-4 flex flex-col items-start space-y-1">
                                        <span class="text-[9px] text-zinc-400 uppercase tracking-widest font-semibold">${sug.category_name}</span>
                                        <h4 class="text-xs font-bold uppercase tracking-wider text-primary group-hover:text-accent transition-colors">${sug.name}</h4>
                                        <div class="flex items-center space-x-2 pt-0.5">
                                            ${sugSale ? `
                                                <span class="text-xs font-black text-accent">${this.formatCurrency(sugSale)}</span>
                                                <span class="text-[10px] text-zinc-400 line-through">${this.formatCurrency(sugPrice)}</span>
                                            ` : `
                                                <span class="text-xs font-black text-primary">${this.formatCurrency(sugPrice)}</span>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- FULL SCREEN LIGHTBOX MODAL OVERLAY (Step 6) -->
            <div id="gallery-lightbox-overlay" class="fixed inset-0 bg-black/95 z-[70] flex flex-col items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
                <button id="lightbox-close-btn" class="absolute top-6 right-6 text-white/75 hover:text-white p-2.5 z-[80] focus:outline-none">
                    <i data-lucide="x" class="w-8 h-8"></i>
                </button>
                
                <!-- Main Zoomed image -->
                <div class="max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center relative select-none">
                    <img src="${activeImgUrl}" id="lightbox-main-img" class="max-w-full max-h-full object-contain" />
                </div>

                <!-- Small Thumbnails list -->
                <div class="flex items-center space-x-2.5 mt-6 max-w-full overflow-x-auto pb-1 select-none">
                    ${this.product.images.map((img, idx) => `
                        <button class="w-12 h-16 border-2 transition-all flex-shrink-0 ${idx === this.activeImageIdx ? 'border-white' : 'border-zinc-700 opacity-60 hover:opacity-100'}" data-lightbox-thumb-idx="${idx}">
                            <img src="${img.image_url}" class="w-full h-full object-cover" />
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- ACCORDION SIZE GUIDE OVERLAY MODAL (Step 8) -->
            <div id="size-guide-modal" class="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
                <div class="bg-white text-primary w-full max-w-lg p-6 sm:p-8 relative shadow-2xl space-y-4">
                    <button id="size-guide-close" class="absolute top-4 right-4 text-zinc-400 hover:text-accent p-2">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                    <h3 class="text-sm font-black uppercase tracking-wider text-primary border-b border-primary pb-2 flex items-center">
                        <i data-lucide="info" class="w-4 h-4 mr-2 text-[#D89A73]"></i> BẢNG SIZE HƯỚNG DẪN (SIZE GUIDE)
                    </h3>
                    
                    <div class="overflow-x-auto text-[11px] font-medium pt-2 select-none">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-zinc-100 text-zinc-700 uppercase font-bold border-b border-zinc-200">
                                    <th class="p-2.5 border border-zinc-200">Size</th>
                                    <th class="p-2.5 border border-zinc-200">Chiều cao (cm)</th>
                                    <th class="p-2.5 border border-zinc-200">Cân nặng (kg)</th>
                                    <th class="p-2.5 border border-zinc-200">Chiều dài áo (cm)</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-zinc-200 text-zinc-650 font-light">
                                <tr>
                                    <td class="p-2.5 border border-zinc-200 font-bold text-primary">S</td>
                                    <td class="p-2.5 border border-zinc-200">150 - 165</td>
                                    <td class="p-2.5 border border-zinc-200">45 - 58</td>
                                    <td class="p-2.5 border border-zinc-200">70</td>
                                </tr>
                                <tr>
                                    <td class="p-2.5 border border-zinc-200 font-bold text-primary">M</td>
                                    <td class="p-2.5 border border-zinc-200">165 - 172</td>
                                    <td class="p-2.5 border border-zinc-200">58 - 68</td>
                                    <td class="p-2.5 border border-zinc-200">72</td>
                                </tr>
                                <tr>
                                    <td class="p-2.5 border border-zinc-200 font-bold text-primary">L</td>
                                    <td class="p-2.5 border border-zinc-200">172 - 180</td>
                                    <td class="p-2.5 border border-zinc-200">68 - 80</td>
                                    <td class="p-2.5 border border-zinc-200">74</td>
                                </tr>
                                <tr>
                                    <td class="p-2.5 border border-zinc-200 font-bold text-primary">XL</td>
                                    <td class="p-2.5 border border-zinc-200">178 - 188</td>
                                    <td class="p-2.5 border border-zinc-200">80 - 95</td>
                                    <td class="p-2.5 border border-zinc-200">76</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-[9px] text-zinc-400 italic mt-2">Lưu ý: Bảng size mang tính chất tham khảo, phom dáng streetwear oversized có thể xê dịch tùy ý muốn mặc rộng của quý khách.</p>
                </div>
            </div>

            <!-- MOBILE STICKY BOTTOM CHECKOUT BUY BAR (Step 14) -->
            <div class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-borderMuted/80 p-3 flex md:hidden items-center justify-between shadow-2xl select-none">
                <div class="flex items-center space-x-2.5 min-w-0">
                    <img src="${primaryImg}" class="w-10 h-12 object-cover border border-borderMuted flex-shrink-0" />
                    <div class="min-w-0">
                        <h4 class="text-[11px] font-bold uppercase tracking-wider text-primary truncate leading-tight">${this.product.name}</h4>
                        <p class="text-[10px] text-accent font-black mt-0.5">
                            ${isDiscounted ? this.formatCurrency(salePrice) : this.formatCurrency(originalPrice)}
                        </p>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    ${this.selectedVariant ? `
                        <button id="mobile-sticky-add-btn" class="px-5 py-2.5 bg-[#D89A73] hover:bg-[#c5855e] text-white font-extrabold text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-transform duration-200">
                            Thêm Vào Giỏ
                        </button>
                    ` : `
                        <button class="px-4 py-2.5 bg-zinc-300 text-zinc-500 font-bold text-[10px] uppercase tracking-widest cursor-not-allowed" disabled>
                            Hết Hàng
                        </button>
                    `}
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const qtyDec = this.container.querySelector('#detail-qty-dec');
        const qtyInc = this.container.querySelector('#detail-qty-inc');
        const qtyVal = this.container.querySelector('#detail-qty-val');
        const addBtn = this.container.querySelector('#detail-btn-add-cart');
        const mobileAddBtn = this.container.querySelector('#mobile-sticky-add-btn');
        
        const zoomBtn = this.container.querySelector('#gallery-zoom-btn');
        const lightboxOverlay = this.container.querySelector('#gallery-lightbox-overlay');
        const lightboxClose = this.container.querySelector('#lightbox-close-btn');
        const lightboxMainImg = this.container.querySelector('#lightbox-main-img');
        
        const sizeGuideTrigger = this.container.querySelector('#size-guide-trigger');
        const sizeGuideModal = this.container.querySelector('#size-guide-modal');
        const sizeGuideClose = this.container.querySelector('#size-guide-close');

        // --- 1. Interactive Magnifier Zoom on mousemove ---
        const zoomContainer = this.container.querySelector('.zoom-image-container');
        const zoomImg = this.container.querySelector('.zoom-image');
        if (zoomContainer && zoomImg) {
            zoomContainer.addEventListener('mousemove', (e) => {
                const rect = zoomContainer.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                zoomImg.style.transformOrigin = `${x}% ${y}%`;
                zoomImg.style.transform = 'scale(1.7)';
            });
            zoomContainer.addEventListener('mouseleave', () => {
                zoomImg.style.transform = 'scale(1)';
                zoomImg.style.transformOrigin = 'center center';
            });
            // Click image to trigger lightbox
            zoomImg.addEventListener('click', () => {
                this.openLightbox(lightboxOverlay);
            });
        }

        // --- 2. Cycle Image Thumbnails click ---
        this.container.querySelectorAll('[data-thumb-idx]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-thumb-idx'));
                this.activeImageIdx = idx;
                this.renderPageContent();
            });
        });

        // --- 3. Lightbox zoom modal controls ---
        if (zoomBtn) {
            zoomBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openLightbox(lightboxOverlay);
            });
        }
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => this.closeLightbox(lightboxOverlay));
        }
        if (lightboxOverlay) {
            lightboxOverlay.addEventListener('click', (e) => {
                if (e.target === lightboxOverlay || e.target === lightboxMainImg) {
                    this.closeLightbox(lightboxOverlay);
                }
            });
            
            // Lightbox thumbnail selector clicks
            lightboxOverlay.querySelectorAll('[data-lightbox-thumb-idx]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-lightbox-thumb-idx'));
                    this.activeImageIdx = idx;
                    
                    // Update main view and lightbox view
                    const nextImgUrl = this.product.images[idx].image_url;
                    lightboxMainImg.src = nextImgUrl;
                    if (zoomImg) zoomImg.src = nextImgUrl;
                    
                    // Highlight active
                    lightboxOverlay.querySelectorAll('[data-lightbox-thumb-idx]').forEach((b, i) => {
                        if (i === idx) {
                            b.classList.remove('border-zinc-700', 'opacity-60');
                            b.classList.add('border-white');
                        } else {
                            b.classList.remove('border-white');
                            b.classList.add('border-zinc-700', 'opacity-60');
                        }
                    });
                });
            });
        }

        // --- 4. Custom sizes selector clicks ---
        this.container.querySelectorAll('[data-size-btn]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sz = e.target.getAttribute('data-size-btn');
                this.selectedSize = sz;
                this.selectedVariant = this.product.variants.find(v => v.size === sz);
                this.quantity = 1; // Reset quantity
                this.renderPageContent();
            });
        });

        // --- 5. Quantity Adjustment ---
        if (qtyDec && qtyInc && qtyVal) {
            qtyDec.addEventListener('click', () => {
                if (this.quantity > 1) {
                    this.quantity--;
                    qtyVal.value = this.quantity;
                }
            });
            qtyInc.addEventListener('click', () => {
                const maxStock = this.selectedVariant ? this.selectedVariant.stock : 1;
                if (this.quantity < maxStock) {
                    this.quantity++;
                    qtyVal.value = this.quantity;
                }
            });
        }

        // --- 6. Size Guide triggers ---
        if (sizeGuideTrigger && sizeGuideModal) {
            sizeGuideTrigger.addEventListener('click', () => {
                sizeGuideModal.classList.remove('opacity-0', 'pointer-events-none');
                sizeGuideModal.classList.add('opacity-100', 'pointer-events-auto');
            });
        }
        if (sizeGuideClose && sizeGuideModal) {
            sizeGuideClose.addEventListener('click', () => {
                sizeGuideModal.classList.remove('opacity-100', 'pointer-events-auto');
                sizeGuideModal.classList.add('opacity-0', 'pointer-events-none');
            });
        }

        // --- 7. Expandable tabs accordion click logic ---
        this.container.querySelectorAll('.detail-manifesto-header').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.currentTarget.getAttribute('data-tab-header');
                const contentEl = this.container.querySelector(`#${tabId}`);
                const chevron = e.currentTarget.querySelector('.tab-chevron');
                
                if (contentEl.classList.contains('max-h-0')) {
                    contentEl.classList.remove('max-h-0', 'opacity-0');
                    contentEl.classList.add('max-h-40', 'opacity-100');
                    if (chevron) chevron.classList.add('rotate-90');
                } else {
                    contentEl.classList.remove('max-h-40', 'opacity-100');
                    contentEl.classList.add('max-h-0', 'opacity-0');
                    if (chevron) chevron.classList.remove('rotate-90');
                }
            });
        });

        // --- 8. Add to Cart Actions (Desktop + Mobile) ---
        const handleAddToCart = () => {
            if (!this.selectedVariant) return;

            const primaryImg = this.product.images.find(img => img.is_hover_alternate === 0)?.image_url 
                               || this.product.images[0]?.image_url;

            const cartItem = {
                variant_id: this.selectedVariant.id,
                product_id: this.product.id,
                name: this.product.name,
                size: this.selectedSize,
                color: this.selectedVariant.color || 'Black',
                image: primaryImg,
                price: this.product.price,
                sale_price: this.product.sale_price,
                quantity: this.quantity
            };

            const cart = this.app.state.cart;
            const existingIdx = cart.findIndex(item => item.variant_id === cartItem.variant_id);

            if (existingIdx > -1) {
                const totalQty = cart[existingIdx].quantity + this.quantity;
                const stockLimit = this.selectedVariant.stock;
                cart[existingIdx].quantity = Math.min(totalQty, stockLimit);
            } else {
                cart.push(cartItem);
            }

            // Save and popup Cart drawer interaction
            this.app.saveCart();
            
            // Visual success feedback on CTAs
            const originalAddText = addBtn ? addBtn.innerHTML : '';
            if (addBtn) {
                addBtn.disabled = true;
                addBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> <span>ĐÃ THÊM VÀO GIỎ!</span>`;
                addBtn.classList.remove('bg-[#D89A73]', 'border-[#D89A73]');
                addBtn.classList.add('bg-green-600', 'border-green-600');
            }
            if (mobileAddBtn) {
                mobileAddBtn.disabled = true;
                mobileAddBtn.innerText = 'ĐÃ THÊM!';
                mobileAddBtn.classList.remove('bg-[#D89A73]');
                mobileAddBtn.classList.add('bg-green-600');
            }
            
            if (window.lucide) window.lucide.createIcons();

            setTimeout(() => {
                if (addBtn) {
                    addBtn.disabled = false;
                    addBtn.innerHTML = originalAddText;
                    addBtn.classList.remove('bg-green-600', 'border-green-600');
                    addBtn.classList.add('bg-[#D89A73]', 'border-[#D89A73]');
                }
                if (mobileAddBtn) {
                    mobileAddBtn.disabled = false;
                    mobileAddBtn.innerText = 'Thêm Vào Giỏ';
                    mobileAddBtn.classList.remove('bg-green-600');
                    mobileAddBtn.classList.add('bg-[#D89A73]');
                }
                if (window.lucide) window.lucide.createIcons();

                // Open Cart Drawer
                if (this.app.navbarComponent) {
                    this.app.navbarComponent.openCartDrawer();
                }
            }, 1000);
        };

        if (addBtn) addBtn.addEventListener('click', handleAddToCart);
        if (mobileAddBtn) mobileAddBtn.addEventListener('click', handleAddToCart);

        // Move overlays to document.body
        if (lightboxOverlay) {
            const oldOverlay = document.getElementById('gallery-lightbox-overlay');
            if (oldOverlay) oldOverlay.remove();
            document.body.appendChild(lightboxOverlay);
        }
        if (sizeGuideModal) {
            const oldSizeModal = document.getElementById('size-guide-modal');
            if (oldSizeModal) oldSizeModal.remove();
            document.body.appendChild(sizeGuideModal);
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    openLightbox(lightboxOverlay) {
        this.isLightboxOpen = true;
        lightboxOverlay.classList.remove('opacity-0', 'pointer-events-none');
        lightboxOverlay.classList.add('opacity-100', 'pointer-events-auto');
    }

    closeLightbox(lightboxOverlay) {
        this.isLightboxOpen = false;
        lightboxOverlay.classList.remove('opacity-100', 'pointer-events-auto');
        lightboxOverlay.classList.add('opacity-0', 'pointer-events-none');
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
    }
}
