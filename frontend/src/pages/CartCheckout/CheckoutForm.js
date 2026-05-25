/**
 * Section: Upgraded Premium Checkout Form with Billing, Cascading Address SELECTs,
 * and direct Quantity Steppers inside Order Summary.
 */
export default class CheckoutForm {
    constructor(app, page) {
        this.app = app;
        this.page = page;
        this.container = document.createElement('section');
        this.container.className = 'w-full';

        // Component states
        this.submitting = false;
        
        // Location states
        this.provinces = [];
        this.districts = [];
        this.wards = [];
        
        this.selectedProvinceCode = '';
        this.selectedDistrictCode = '';
        this.selectedWardCode = '';
        
        this.selectedProvinceName = '';
        this.selectedDistrictName = '';
        this.selectedWardName = '';

        // Calculations cached
        this.calculatedSubtotal = 0;
        this.calculatedDiscount = 0;
        this.calculatedShipping = 0;
        this.calculatedTotal = 0;
    }

    render() {
        const cart = this.app.state.cart;
        const user = this.app.state.user;

        if (cart.length === 0) {
            // Redirect back to cart page if empty
            setTimeout(() => { window.location.hash = '#cart'; }, 100);
            return this.container;
        }

        // Render Page Skeleton
        this.container.innerHTML = `
            <!-- Top Dark Promo Banner -->
            <div class="bg-black text-white text-[10px] font-bold py-3.5 px-4 mb-8 text-left cursor-pointer uppercase tracking-widest hover:bg-neutral-800 transition-colors select-none">
                Bạn có mã ưu đãi? <span class="underline underline-offset-2 hover:text-accent transition-colors">Ấn vào đây để nhập mã</span>
            </div>

            <form id="checkout-submission-form" class="w-full">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    <!-- LEFT COLUMN: Billing Details (60% width / 7 cols) -->
                    <div class="lg:col-span-7 space-y-6">
                        <h2 class="text-xl sm:text-2xl font-black uppercase tracking-wider text-primary border-b-2 border-primary pb-3 select-none">
                            THÔNG TIN THANH TOÁN
                        </h2>
                        
                        <div class="space-y-4">
                            <!-- Full name -->
                            <div class="space-y-1.5">
                                <label for="checkout-name" class="text-[10px] font-black uppercase text-zinc-550 tracking-wider">Họ và tên *</label>
                                <input type="text" id="checkout-name" class="w-full border border-borderMuted p-3 text-sm focus:outline-none focus:border-primary font-medium" 
                                    placeholder="Nhập họ và tên" value="${user ? user.name : ''}" required />
                            </div>

                            <!-- Phone -->
                            <div class="space-y-1.5">
                                <label for="checkout-phone" class="text-[10px] font-black uppercase text-zinc-550 tracking-wider">Số điện thoại *</label>
                                <div class="relative">
                                    <input type="tel" id="checkout-phone" class="w-full border border-borderMuted p-3 pr-10 text-sm focus:outline-none focus:border-primary font-medium" 
                                        placeholder="Nhập số điện thoại" value="${user ? user.phone : ''}" required />
                                    <i data-lucide="phone" class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"></i>
                                </div>
                            </div>

                            <!-- Email -->
                            <div class="space-y-1.5">
                                <label for="checkout-email" class="text-[10px] font-black uppercase text-zinc-550 tracking-wider">Địa chỉ email *</label>
                                <div class="relative">
                                    <input type="email" id="checkout-email" class="w-full border border-borderMuted p-3 pr-10 text-sm focus:outline-none focus:border-primary font-medium" 
                                        placeholder="tritan2801@gmail.com" value="${user ? user.email : 'tritan2801@gmail.com'}" required />
                                    <i data-lucide="lock" class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"></i>
                                </div>
                            </div>

                            <!-- Cascading Address Selector -->
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div class="space-y-1.5">
                                    <label for="checkout-province" class="text-[10px] font-black uppercase text-zinc-550 tracking-wider">Tỉnh/Thành phố *</label>
                                    <select id="checkout-province" class="w-full border border-borderMuted p-3 text-sm focus:outline-none focus:border-primary font-medium bg-white text-zinc-700 cursor-pointer select-none" disabled>
                                        <option value="">Đang tải...</option>
                                    </select>
                                </div>
                                <div class="space-y-1.5">
                                    <label for="checkout-district" class="text-[10px] font-black uppercase text-zinc-550 tracking-wider">Quận huyện *</label>
                                    <select id="checkout-district" class="w-full border border-borderMuted p-3 text-sm focus:outline-none focus:border-primary font-medium bg-white text-zinc-700 cursor-pointer select-none" disabled>
                                        <option value="">Chọn quận/huyện</option>
                                    </select>
                                </div>
                                <div class="space-y-1.5">
                                    <label for="checkout-ward" class="text-[10px] font-black uppercase text-zinc-550 tracking-wider">Xã/Phường/Thị trấn *</label>
                                    <select id="checkout-ward" class="w-full border border-borderMuted p-3 text-sm focus:outline-none focus:border-primary font-medium bg-white text-zinc-700 cursor-pointer select-none" disabled>
                                        <option value="">Chọn xã/phường/thị trấn</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Specific Address details -->
                            <div class="space-y-1.5">
                                <label for="checkout-specific-address" class="text-[10px] font-black uppercase text-zinc-550 tracking-wider">Địa chỉ *</label>
                                <div class="relative">
                                    <input type="text" id="checkout-specific-address" class="w-full border border-borderMuted p-3 pr-10 text-sm focus:outline-none focus:border-primary font-medium" 
                                        placeholder="Toà nhà, số nhà, tên đường" required />
                                    <i data-lucide="map-pin" class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"></i>
                                </div>
                            </div>

                            <!-- Ship to different address checkbox -->
                            <div class="flex items-center space-x-2.5 pt-2 select-none">
                                <input type="checkbox" id="checkout-different-address" class="w-3.5 h-3.5 accent-accent cursor-pointer" />
                                <label for="checkout-different-address" class="text-xs font-bold text-zinc-650 cursor-pointer">Giao hàng tới địa chỉ khác?</label>
                            </div>

                            <!-- Notes -->
                            <div class="space-y-1.5 pt-2">
                                <label for="checkout-notes" class="text-[10px] font-black uppercase text-zinc-550 tracking-wider">Ghi chú đơn hàng (tuỳ chọn)</label>
                                <textarea id="checkout-notes" rows="4" class="w-full border border-borderMuted p-3 text-sm focus:outline-none focus:border-primary font-medium" 
                                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: Order Summary Card (40% width / 5 cols) -->
                    <div class="lg:col-span-5 bg-zinc-50/50 border border-borderMuted p-6 sm:p-8 space-y-6">
                        <h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-primary border-b border-zinc-200 pb-3 select-none">
                            ĐƠN HÀNG CỦA BẠN
                        </h2>

                        <!-- Product List Container (dynamically updated) -->
                        <div id="checkout-order-items-list" class="space-y-4 max-h-[380px] overflow-y-auto pr-1 divide-y divide-borderMuted/60">
                            <!-- Items inserted dynamically -->
                        </div>

                        <!-- Calculations Block (dynamically updated) -->
                        <div id="checkout-calculations-block" class="border-t border-borderMuted/60 pt-4 space-y-3.5 text-xs text-zinc-650 font-light leading-relaxed">
                            <!-- Math calculations inserted dynamically -->
                        </div>

                        <!-- Payment Methods Selector -->
                        <div class="space-y-3 pt-4 border-t border-borderMuted/60">
                            <label class="flex items-center space-x-2.5 text-xs font-bold uppercase cursor-pointer py-1.5 select-none">
                                <input type="radio" name="checkout_payment" value="COD" class="accent-primary mr-1 w-3.5 h-3.5" />
                                <span class="text-zinc-700">Trả tiền mặt khi nhận hàng</span>
                            </label>
                            <label class="flex items-start space-x-2.5 text-xs font-bold uppercase cursor-pointer py-1.5 select-none">
                                <input type="radio" name="checkout_payment" value="BANK" checked class="accent-primary mt-0.5 mr-1 w-3.5 h-3.5" />
                                <span class="text-zinc-700">Chuyển khoản ngân hàng</span>
                            </label>
                            
                            <!-- Interactive explanation for Bank Transfer -->
                            <div id="bank-transfer-explanation" class="bg-zinc-50 border border-borderMuted p-4 text-[11px] font-light leading-relaxed text-zinc-500 space-y-1.5 mt-2">
                                Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi sau khi nhấn nút đặt hàng. Vui lòng sử dụng Mã đơn hàng của bạn trong phần Nội dung thanh toán. Đơn hàng sẽ được giao sau khi tiền đã chuyển.
                            </div>
                        </div>

                        <!-- Agree terms checkbox -->
                        <div class="pt-4 flex items-start space-x-2.5 select-none">
                            <input type="checkbox" id="checkout-terms-agree" class="mt-0.5 accent-primary w-3.5 h-3.5 cursor-pointer" required />
                            <label for="checkout-terms-agree" class="text-[11px] text-zinc-555 text-zinc-500 font-medium cursor-pointer leading-relaxed">
                                Tôi đã đọc và đồng ý với <a href="#policy" class="font-bold underline text-primary hover:text-accent">điều khoản và điều kiện của website *</a>
                            </label>
                        </div>

                        <!-- Action Submit alerts and button -->
                        <div id="checkout-alerts-container"></div>

                        <div class="pt-2">
                            <button type="submit" id="btn-checkout-submit" class="w-full py-4 bg-[#F35E1A] hover:bg-[#db4f11] text-white border border-[#F35E1A] hover:border-[#db4f11] font-black text-xs uppercase tracking-widest shadow-md hover:shadow-lg active:scale-98 transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none">
                                <span>ĐẶT HÀNG</span>
                            </button>
                        </div>

                        <div class="pt-1 text-center">
                            <p class="text-[10px] text-zinc-400 font-semibold italic select-none">Cám ơn quý khách đã tin tưởng và luôn ủng hộ SLY</p>
                        </div>
                    </div>

                </div>
            </form>
        `;

        // Render dynamic parts
        this.renderOrderSummary();

        return this.container;
    }

    mount() {
        this.initLocations();
        this.bindPaymentToggles();
        this.bindFormSubmission();
    }

    renderOrderSummary() {
        const cart = this.app.state.cart;
        const user = this.app.state.user;
        
        const itemsContainer = this.container.querySelector('#checkout-order-items-list');
        const calcContainer = this.container.querySelector('#checkout-calculations-block');
        
        if (!itemsContainer || !calcContainer) return;
        
        if (cart.length === 0) {
            window.location.hash = '#cart';
            return;
        }

        // Calculations
        let subtotal = 0;
        cart.forEach(item => {
            const price = item.sale_price ? parseFloat(item.sale_price) : parseFloat(item.price);
            subtotal += price * item.quantity;
        });
        
        // Free shipping policy over 800k, else 30k
        const shippingFee = subtotal >= 800000 ? 0 : 30000;
        const discountPercentage = user && user.loyalty ? parseFloat(user.loyalty.discount_percentage) : 0;
        const discountAmount = subtotal * (discountPercentage / 100);
        const finalTotal = subtotal - discountAmount + shippingFee;
        
        // Save these calculated values
        this.calculatedSubtotal = subtotal;
        this.calculatedDiscount = discountAmount;
        this.calculatedShipping = shippingFee;
        this.calculatedTotal = finalTotal;

        // Render items list inside checkout
        itemsContainer.innerHTML = cart.map((item, idx) => {
            const price = item.sale_price ? parseFloat(item.sale_price) : parseFloat(item.price);
            return `
                <div class="flex items-start space-x-3.5 pt-3.5 first:pt-0">
                    <img src="${item.image}" class="w-16 h-20 object-cover border border-borderMuted bg-white flex-shrink-0" />
                    <div class="flex-grow min-w-0 space-y-1.5">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-primary truncate leading-tight">${item.name}</h4>
                        <p class="text-[9px] text-zinc-450 uppercase leading-none font-bold">Kích cỡ: ${item.size}</p>
                        
                        <!-- Stepper quantity adjustment inside checkout card -->
                        <div class="flex items-center border border-borderMuted w-20 bg-white select-none">
                            <button type="button" class="w-6 py-0.5 hover:bg-zinc-50 font-extrabold text-xs transition-colors focus:outline-none btn-checkout-qty-dec" data-idx="${idx}">-</button>
                            <span class="w-8 text-center text-[10px] font-black">${item.quantity}</span>
                            <button type="button" class="w-6 py-0.5 hover:bg-zinc-50 font-extrabold text-xs transition-colors focus:outline-none btn-checkout-qty-inc" data-idx="${idx}">+</button>
                        </div>
                    </div>
                    <span class="text-xs font-black text-zinc-700 whitespace-nowrap pt-1">${this.formatCurrency(price * item.quantity)}</span>
                </div>
            `;
        }).join('');
        
        // Render math values matching layout
        calcContainer.innerHTML = `
            <div class="flex justify-between items-center border-b border-borderMuted/40 pb-2.5">
                <span class="font-bold text-zinc-700">Tạm tính</span>
                <span class="font-black text-zinc-800">${this.formatCurrency(subtotal)}</span>
            </div>
            ${discountPercentage > 0 ? `
                <div class="flex justify-between items-center text-accent border-b border-borderMuted/40 pb-2.5">
                    <span class="font-bold">Giảm giá (${user.loyalty.tier_name} - ${discountPercentage}%)</span>
                    <span class="font-black">-${this.formatCurrency(discountAmount)}</span>
                </div>
            ` : ''}
            <div class="flex justify-between items-center border-b border-borderMuted/40 pb-2.5">
                <span class="font-bold text-zinc-700">Giao hàng</span>
                <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">${shippingFee === 0 ? 'Giao hàng miễn phí' : this.formatCurrency(shippingFee)}</span>
            </div>
            <div class="flex justify-between items-center font-bold text-sm text-primary pt-1.5">
                <span class="text-xs uppercase tracking-widest font-black">Tổng</span>
                <span class="text-primary text-base font-black">${this.formatCurrency(finalTotal)}</span>
            </div>
        `;
        
        this.bindQuantitySteppers();
        
        // Notify header to sync quantity counter badge if needed
        window.dispatchEvent(new CustomEvent('sly-cart-updated'));
    }

    bindQuantitySteppers() {
        const cart = this.app.state.cart;
        
        this.container.querySelectorAll('.btn-checkout-qty-dec').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity--;
                    this.app.saveCart();
                    this.renderOrderSummary();
                } else {
                    // Remove item if quantity goes below 1
                    cart.splice(idx, 1);
                    this.app.saveCart();
                    this.renderOrderSummary();
                }
            });
        });
        
        this.container.querySelectorAll('.btn-checkout-qty-inc').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                
                try {
                    const res = await fetch(`/api/products/detail?id=${cart[idx].product_id}`);
                    const data = await res.json();
                    if (data.success) {
                        const variant = data.data.variants.find(v => v.id === cart[idx].variant_id);
                        if (variant && cart[idx].quantity < variant.stock) {
                            cart[idx].quantity++;
                            this.app.saveCart();
                            this.renderOrderSummary();
                        } else {
                            alert(`Sản phẩm này chỉ còn ${variant ? variant.stock : 1} sản phẩm trong kho.`);
                        }
                    }
                } catch (err) {
                    cart[idx].quantity++;
                    this.app.saveCart();
                    this.renderOrderSummary();
                }
            });
        });
    }

    // --- Cascading Province Dropdown Logic (API open-api.vn + fallback) ---
    async initLocations() {
        const provSelect = this.container.querySelector('#checkout-province');
        const distSelect = this.container.querySelector('#checkout-district');
        const wardSelect = this.container.querySelector('#checkout-ward');

        if (!provSelect) return;

        // Fetch Provinces
        await this.fetchProvinces();
        
        provSelect.innerHTML = '<option value="">Chọn Tỉnh/Thành phố *</option>' + 
            this.provinces.map(p => `<option value="${p.code}">${p.name}</option>`).join('');
        provSelect.disabled = false;

        // Province change handler
        provSelect.addEventListener('change', async (e) => {
            const code = e.target.value;
            this.selectedProvinceCode = code;
            this.selectedProvinceName = code ? e.target.options[e.target.selectedIndex].text : '';
            
            // reset districts & wards
            this.selectedDistrictCode = '';
            this.selectedDistrictName = '';
            this.selectedWardCode = '';
            this.selectedWardName = '';

            distSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
            distSelect.disabled = true;
            wardSelect.innerHTML = '<option value="">Chọn xã/phường/thị trấn</option>';
            wardSelect.disabled = true;

            if (code) {
                distSelect.innerHTML = '<option value="">Đang tải quận/huyện...</option>';
                await this.fetchDistricts(code);
                distSelect.innerHTML = '<option value="">Chọn quận/huyện</option>' + 
                    this.districts.map(d => `<option value="${d.code}">${d.name}</option>`).join('');
                distSelect.disabled = false;
            }
        });

        // District change handler
        distSelect.addEventListener('change', async (e) => {
            const code = e.target.value;
            this.selectedDistrictCode = code;
            this.selectedDistrictName = code ? e.target.options[e.target.selectedIndex].text : '';
            
            // reset wards
            this.selectedWardCode = '';
            this.selectedWardName = '';

            wardSelect.innerHTML = '<option value="">Chọn xã/phường/thị trấn</option>';
            wardSelect.disabled = true;

            if (code) {
                wardSelect.innerHTML = '<option value="">Đang tải xã/phường...</option>';
                await this.fetchWards(code);
                wardSelect.innerHTML = '<option value="">Chọn xã/phường/thị trấn</option>' + 
                    this.wards.map(w => `<option value="${w.code || w.name}">${w.name}</option>`).join('');
                wardSelect.disabled = false;
            }
        });

        // Ward change handler
        wardSelect.addEventListener('change', (e) => {
            const code = e.target.value;
            this.selectedWardCode = code;
            this.selectedWardName = code ? e.target.options[e.target.selectedIndex].text : '';
        });

        // Trigger Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    async fetchProvinces() {
        try {
            const res = await fetch('https://provinces.open-api.vn/api/p/');
            if (!res.ok) throw new Error('Location API Offline');
            this.provinces = await res.json();
        } catch (e) {
            console.warn('Province API offline, loading pre-compiled regional fallback dataset:', e);
            this.provinces = this.getFallbackProvinces();
        }
    }

    async fetchDistricts(provinceCode) {
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            if (!res.ok) throw new Error('Location API Offline');
            const data = await res.json();
            this.districts = data.districts || [];
        } catch (e) {
            const fallbackProvince = this.getFallbackProvinces().find(p => p.code == provinceCode);
            this.districts = fallbackProvince ? fallbackProvince.districts : [];
        }
    }

    async fetchWards(districtCode) {
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            if (!res.ok) throw new Error('Location API Offline');
            const data = await res.json();
            this.wards = data.wards || [];
        } catch (e) {
            const fallbackProv = this.getFallbackProvinces().find(p => 
                p.districts.some(d => d.code == districtCode)
            );
            const fallbackDist = fallbackProv ? fallbackProv.districts.find(d => d.code == districtCode) : null;
            this.wards = fallbackDist ? fallbackDist.wards.map((w, idx) => ({ code: idx, name: w })) : [];
        }
    }

    getFallbackProvinces() {
        return [
            { code: 79, name: "Tp. Hồ Chí Minh", districts: [
                { code: 768, name: "Quận Phú Nhuận", wards: ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 13", "Phường 15", "Phường 17"] },
                { code: 760, name: "Quận 1", wards: ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Cầu Ông Lãnh", "Phường Cô Giang", "Phường Đa Kao", "Phường Nguyễn Cư Trinh", "Phường Nguyễn Thái Bình", "Phường Phạm Ngũ Lão", "Phường Tân Định"] },
                { code: 761, name: "Quận 3", wards: ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường Võ Thị Sáu", "Phường Hàng Xanh"] }
            ]},
            { code: 1, name: "Thành phố Hà Nội", districts: [
                { code: 1, name: "Quận Hoàn Kiếm", wards: ["Phường Hàng Bạc", "Phường Hàng Đào", "Phường Tràng Tiền", "Phường Đồng Xuân", "Phường Lý Thái Tổ", "Phường Hàng Bông"] },
                { code: 2, name: "Quận Ba Đình", wards: ["Phường Trúc Bạch", "Phường Cống Vị", "Phường Kim Mã", "Phường Giảng Võ", "Phường Thành Công"] }
            ]},
            { code: 48, name: "Thành phố Đà Nẵng", districts: [
                { code: 490, name: "Quận Hải Châu", wards: ["Phường Thạch Thang", "Phường Hải Châu I", "Phường Hải Châu II", "Phường Phước Ninh", "Phường Hòa Thuận Tây"] }
            ]}
        ];
    }

    // --- Interactive Payment Method Info panel toggles ---
    bindPaymentToggles() {
        const codRadio = this.container.querySelector('input[name="checkout_payment"][value="COD"]');
        const bankRadio = this.container.querySelector('input[name="checkout_payment"][value="BANK"]');
        const explanation = this.container.querySelector('#bank-transfer-explanation');

        if (codRadio && bankRadio && explanation) {
            codRadio.addEventListener('change', () => {
                if (codRadio.checked) explanation.classList.add('hidden');
            });
            bankRadio.addEventListener('change', () => {
                if (bankRadio.checked) explanation.classList.remove('hidden');
            });
        }
    }

    // --- Order submission ---
    bindFormSubmission() {
        const form = this.container.querySelector('#checkout-submission-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear alerts
            const alertsContainer = this.container.querySelector('#checkout-alerts-container');
            if (alertsContainer) alertsContainer.innerHTML = '';

            // Check location selections
            if (!this.selectedProvinceName || !this.selectedDistrictName || !this.selectedWardName) {
                this.showError('Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Xã/Phường/Thị trấn.');
                return;
            }

            const termsAgree = this.container.querySelector('#checkout-terms-agree');
            if (!termsAgree || !termsAgree.checked) {
                this.showError('Bạn cần đồng ý với các điều khoản điều kiện của website để đặt hàng.');
                return;
            }

            const name = this.container.querySelector('#checkout-name').value.trim();
            const phone = this.container.querySelector('#checkout-phone').value.trim();
            const email = this.container.querySelector('#checkout-email').value.trim();
            const specificAddress = this.container.querySelector('#checkout-specific-address').value.trim();
            const notes = this.container.querySelector('#checkout-notes').value.trim();
            const paymentMethod = this.container.querySelector('input[name="checkout_payment"]:checked').value;

            // Concatenate address
            const fullAddress = `${specificAddress}, ${this.selectedWardName}, ${this.selectedDistrictName}, ${this.selectedProvinceName}`;

            const cart = this.app.state.cart;
            const formattedItems = cart.map(item => ({
                variant_id: item.variant_id,
                quantity: item.quantity,
                price: item.sale_price ? parseFloat(item.sale_price) : parseFloat(item.price)
            }));

            const orderPayload = {
                shipping_address: fullAddress,
                payment_method: paymentMethod,
                notes: notes,
                subtotal: this.calculatedSubtotal,
                discount: this.calculatedDiscount,
                shipping_fee: this.calculatedShipping,
                total_amount: this.calculatedTotal,
                items: formattedItems
            };

            // Guest parameters if not logged in
            if (!this.app.state.user) {
                orderPayload.guest_name = name;
                orderPayload.guest_phone = phone;
                orderPayload.guest_email = email;
            }

            // Disable submit button
            this.submitting = true;
            const submitBtn = this.container.querySelector('#btn-checkout-submit');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>ĐANG XỬ LÝ...</span>`;
            }

            try {
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderPayload)
                });
                const data = await res.json();

                if (data.success) {
                    this.showSuccess('Đặt hàng thành công! Đang chuyển hướng...');
                    this.app.state.cart = [];
                    this.app.saveCart();

                    setTimeout(() => {
                        window.location.hash = `#tracking?code=${data.data.order_code}`;
                    }, 1500);
                } else {
                    this.showError(data.error || 'Đặt hàng thất bại. Vui lòng thử lại.');
                    this.submitting = false;
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `<span>ĐẶT HÀNG</span>`;
                    }
                }
            } catch (err) {
                this.showError('Lỗi hệ thống khi gửi yêu cầu thanh toán.');
                this.submitting = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>ĐẶT HÀNG</span>`;
                }
            }
        });
    }

    showError(msg) {
        const container = this.container.querySelector('#checkout-alerts-container');
        if (container) {
            container.innerHTML = `
                <div class="text-xs font-bold text-accent bg-red-50 p-3 border border-red-200 mt-3 select-none flex items-center">
                    <i data-lucide="alert-circle" class="w-4 h-4 mr-2"></i> ${msg}
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
        }
    }

    showSuccess(msg) {
        const container = this.container.querySelector('#checkout-alerts-container');
        if (container) {
            container.innerHTML = `
                <div class="text-xs font-bold text-green-600 bg-green-50 p-3 border border-green-200 mt-3 select-none flex items-center">
                    <i data-lucide="check" class="w-4 h-4 mr-2"></i> ${msg}
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
    }
}
