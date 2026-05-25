/**
 * Section: Order Tracking Search form & Tracking details
 */
import Button from '../../components/ui/button.js';

export default class TrackingForm {
    constructor(app) {
        this.app = app;
        this.container = document.createElement('section');
        this.container.className = 'py-12 sm:py-16 max-w-4xl mx-auto space-y-10';
        
        // Component state
        this.orderCode = '';
        this.phone = '';
        this.order = null;
        this.errorMsg = '';
        this.searching = false;

        // Auto-fill order code if present in hash query
        this.checkHashParams();
    }

    checkHashParams() {
        const hash = window.location.hash;
        if (hash.includes('?')) {
            const queryStr = hash.split('?')[1];
            const pairs = queryStr.split('&');
            pairs.forEach(pair => {
                const [key, val] = pair.split('=');
                if (key === 'code') {
                    this.orderCode = decodeURIComponent(val);
                }
            });
        }
    }

    render() {
        this.container.innerHTML = `
            <!-- Header -->
            <div class="text-center mb-8">
                <span class="text-accent text-xs font-bold tracking-widest uppercase">ORDER TRACKING</span>
                <h1 class="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-primary mt-1">KIỂM TRA ĐƠN HÀNG</h1>
                <p class="text-xs sm:text-sm text-zinc-550 max-w-sm mx-auto mt-2 leading-relaxed font-light">Theo dõi trực tiếp hành trình đơn hàng streetwear của bạn từ xưởng may đến tay bạn.</p>
            </div>

            <!-- Search Form Box -->
            <div class="border border-borderMuted p-6 sm:p-8 bg-zinc-50 max-w-xl mx-auto">
                <form id="tracking-form" class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="tracking-code-input" class="text-[10px] font-bold uppercase text-zinc-500">Mã Đơn Hàng *</label>
                            <input type="text" id="tracking-code-input" class="w-full border border-borderMuted p-3 text-sm focus:outline-none focus:border-primary font-medium" placeholder="Ví dụ: SLY-9827361" value="${this.orderCode}" required />
                        </div>
                        <div class="space-y-1">
                            <label for="tracking-phone-input" class="text-[10px] font-bold uppercase text-zinc-500">Số Điện Thoại</label>
                            <input type="text" id="tracking-phone-input" class="w-full border border-borderMuted p-3 text-sm focus:outline-none focus:border-primary font-medium" placeholder="Nhập số điện thoại..." value="${this.phone}" />
                        </div>
                    </div>

                    ${this.errorMsg ? `<p class="text-xs text-accent font-bold">${this.errorMsg}</p>` : ''}

                    <div class="pt-2">
                        ${Button.render(this.searching ? 'Đang kiểm tra...' : 'TRA CỨU ĐƠN HÀNG', 'primary', 'w-full py-3.5', 'id="btn-tracking-submit" data-track-cta="track_submit"')}
                    </div>
                </form>
            </div>

            <!-- Tracking Details Results Display -->
            ${this.order ? this.renderTrackingResults() : ''}
        `;

        this.bindEvents();
        
        // Auto trigger search if code is prefilled from hash
        if (this.orderCode && !this.order && !this.errorMsg && !this.searching) {
            this.triggerSearch();
        }

        return this.container;
    }

    renderTrackingResults() {
        const order = this.order;
        const total = parseFloat(order.total_amount);
        const subtotal = parseFloat(order.subtotal);
        const discount = parseFloat(order.discount);
        const shippingFee = parseFloat(order.shipping_fee);

        // Determine step index based on order status
        const statuses = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIdx = statuses.indexOf(order.order_status);

        const trackingSteps = [
            { label: 'Đơn Hàng Đã Đặt', desc: 'SLY đã tiếp nhận đơn hàng của bạn.', icon: 'shopping-bag' },
            { label: 'Đang Chuẩn Bị', desc: 'Đang lựa chọn phom dáng & kiểm tra hình in.', icon: 'package' },
            { label: 'Đã Giao Vận Chuyển', desc: `Đã bàn giao cho nhà vận chuyển. Mã vận đơn: ${order.tracking_number || 'Chưa cập nhật'}`, icon: 'truck' },
            { label: 'Giao Thành Công', desc: 'Gói hàng streetwear đã tới tay bạn.', icon: 'smile' }
        ];

        return `
            <div class="border border-borderMuted bg-white shadow-sm p-6 sm:p-8 space-y-10 mt-10">
                
                <!-- Summary Header -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-borderMuted pb-4 space-y-2 sm:space-y-0">
                    <div>
                        <span class="text-[10px] text-zinc-550 font-bold uppercase tracking-widest">KẾT QUẢ TRA CỨU</span>
                        <h2 class="text-lg font-extrabold uppercase tracking-wider text-primary mt-1">Đơn hàng: ${order.order_code}</h2>
                    </div>
                    <span class="bg-accent text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider self-start sm:self-auto">${order.order_status}</span>
                </div>

                <!-- Visual Steps Progress Tracker -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                    ${trackingSteps.map((step, idx) => {
                        const isCompleted = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        
                        return `
                            <div class="flex md:flex-col items-center md:items-center text-left md:text-center space-x-4 md:space-x-0 md:space-y-3 relative z-10">
                                <!-- Step Circle -->
                                <div class="w-10 h-10 border-2 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-primary border-primary text-white' : 'bg-white border-zinc-300 text-zinc-400'} ${isCurrent ? 'ring-4 ring-accent/20' : ''}">
                                    <i data-lucide="${step.icon}" class="w-5 h-5"></i>
                                </div>
                                
                                <!-- Step Details -->
                                <div class="space-y-1">
                                    <h4 class="text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-primary' : 'text-zinc-400'}">${step.label}</h4>
                                    <p class="text-[10px] text-zinc-550 leading-relaxed font-light">${step.desc}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Split Columns: Items & Address -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-borderMuted pt-8">
                    <!-- Column Left: Items purchased -->
                    <div class="space-y-4">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-primary border-b border-primary pb-2 flex items-center">
                            <i data-lucide="package-open" class="w-4 h-4 mr-2 text-accent"></i> SẢN PHẨM MUA SẮM
                        </h3>
                        <div class="space-y-4">
                            ${order.items.map(item => `
                                <div class="flex items-center space-x-4">
                                    <img src="${item.product_image}" class="w-12 h-16 object-cover border border-borderMuted bg-zinc-50" />
                                    <div class="flex-grow min-w-0">
                                        <h4 class="text-xs font-bold uppercase tracking-wider">${item.product_name}</h4>
                                        <p class="text-[10px] text-zinc-500">Size: ${item.size} | Qty: ${item.quantity}</p>
                                    </div>
                                    <span class="text-xs font-bold text-accent">${this.formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Column Right: Billing details -->
                    <div class="space-y-4">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-primary border-b border-primary pb-2 flex items-center">
                            <i data-lucide="map-pin" class="w-4 h-4 mr-2 text-accent"></i> THÔNG TIN GIAO NHẬN
                        </h3>
                        <div class="text-xs text-zinc-650 space-y-2.5 font-light leading-relaxed">
                            <p>Khách hàng: <strong>${order.guest_name || order.user_name}</strong></p>
                            <p>Số điện thoại: <strong>${order.guest_phone || order.phone}</strong></p>
                            <p>Địa chỉ nhận hàng: <strong>${order.shipping_address}</strong></p>
                            <p>Phương thức thanh toán: <strong>${order.payment_method} (${order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'})</strong></p>
                        </div>

                        <!-- Calculations table -->
                        <div class="border-t border-borderMuted pt-4 space-y-1.5 text-xs text-zinc-650">
                            <div class="flex justify-between">
                                <span>Tạm tính:</span>
                                <span>${this.formatCurrency(subtotal)}</span>
                            </div>
                            ${discount > 0 ? `
                                <div class="flex justify-between text-accent">
                                    <span>Chiết khấu giảm giá:</span>
                                    <span>-${this.formatCurrency(discount)}</span>
                                </div>
                            ` : ''}
                            <div class="flex justify-between">
                                <span>Phí vận chuyển:</span>
                                <span>${this.formatCurrency(shippingFee)}</span>
                            </div>
                            <div class="flex justify-between border-t border-borderMuted pt-2 font-bold text-sm text-primary">
                                <span>Thành tiền:</span>
                                <span class="text-accent">${this.formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }

    bindEvents() {
        const form = this.container.querySelector('#tracking-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.orderCode = this.container.querySelector('#tracking-code-input').value.trim();
                this.phone = this.container.querySelector('#tracking-phone-input').value.trim();
                this.triggerSearch();
            });
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    async triggerSearch() {
        if (!this.orderCode) return;

        this.searching = true;
        this.errorMsg = '';
        this.order = null;
        this.render();

        try {
            const phoneParam = this.phone ? `&phone=${encodeURIComponent(this.phone)}` : '';
            const res = await fetch(`/api/order/track?order_code=${encodeURIComponent(this.orderCode)}${phoneParam}`);
            const data = await res.json();

            if (data.success) {
                this.order = data.data;
            } else {
                this.errorMsg = data.error || 'Không tìm thấy thông tin đơn hàng này.';
            }
        } catch (e) {
            this.errorMsg = 'Lỗi kết nối máy chủ. Vui lòng thử lại sau.';
        } finally {
            this.searching = false;
            this.render();
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
    }
}
