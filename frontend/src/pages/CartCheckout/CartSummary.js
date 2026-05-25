/**
 * Section: Shopping Cart Summary table list
 */
import Button from '../../components/ui/button.js';

export default class CartSummary {
    constructor(app, page) {
        this.app = app;
        this.page = page;
        this.container = document.createElement('section');
        this.container.className = 'space-y-6';
    }

    render() {
        const cart = this.app.state.cart;

        if (cart.length === 0) {
            this.container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6 max-w-md mx-auto">
                    <div class="w-16 h-16 bg-zinc-50 border border-borderMuted rounded-full flex items-center justify-center">
                        <i data-lucide="shopping-bag" class="w-8 h-8 text-zinc-405 text-zinc-400"></i>
                    </div>
                    <div>
                        <h2 class="text-lg font-bold uppercase tracking-wider text-primary">Giỏ hàng của bạn đang trống</h2>
                        <p class="text-xs text-zinc-400 mt-2 leading-relaxed">Hãy lựa chọn cho mình các sản phẩm tối giản mang phom dáng streetwear độc đáo nhất từ cửa hàng của chúng tôi.</p>
                    </div>
                    <a href="#shop" class="px-8 py-3.5 bg-primary text-white border border-primary font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all duration-300">Quay lại cửa hàng</a>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return this.container;
        }

        let subtotal = 0;
        let itemsHtml = '';

        cart.forEach((item, index) => {
            const price = item.sale_price ? parseFloat(item.sale_price) : parseFloat(item.price);
            const total = price * item.quantity;
            subtotal += total;

            itemsHtml += `
                <tr class="border-b border-borderMuted hover:bg-zinc-50 transition-colors">
                    <!-- Product Info -->
                    <td class="py-4 pr-3 flex items-start space-x-4">
                        <img src="${item.image}" alt="${item.name}" class="w-14 h-18 object-cover border border-borderMuted bg-zinc-550 flex-shrink-0" />
                        <div class="min-w-0">
                            <h4 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary">${item.name}</h4>
                            <p class="text-[10px] text-zinc-550 mt-1 uppercase">Size: ${item.size} | Color: ${item.color || 'Default'}</p>
                            <button class="text-[10px] text-zinc-400 hover:text-accent font-bold mt-2 flex items-center btn-item-remove-page" data-index="${index}">
                                <i data-lucide="trash-2" class="w-3 h-3 mr-1"></i> XÓA
                            </button>
                        </div>
                    </td>

                    <!-- Price -->
                    <td class="py-4 px-3 font-bold text-zinc-700 hidden sm:table-cell">
                        ${this.formatCurrency(price)}
                    </td>

                    <!-- Quantity -->
                    <td class="py-4 px-3">
                        <div class="flex items-center border border-borderMuted w-24">
                            <button class="px-2 py-1 hover:bg-neutralMuted text-xs font-bold btn-qty-dec-page" data-index="${index}">-</button>
                            <span class="w-full text-center text-xs font-medium">${item.quantity}</span>
                            <button class="px-2 py-1 hover:bg-neutralMuted text-xs font-bold btn-qty-inc-page" data-index="${index}">+</button>
                        </div>
                    </td>

                    <!-- Total -->
                    <td class="py-4 pl-3 font-bold text-accent text-right">
                        ${this.formatCurrency(total)}
                    </td>
                </tr>
            `;
        });

        // Apply member discount if logged in
        const user = this.app.state.user;
        const discountPercentage = user && user.loyalty ? parseFloat(user.loyalty.discount_percentage) : 0;
        const discountAmount = subtotal * (discountPercentage / 100);
        const finalTotal = subtotal - discountAmount;

        this.container.innerHTML = `
            <div class="mb-8">
                <span class="text-accent text-xs font-bold tracking-widest uppercase">SHOPPING CART</span>
                <h1 class="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-primary mt-1">GIỎ HÀNG CỦA BẠN</h1>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Cart Items Table (Left 2 cols) -->
                <div class="lg:col-span-2 overflow-x-auto">
                    <table class="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr class="border-b border-primary uppercase text-[10px] tracking-wider text-zinc-550 pb-2">
                                <th class="pb-3 pr-3 font-bold">Sản phẩm</th>
                                <th class="pb-3 px-3 font-bold hidden sm:table-cell">Giá bán</th>
                                <th class="pb-3 px-3 font-bold">Số lượng</th>
                                <th class="pb-3 pl-3 font-bold text-right">Tổng cộng</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-borderMuted font-light">
                            ${itemsHtml}
                        </tbody>
                    </table>
                </div>

                <!-- Order Calculations Card (Right 1 col) -->
                <div class="lg:col-span-1">
                    <div class="border border-borderMuted p-6 sm:p-8 bg-zinc-50 space-y-6">
                        <h3 class="text-sm font-bold uppercase tracking-wider text-primary border-b border-primary pb-2 flex items-center">
                            <i data-lucide="receipt" class="w-4 h-4 text-accent mr-2"></i> TỔNG ĐƠN HÀNG
                        </h3>
                        
                        <div class="space-y-3 text-xs text-zinc-650 font-light leading-relaxed">
                            <div class="flex justify-between items-center">
                                <span>Tạm tính:</span>
                                <span class="font-bold text-primary">${this.formatCurrency(subtotal)}</span>
                            </div>
                            
                            ${discountPercentage > 0 ? `
                                <div class="flex justify-between items-center text-accent">
                                    <span>Giảm giá (${user.loyalty.tier_name} - ${discountPercentage}%):</span>
                                    <span class="font-bold">-${this.formatCurrency(discountAmount)}</span>
                                </div>
                            ` : ''}

                            <div class="flex justify-between items-center border-t border-borderMuted pt-4">
                                <span class="text-sm font-bold text-primary">Tổng cộng:</span>
                                <span class="text-lg font-black text-accent">${this.formatCurrency(finalTotal)}</span>
                            </div>
                        </div>

                        <div class="pt-4">
                            ${Button.render('TIẾN HÀNH THANH TOÁN', 'primary', 'w-full py-4', 'id="btn-goto-checkout" data-track-cta="cart_checkout"')}
                        </div>

                        <div class="pt-2 text-center">
                            <a href="#shop" class="text-[10px] font-bold text-zinc-400 hover:text-accent uppercase tracking-widest">Tiếp tục mua hàng</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
        return this.container;
    }

    bindEvents() {
        const cart = this.app.state.cart;

        // Dec Quantity
        this.container.querySelectorAll('.btn-qty-dec-page').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity--;
                    this.app.saveCart();
                    this.page.render();
                }
            });
        });

        // Inc Quantity
        this.container.querySelectorAll('.btn-qty-inc-page').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                
                // Fetch product details to check actual stock
                try {
                    const res = await fetch(`/api/products/detail?id=${cart[idx].product_id}`);
                    const data = await res.json();
                    if (data.success) {
                        const variant = data.data.variants.find(v => v.id === cart[idx].variant_id);
                        if (variant && cart[idx].quantity < variant.stock) {
                            cart[idx].quantity++;
                            this.app.saveCart();
                            this.page.render();
                        }
                    }
                } catch (err) {
                    // fall back to default limit
                    cart[idx].quantity++;
                    this.app.saveCart();
                    this.page.render();
                }
            });
        });

        // Remove Item
        this.container.querySelectorAll('.btn-item-remove-page').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                cart.splice(idx, 1);
                this.app.saveCart();
                this.page.render();
            });
        });

        // Go to Checkout
        const checkoutBtn = this.container.querySelector('#btn-goto-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                window.location.hash = '#cart?checkout=true';
            });
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
    }
}
