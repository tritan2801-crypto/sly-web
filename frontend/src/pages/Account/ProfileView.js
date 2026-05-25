/**
 * Section: Customer Account Profile Dashboard & Order History
 */
import Button from '../../components/ui/button.js';

export default class ProfileView {
    constructor(app, page) {
        this.app = app;
        this.page = page;
        this.container = document.createElement('section');
        this.container.className = 'space-y-10 max-w-5xl mx-auto';

        // Component state
        this.orders = [];
        this.loadingOrders = true;

        // Accordion state: 'orders', 'profile', 'password', 'current_orders'
        this.activeSection = 'orders';

        // Forms state/messages
        this.profileMsg = { type: '', text: '' };
        this.passwordMsg = { type: '', text: '' };
    }

    async fetchOrderHistory() {
        try {
            const res = await fetch('/api/orders'); // Handled by OrderController and User ID session
            const data = await res.json();
            if (data.success) {
                this.orders = data.data || [];
            }
        } catch (e) {
            this.orders = [];
        } finally {
            this.loadingOrders = false;
            // Only render accordion section if the active section is orders or current_orders
            if (this.activeSection === 'orders' || this.activeSection === 'current_orders') {
                this.renderAccordion();
            }
        }
    }

    render() {
        const user = this.app.state.user;
        if (!user) return this.container;

        const loyalty = user.loyalty || { tier_name: 'Bronze', current_points: 0, discount_percentage: 0.00 };

        this.container.innerHTML = `
            <!-- Dashboard Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <!-- Col 1: Profile Summary & Membership Card -->
                <div class="space-y-6 md:col-span-1">
                    <div class="border border-borderMuted p-6 space-y-6 bg-zinc-50">
                        <div class="space-y-1">
                            <span class="text-[9px] text-zinc-550 font-bold uppercase tracking-widest">TÀI KHOẢN CỦA BẠN</span>
                            <h2 class="text-lg font-extrabold uppercase tracking-wider text-primary">${user.name}</h2>
                        </div>
                        <div class="text-xs text-zinc-650 space-y-2.5 font-light">
                            <p class="flex items-center"><i data-lucide="mail" class="w-4 h-4 mr-2 text-zinc-400"></i> ${user.email}</p>
                            <p class="flex items-center"><i data-lucide="phone" class="w-4 h-4 mr-2 text-zinc-400"></i> ${user.phone || 'Chưa cập nhật'}</p>
                            <p class="flex items-center"><i data-lucide="shield" class="w-4 h-4 mr-2 text-zinc-400"></i> Vai trò: <span class="capitalize ml-1 font-semibold">${user.role}</span></p>
                        </div>
                        <div class="pt-4 border-t border-borderMuted">
                            ${Button.render('ĐĂNG XUẤT', 'secondary', 'w-full py-2.5', 'id="btn-account-logout" data-track-cta="logout"')}
                        </div>
                    </div>

                    <!-- Compact Loyalty Box -->
                    <div class="border border-borderMuted p-6 space-y-4 bg-zinc-50">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-primary flex items-center justify-between">
                            <span>ĐẶC QUYỀN HẠNG</span>
                            <i data-lucide="award" class="w-4 h-4 text-accent"></i>
                        </h3>
                        <div class="space-y-2 text-xs text-zinc-650 font-light">
                            <p>Cấp bậc hiện tại: <strong class="text-accent uppercase">${loyalty.tier_name}</strong></p>
                            <p>Điểm tích luỹ: <strong>${loyalty.current_points} pts</strong></p>
                            <p>Ưu đãi chiết khấu: <strong>Giảm ${loyalty.discount_percentage}%</strong> tự động áp dụng tại giỏ hàng khi mua sắm.</p>
                        </div>
                        <div class="pt-2">
                            <a href="#member" class="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary hover:text-accent hover:border-accent pb-0.5 transition-colors">Xem thể lệ & quyền lợi</a>
                        </div>
                    </div>
                </div>

                <!-- Col 2&3: Profile Accordion container -->
                <div id="profile-accordion-container" class="md:col-span-2 space-y-4">
                    <!-- Dynamic accordion content goes here -->
                </div>

            </div>
        `;

        this.renderAccordion();
        this.fetchOrderHistory();
        this.bindEvents();
        return this.container;
    }

    renderAccordion() {
        const accordionContainer = this.container.querySelector('#profile-accordion-container');
        if (!accordionContainer) return;

        const user = this.app.state.user;

        // Define accordion sections
        const sections = [
            {
                id: 'orders',
                title: 'LỊCH SỬ ĐƠN HÀNG / ORDER HISTORY',
                icon: 'history',
                renderContent: () => this.getOrderHistoryHtml()
            },
            {
                id: 'profile',
                title: 'THÔNG TIN TÀI KHOẢN / PERSONAL DETAILS',
                icon: 'user',
                renderContent: () => this.getProfileEditHtml(user)
            },
            {
                id: 'password',
                title: 'THAY ĐỔI MẬT KHẨU / CHANGE PASSWORD',
                icon: 'lock',
                renderContent: () => this.getPasswordEditHtml()
            },
            {
                id: 'current_orders',
                title: 'ĐƠN HÀNG HIỆN TẠI / CURRENT ORDERS',
                icon: 'truck',
                renderContent: () => this.getCurrentOrdersHtml()
            }
        ];

        accordionContainer.innerHTML = sections.map(section => {
            const isOpen = this.activeSection === section.id;
            return `
                <div class="border border-borderMuted bg-white overflow-hidden select-none">
                    <!-- Header -->
                    <div class="accordion-header py-4 px-5 flex justify-between items-center bg-zinc-50 border-b ${isOpen ? 'border-borderMuted' : 'border-transparent'} cursor-pointer text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors" data-accordion-section="${section.id}">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="${section.icon}" class="w-4 h-4 text-zinc-500"></i>
                            <span>${section.title}</span>
                        </div>
                        <i data-lucide="chevron-down" class="w-4 h-4 text-zinc-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}"></i>
                    </div>
                    
                    <!-- Body Content -->
                    <div class="accordion-body grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] border-t border-borderMuted' : 'grid-rows-[0fr]'}">
                        <div class="overflow-hidden">
                            <div class="p-6 sm:p-8 space-y-6">
                                ${section.renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Bind events for accordion header click
        accordionContainer.querySelectorAll('[data-accordion-section]').forEach(header => {
            header.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-accordion-section');
                this.activeSection = (this.activeSection === section) ? '' : section;
                
                // Reset messaging states when switching panels
                this.profileMsg = { type: '', text: '' };
                this.passwordMsg = { type: '', text: '' };
                
                this.renderAccordion();
            });
        });

        this.bindAccordionEvents();
    }

    getOrderHistoryHtml() {
        if (this.loadingOrders) {
            return `
                <div class="flex flex-col items-center justify-center py-12 text-zinc-400">
                    <div class="spinner mb-3"></div>
                    <p class="text-xs uppercase tracking-widest">Đang tải lịch sử đơn hàng...</p>
                </div>
            `;
        }

        if (this.orders.length === 0) {
            return `
                <div class="text-center py-12 text-zinc-400 space-y-3">
                    <i data-lucide="shopping-bag" class="w-10 h-10 mx-auto text-zinc-350"></i>
                    <p class="text-xs uppercase tracking-wider font-semibold">Bạn chưa có đơn hàng nào.</p>
                    <a href="#shop" class="inline-block px-5 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-accent transition-colors">Mua sắm ngay</a>
                </div>
            `;
        }

        return `
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr class="border-b border-primary uppercase text-[10px] tracking-wider text-zinc-550">
                            <th class="py-3 px-2 font-bold">Mã Đơn</th>
                            <th class="py-3 px-2 font-bold">Ngày mua</th>
                            <th class="py-3 px-2 font-bold">Tổng tiền</th>
                            <th class="py-3 px-2 font-bold">Trạng thái</th>
                            <th class="py-3 px-2 font-bold text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-borderMuted font-light">
                        ${this.orders.map(order => {
                            const date = new Date(order.created_at).toLocaleDateString('vi-VN');
                            const statusColors = {
                                'pending': 'text-yellow-600 bg-yellow-50 border-yellow-100',
                                'processing': 'text-blue-600 bg-blue-50 border-blue-100',
                                'shipped': 'text-purple-600 bg-purple-50 border-purple-100',
                                'delivered': 'text-green-600 bg-green-50 border-green-100',
                                'cancelled': 'text-zinc-500 bg-zinc-50 border-zinc-150'
                            };

                            const badgeColor = statusColors[order.order_status] || 'text-zinc-650';

                            return `
                                <tr class="hover:bg-zinc-50 transition-colors">
                                    <td class="py-3.5 px-2 font-bold text-primary">
                                        <a href="#tracking?code=${order.order_code}" class="hover:text-accent hover:underline flex items-center">
                                            ${order.order_code}
                                            <i data-lucide="external-link" class="w-3 h-3 ml-1 text-zinc-400"></i>
                                        </a>
                                    </td>
                                    <td class="py-3.5 px-2 text-zinc-500">${date}</td>
                                    <td class="py-3.5 px-2 font-bold text-accent">${this.formatCurrency(order.total_amount)}</td>
                                    <td class="py-3.5 px-2">
                                        <span class="px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider rounded-sm ${badgeColor}">
                                            ${order.order_status}
                                        </span>
                                    </td>
                                    <td class="py-3.5 px-2 text-right">
                                        <a href="#tracking?code=${order.order_code}" class="px-3 py-1 bg-zinc-100 border border-borderMuted text-zinc-700 font-bold hover:bg-primary hover:text-white transition-colors duration-300">
                                            Chi Tiết
                                        </a>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    getProfileEditHtml(user) {
        let msgHtml = '';
        if (this.profileMsg.text) {
            const isError = this.profileMsg.type === 'error';
            msgHtml = `
                <div class="p-3.5 text-xs font-bold ${isError ? 'bg-red-50 text-red-700 border border-red-150' : 'bg-green-50 text-green-700 border border-green-150'}">
                    ${this.profileMsg.text}
                </div>
            `;
        }

        return `
            <form id="profile-edit-form" class="space-y-5 max-w-md">
                ${msgHtml}
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Họ và Tên *</label>
                    <input type="text" name="name" value="${user.name}" class="w-full border border-borderMuted p-3 text-xs focus:outline-none focus:border-primary font-medium" required />
                </div>
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email *</label>
                    <input type="email" name="email" value="${user.email}" class="w-full border border-borderMuted p-3 text-xs focus:outline-none focus:border-primary font-medium" required />
                </div>
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Số điện thoại *</label>
                    <input type="tel" name="phone" value="${user.phone || ''}" class="w-full border border-borderMuted p-3 text-xs focus:outline-none focus:border-primary font-medium" required />
                </div>
                <button type="submit" class="px-8 py-3 bg-primary text-white hover:bg-accent text-[10px] font-bold uppercase tracking-widest transition-colors duration-300">
                    Lưu Thay Đổi
                </button>
            </form>
        `;
    }

    getPasswordEditHtml() {
        let msgHtml = '';
        if (this.passwordMsg.text) {
            const isError = this.passwordMsg.type === 'error';
            msgHtml = `
                <div class="p-3.5 text-xs font-bold ${isError ? 'bg-red-50 text-red-700 border border-red-150' : 'bg-green-50 text-green-700 border border-green-150'}">
                    ${this.passwordMsg.text}
                </div>
            `;
        }

        return `
            <form id="password-edit-form" class="space-y-5 max-w-md">
                ${msgHtml}
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mật khẩu hiện tại *</label>
                    <input type="password" name="old_password" class="w-full border border-borderMuted p-3 text-xs focus:outline-none focus:border-primary font-medium" required />
                </div>
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mật khẩu mới *</label>
                    <input type="password" name="new_password" class="w-full border border-borderMuted p-3 text-xs focus:outline-none focus:border-primary font-medium" required />
                </div>
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Xác nhận mật khẩu mới *</label>
                    <input type="password" name="confirm_password" class="w-full border border-borderMuted p-3 text-xs focus:outline-none focus:border-primary font-medium" required />
                </div>
                <button type="submit" class="px-8 py-3 bg-primary text-white hover:bg-accent text-[10px] font-bold uppercase tracking-widest transition-colors duration-300">
                    Đổi Mật Khẩu
                </button>
            </form>
        `;
    }

    getCurrentOrdersHtml() {
        if (this.loadingOrders) {
            return `
                <div class="flex flex-col items-center justify-center py-12 text-zinc-400">
                    <div class="spinner mb-3"></div>
                    <p class="text-xs uppercase tracking-widest">Đang tải danh sách đơn hàng...</p>
                </div>
            `;
        }

        const activeOrders = this.orders.filter(order => 
            order.order_status === 'pending' || 
            order.order_status === 'processing' || 
            order.order_status === 'shipped'
        );

        if (activeOrders.length === 0) {
            return `
                <div class="text-center py-12 text-zinc-400 space-y-3">
                    <i data-lucide="package" class="w-10 h-10 mx-auto text-zinc-350"></i>
                    <p class="text-xs uppercase tracking-wider font-semibold">Bạn không có đơn hàng nào đang trong quá trình xử lý.</p>
                    <a href="#shop" class="inline-block px-5 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-accent transition-colors">Mua sắm ngay</a>
                </div>
            `;
        }

        return `
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr class="border-b border-primary uppercase text-[10px] tracking-wider text-zinc-550">
                            <th class="py-3 px-2 font-bold">Mã Đơn</th>
                            <th class="py-3 px-2 font-bold">Ngày mua</th>
                            <th class="py-3 px-2 font-bold">Tổng tiền</th>
                            <th class="py-3 px-2 font-bold">Trạng thái</th>
                            <th class="py-3 px-2 font-bold text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-borderMuted font-light">
                        ${activeOrders.map(order => {
                            const date = new Date(order.created_at).toLocaleDateString('vi-VN');
                            const statusColors = {
                                'pending': 'text-yellow-600 bg-yellow-50 border-yellow-100',
                                'processing': 'text-blue-600 bg-blue-50 border-blue-100',
                                'shipped': 'text-purple-600 bg-purple-50 border-purple-100'
                            };

                            const badgeColor = statusColors[order.order_status] || 'text-zinc-650';

                            return `
                                <tr class="hover:bg-zinc-50 transition-colors">
                                    <td class="py-3.5 px-2 font-bold text-primary">
                                        <a href="#tracking?code=${order.order_code}" class="hover:text-accent hover:underline flex items-center">
                                            ${order.order_code}
                                            <i data-lucide="external-link" class="w-3 h-3 ml-1 text-zinc-400"></i>
                                        </a>
                                    </td>
                                    <td class="py-3.5 px-2 text-zinc-500">${date}</td>
                                    <td class="py-3.5 px-2 font-bold text-accent">${this.formatCurrency(order.total_amount)}</td>
                                    <td class="py-3.5 px-2">
                                        <span class="px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider rounded-sm ${badgeColor}">
                                            ${order.order_status === 'pending' ? 'Chờ xác nhận' : order.order_status === 'processing' ? 'Đang chuẩn bị' : 'Đang giao hàng'}
                                        </span>
                                    </td>
                                    <td class="py-3.5 px-2 text-right">
                                        <a href="#tracking?code=${order.order_code}" class="px-3 py-1 bg-zinc-100 border border-borderMuted text-zinc-700 font-bold hover:bg-primary hover:text-white transition-colors duration-300">
                                            Theo Dõi
                                        </a>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    bindAccordionEvents() {
        // --- Profile Edit Form ---
        const profileForm = this.container.querySelector('#profile-edit-form');
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(profileForm);
                const payload = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                };

                try {
                    const res = await fetch('/api/auth/update-profile', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const data = await res.json();
                    if (data.success) {
                        this.profileMsg = { type: 'success', text: 'Cập nhật thông tin thành công!' };
                        // Update state in app
                        this.app.state.user = data.data;
                        // Re-render main to sync left column details
                        this.render();
                    } else {
                        this.profileMsg = { type: 'error', text: data.error || 'Cập nhật thất bại.' };
                        this.renderAccordion();
                    }
                } catch (err) {
                    this.profileMsg = { type: 'error', text: 'Lỗi kết nối máy chủ.' };
                    this.renderAccordion();
                }
            });
        }

        // --- Password Edit Form ---
        const passwordForm = this.container.querySelector('#password-edit-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(passwordForm);
                const oldPassword = formData.get('old_password');
                const newPassword = formData.get('new_password');
                const confirmPassword = formData.get('confirm_password');

                if (newPassword !== confirmPassword) {
                    this.passwordMsg = { type: 'error', text: 'Mật khẩu xác nhận không khớp!' };
                    this.renderAccordion();
                    return;
                }

                try {
                    const res = await fetch('/api/auth/change-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
                    });
                    const data = await res.json();
                    if (data.success) {
                        this.passwordMsg = { type: 'success', text: 'Thay đổi mật khẩu thành công!' };
                    } else {
                        this.passwordMsg = { type: 'error', text: data.error || 'Mật khẩu cũ không chính xác.' };
                    }
                    this.renderAccordion();
                } catch (err) {
                    this.passwordMsg = { type: 'error', text: 'Lỗi kết nối máy chủ.' };
                    this.renderAccordion();
                }
            });
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    bindEvents() {
        const logoutBtn = this.container.querySelector('#btn-account-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    const res = await fetch('/api/auth/logout', {
                        method: 'POST'
                    });
                    const data = await res.json();
                    if (data.success) {
                        this.app.state.user = null;
                        this.page.render();
                    }
                } catch (e) {
                    // Fail silently
                }
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
