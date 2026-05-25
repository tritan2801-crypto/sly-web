/**
 * Page: Admin Dashboard Console (Completely Independent Layout - Premium Light Theme)
 */
import Button from '../../components/ui/button.js';

export default class AdminDashboard {
    constructor(app) {
        this.app = app;
        this.container = document.createElement('div');
        this.container.className = 'w-full min-h-screen bg-zinc-50 text-zinc-800 flex font-sans antialiased selection:bg-accent selection:text-white';

        // Admin local state
        this.activeTab = 'overview'; // 'overview', 'orders', 'behavior', 'products', 'categories'
        this.orders = [];
        this.logs = [];
        this.products = [];
        this.categories = [];
        this.loadingOrders = false;
        this.loadingLogs = false;
        this.loadingProducts = false;
        this.loadingCategories = false;
        this.actionMsg = '';

        // Modal & Editing States
        this.showProductModal = false;
        this.editingProduct = null;
        this.showCategoryModal = false;
        this.editingCategory = null;
        this.productSearch = '';
        this.productCategoryFilter = '';
    }

    render() {
        this.container.innerHTML = `
            <!-- Left Sidebar Navigation -->
            <aside class="w-64 border-r border-zinc-200 bg-white flex flex-col justify-between select-none">
                <div class="p-6 space-y-8">
                    <!-- Brand Header -->
                    <div class="space-y-1.5">
                        <div class="flex items-center space-x-2.5">
                            <span class="text-lg font-black tracking-widest text-zinc-900 uppercase">SLY</span>
                            <span class="bg-accent/10 border border-accent/20 text-accent text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-widest rounded-sm">ADMIN</span>
                        </div>
                        <p class="text-[9px] text-zinc-400 font-semibold uppercase tracking-widest flex items-center">
                            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block mr-1.5 animate-pulse"></span>
                            Live Telemetry Active
                        </p>
                    </div>

                    <!-- Sidebar Menu Links -->
                    <nav class="space-y-1">
                        <button id="admin-tab-overview" class="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-l-2 focus:outline-none ${this.activeTab === 'overview' ? 'bg-zinc-50 border-accent text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}" data-tab="overview">
                            <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                            <span>Tổng quan</span>
                        </button>
                        <button id="admin-tab-products" class="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-l-2 focus:outline-none ${this.activeTab === 'products' ? 'bg-zinc-50 border-accent text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}" data-tab="products">
                            <i data-lucide="shirt" class="w-4 h-4"></i>
                            <span>Sản phẩm</span>
                        </button>
                        <button id="admin-tab-categories" class="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-l-2 focus:outline-none ${this.activeTab === 'categories' ? 'bg-zinc-50 border-accent text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}" data-tab="categories">
                            <i data-lucide="folder" class="w-4 h-4"></i>
                            <span>Danh mục</span>
                        </button>
                        <button id="admin-tab-orders" class="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-l-2 focus:outline-none ${this.activeTab === 'orders' ? 'bg-zinc-50 border-accent text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}" data-tab="orders">
                            <i data-lucide="package" class="w-4 h-4"></i>
                            <span>Đơn hàng</span>
                        </button>
                        <button id="admin-tab-behavior" class="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-l-2 focus:outline-none ${this.activeTab === 'behavior' ? 'bg-zinc-50 border-accent text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}" data-tab="behavior">
                            <i data-lucide="activity" class="w-4 h-4"></i>
                            <span>Nhật ký Telemetry</span>
                        </button>
                    </nav>
                </div>

                <!-- Admin Session Footer -->
                <div class="p-6 border-t border-zinc-200 bg-zinc-50/50 space-y-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-xs text-zinc-650">A</div>
                        <div class="text-xs truncate">
                            <h4 class="font-extrabold text-zinc-800 truncate">${this.app.state.user?.name || 'SLY ADMIN'}</h4>
                            <p class="text-[9px] text-zinc-500 font-light truncate">${this.app.state.user?.email || 'admin@slyclothing.vn'}</p>
                        </div>
                    </div>
                    ${Button.render('QUAY LẠI STORE', 'secondary', 'w-full py-2.5 text-[9px] border border-zinc-200 hover:border-zinc-300 bg-white text-zinc-650 hover:text-zinc-900 font-bold uppercase tracking-widest transition-colors', 'id="admin-btn-logout"')}
                </div>
            </aside>

            <!-- Right Content Container -->
            <main class="flex-grow flex flex-col min-w-0 bg-zinc-50/30">
                <!-- Top Header Bar -->
                <header class="h-16 border-b border-zinc-200 px-8 flex justify-between items-center select-none bg-white">
                    <h2 class="text-xs font-black uppercase tracking-widest text-zinc-400">
                        ADMIN CONSOLE &gt; <span class="text-zinc-850">${this.activeTab === 'overview' ? 'TỔNG QUAN' : this.activeTab === 'orders' ? 'QUẢN LÝ ĐƠN HÀNG' : this.activeTab === 'behavior' ? 'TELEMETRY BEHAVIOR LOGS' : this.activeTab === 'products' ? 'QUẢN LÝ SẢN PHẨM' : 'QUẢN LÝ DANH MỤC'}</span>
                    </h2>
                    <div class="flex items-center space-x-4">
                        <span class="text-[10px] text-zinc-400 font-medium">PHP Session: <strong class="text-zinc-600 font-bold">${this.app.sessionId.substring(0, 12)}...</strong></span>
                        <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                    </div>
                </header>

                <!-- Page Content Area -->
                <div class="flex-grow p-8 overflow-y-auto">
                    ${this.actionMsg ? `
                        <div class="mb-6 p-4 bg-emerald-50 border border-emerald-250 rounded-sm text-xs font-bold text-emerald-700 flex items-center space-x-2">
                            <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600 flex-shrink-0"></i>
                            <span>${this.actionMsg}</span>
                        </div>
                    ` : ''}

                    ${this.activeTab === 'overview' ? this.renderOverview() : this.activeTab === 'orders' ? this.renderOrders() : this.activeTab === 'behavior' ? this.renderBehavior() : this.activeTab === 'products' ? this.renderProducts() : this.renderCategories()}
                </div>
            </main>

            <!-- Modals Overlay -->
            ${this.showProductModal ? this.renderProductModal() : ''}
            ${this.showCategoryModal ? this.renderCategoryModal() : ''}
        `;

        this.bindEvents();
        return this.container;
    }

    renderOverview() {
        // Calculate statistics
        const totalRevenue = this.orders.reduce((acc, order) => order.order_status !== 'cancelled' ? acc + parseFloat(order.total_amount) : acc, 0);
        const activeOrdersCount = this.orders.filter(order => order.order_status === 'pending' || order.order_status === 'processing' || order.order_status === 'shipped').length;
        const totalOrders = this.orders.length;
        const uniqueCustomers = new Set(this.orders.map(o => o.user_id || o.guest_email)).size;

        return `
            <div class="space-y-8 select-none">
                <!-- KPI Widgets Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Widget 1: Revenue -->
                    <div class="border border-zinc-200 p-6 bg-white shadow-sm space-y-4">
                        <div class="flex justify-between items-center text-zinc-400">
                            <span class="text-[10px] font-bold uppercase tracking-widest">TỔNG DOANH THU</span>
                            <i data-lucide="dollar-sign" class="w-4 h-4"></i>
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-xl font-black text-zinc-900">${this.formatCurrency(totalRevenue)}</h3>
                            <p class="text-[9px] text-zinc-400">Loại trừ đơn hàng bị huỷ</p>
                        </div>
                    </div>

                    <!-- Widget 2: Active orders -->
                    <div class="border border-zinc-200 p-6 bg-white shadow-sm space-y-4">
                        <div class="flex justify-between items-center text-zinc-400">
                            <span class="text-[10px] font-bold uppercase tracking-widest">ĐƠN ĐANG XỬ LÝ</span>
                            <i data-lucide="package" class="w-4 h-4"></i>
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-xl font-black text-zinc-900">${activeOrdersCount} Đơn hàng</h3>
                            <p class="text-[9px] text-zinc-400">Chờ duyệt, chuẩn bị &amp; giao</p>
                        </div>
                    </div>

                    <!-- Widget 3: Total orders -->
                    <div class="border border-zinc-200 p-6 bg-white shadow-sm space-y-4">
                        <div class="flex justify-between items-center text-zinc-400">
                            <span class="text-[10px] font-bold uppercase tracking-widest">TỔNG ĐƠN HÀNG</span>
                            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-xl font-black text-zinc-900">${totalOrders} Đơn</h3>
                            <p class="text-[9px] text-zinc-400">Bao gồm cả đơn huỷ &amp; hoàn tất</p>
                        </div>
                    </div>

                    <!-- Widget 4: Unique Customers -->
                    <div class="border border-zinc-200 p-6 bg-white shadow-sm space-y-4">
                        <div class="flex justify-between items-center text-zinc-400">
                            <span class="text-[10px] font-bold uppercase tracking-widest">KHÁCH HÀNG</span>
                            <i data-lucide="users" class="w-4 h-4"></i>
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-xl font-black text-zinc-900">${uniqueCustomers} Người</h3>
                            <p class="text-[9px] text-zinc-400">Cả tài khoản &amp; khách vãng lai</p>
                        </div>
                    </div>
                </div>

                <!-- Recent Activities & Mini Order List -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="border border-zinc-200 bg-white shadow-sm p-6 lg:col-span-2 space-y-4">
                        <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-550 border-b border-zinc-100 pb-2">Đơn hàng mới nhất</h4>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr class="border-b border-zinc-200 uppercase text-[9px] tracking-wider text-zinc-450 font-bold">
                                        <th class="py-2.5 px-2">Mã Đơn</th>
                                        <th class="py-2.5 px-2">Khách Hàng</th>
                                        <th class="py-2.5 px-2">Tổng tiền</th>
                                        <th class="py-2.5 px-2">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-zinc-150 font-light">
                                    ${this.orders.slice(0, 5).map(order => `
                                        <tr class="hover:bg-zinc-50 transition-colors">
                                            <td class="py-3 px-2 font-bold text-zinc-900">${order.order_code}</td>
                                            <td class="py-3 px-2 text-zinc-650 truncate max-w-[150px]">${order.customer_name || order.guest_name || 'Khách vãng lai'}</td>
                                            <td class="py-3 px-2 text-zinc-800 font-bold">${this.formatCurrency(order.total_amount)}</td>
                                            <td class="py-3 px-2">
                                                <span class="px-2 py-0.5 text-[8px] font-bold border uppercase tracking-wider rounded-sm ${this.getStatusBadgeClass(order.order_status)}">
                                                    ${order.order_status}
                                                </span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="border border-zinc-200 bg-white shadow-sm p-6 space-y-4">
                        <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-550 border-b border-zinc-100 pb-2">Lưu lượng Telemetry</h4>
                        <div class="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                            ${this.logs.slice(0, 5).map(log => `
                                <div class="p-3 border border-zinc-150 bg-zinc-50/50 space-y-1">
                                    <div class="flex justify-between text-[9px]">
                                        <span class="font-extrabold uppercase text-accent">${log.action_type}</span>
                                        <span class="text-zinc-400 font-medium">${new Date(log.created_at).toLocaleTimeString('vi-VN')}</span>
                                    </div>
                                    <p class="text-[10px] text-zinc-600 font-light truncate">Route: ${log.page_url}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderOrders() {
        if (this.loadingOrders) {
            return `
                <div class="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <div class="spinner border-zinc-300 border-t-zinc-600 mb-3"></div>
                    <p class="text-[10px] uppercase tracking-widest font-bold">Đang tải danh sách đơn hàng...</p>
                </div>
            `;
        }

        return `
            <div class="border border-zinc-200 bg-white shadow-sm p-6">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr class="border-b border-zinc-200 uppercase text-[9px] tracking-wider text-zinc-500 font-bold">
                                <th class="py-3 px-2">Mã Đơn</th>
                                <th class="py-3 px-2">Ngày đặt</th>
                                <th class="py-3 px-2">Khách Hàng / Liên Hệ</th>
                                <th class="py-3 px-2">Sản phẩm</th>
                                <th class="py-3 px-2">Địa Chỉ Nhận</th>
                                <th class="py-3 px-2">Tổng Thanh Toán</th>
                                <th class="py-3 px-2 text-right">Trạng Thái Đơn Hàng</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-150">
                            ${this.orders.map(order => {
                                const date = new Date(order.created_at).toLocaleDateString('vi-VN') + ' ' + new Date(order.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                                return `
                                    <tr class="hover:bg-zinc-50/50 transition-colors">
                                        <td class="py-4 px-2 font-bold text-zinc-900">${order.order_code}</td>
                                        <td class="py-4 px-2 text-zinc-400 font-light whitespace-nowrap">${date}</td>
                                        <td class="py-4 px-2 space-y-0.5">
                                            <p class="font-extrabold text-zinc-800 truncate max-w-[150px]">${order.customer_name || order.guest_name || 'Khách vãng lai'}</p>
                                            <p class="text-[10px] text-zinc-400 font-light truncate max-w-[150px]">${order.customer_email || order.guest_email || 'Không có email'}</p>
                                            <p class="text-[10px] text-zinc-450 font-light">${order.guest_phone || 'N/A'}</p>
                                        </td>
                                        <td class="py-4 px-2 space-y-1 text-zinc-650 font-light">
                                            ${order.items.map(item => `
                                                <div class="flex items-center space-x-1.5 text-[11px]">
                                                    <span class="text-zinc-400 font-bold">${item.quantity}x</span>
                                                    <span class="truncate max-w-[130px] inline-block text-zinc-700">${item.product_name}</span>
                                                    <span class="text-[8px] bg-zinc-100 px-1 border border-zinc-200 text-zinc-500 uppercase rounded-sm">${item.size}/${item.color}</span>
                                                </div>
                                            `).join('')}
                                        </td>
                                        <td class="py-4 px-2 text-zinc-600 font-light max-w-[160px] truncate" title="${order.shipping_address}">${order.shipping_address}</td>
                                        <td class="py-4 px-2 font-bold text-accent">${this.formatCurrency(order.total_amount)}</td>
                                        <td class="py-4 px-2 text-right">
                                            <select class="admin-status-select bg-white border border-zinc-200 text-zinc-750 font-bold text-[10px] uppercase py-1.5 px-3 tracking-wide cursor-pointer focus:outline-none focus:border-accent" data-order-id="${order.id}">
                                                <option value="pending" ${order.order_status === 'pending' ? 'selected' : ''}>Chờ duyệt (Pending)</option>
                                                <option value="processing" ${order.order_status === 'processing' ? 'selected' : ''}>Đang chuẩn bị (Processing)</option>
                                                <option value="shipped" ${order.order_status === 'shipped' ? 'selected' : ''}>Đang giao (Shipped)</option>
                                                <option value="delivered" ${order.order_status === 'delivered' ? 'selected' : ''}>Đã giao (Delivered)</option>
                                                <option value="cancelled" ${order.order_status === 'cancelled' ? 'selected' : ''}>Đã huỷ (Cancelled)</option>
                                            </select>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderBehavior() {
        if (this.loadingLogs) {
            return `
                <div class="flex flex-col items-center justify-center py-20 text-zinc-450">
                    <div class="spinner border-zinc-300 border-t-zinc-600 mb-3"></div>
                    <p class="text-[10px] uppercase tracking-widest font-bold">Đang tải nhật ký telemetry...</p>
                </div>
            `;
        }

        return `
            <div class="border border-zinc-200 bg-white shadow-sm p-6 space-y-6 select-none font-mono">
                <div class="flex justify-between items-center border-b border-zinc-100 pb-4">
                    <h3 class="text-xs font-bold text-zinc-600 uppercase tracking-widest font-sans">Nhật ký telemetry người dùng</h3>
                    <span class="text-[9px] bg-accent/10 border border-accent/20 text-accent font-extrabold px-2 py-0.5 rounded-sm">100 EVENTS CAPTURED</span>
                </div>

                <div class="bg-zinc-50 border border-zinc-200 p-4 max-h-[500px] overflow-y-auto space-y-2.5 text-xs text-zinc-700">
                    ${this.logs.map(log => {
                        const date = new Date(log.created_at).toLocaleTimeString('vi-VN');
                        const payloadStr = log.payload ? JSON.stringify(log.payload) : '{}';
                        return `
                            <div class="flex items-start space-x-2 border-b border-zinc-150 pb-2">
                                <span class="text-zinc-400 font-bold flex-shrink-0">[${date}]</span>
                                <span class="text-accent font-bold uppercase flex-shrink-0">${log.action_type}</span>
                                <div class="flex-grow space-y-0.5 min-w-0">
                                    <p class="text-zinc-800 truncate">URL: <span class="text-zinc-650 font-medium">${log.page_url}</span> ${log.element_id ? `| Target: <span class="text-emerald-650 font-black">${log.element_id}</span>` : ''}</p>
                                    <p class="text-[10px] text-zinc-450 font-light truncate">Payload: ${payloadStr}</p>
                                    <p class="text-[9px] text-zinc-400 font-light">Session: ${log.session_id} ${log.user_id ? `| User ID: ${log.user_id}` : ''}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    async fetchOrders() {
        this.loadingOrders = true;
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            if (data.success) {
                this.orders = data.data || [];
            }
        } catch (e) {
            this.orders = [];
        } finally {
            this.loadingOrders = false;
            this.render();
        }
    }

    async fetchLogs() {
        this.loadingLogs = true;
        try {
            const res = await fetch('/api/admin/analytics');
            const data = await res.json();
            if (data.success) {
                this.logs = data.data || [];
            }
        } catch (e) {
            this.logs = [];
        } finally {
            this.loadingLogs = false;
            this.render();
        }
    }

    async updateOrderStatus(orderId, status) {
        try {
            const res = await fetch('/api/admin/orders/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: orderId, status: status })
            });
            const data = await res.json();
            if (data.success) {
                this.actionMsg = `Cập nhật trạng thái đơn hàng #${orderId} thành "${status}" thành công!`;
                // Refresh local order list properties
                const found = this.orders.find(o => parseInt(o.id) === orderId);
                if (found) found.order_status = status;
                
                this.render();
                
                // Clear notification message after 3 seconds
                setTimeout(() => {
                    this.actionMsg = '';
                    this.render();
                }, 3000);
            }
        } catch (e) {
            // Fail silently
        }
    }

    bindEvents() {
        // Tab click toggles
        const tabs = ['overview', 'orders', 'behavior', 'products', 'categories'];
        tabs.forEach(tab => {
            const btn = this.container.querySelector(`#admin-tab-${tab}`);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.activeTab = tab;
                    this.actionMsg = '';
                    if (tab === 'orders') {
                        this.fetchOrders();
                    } else if (tab === 'behavior') {
                        this.fetchLogs();
                    } else if (tab === 'products') {
                        this.fetchAdminProducts();
                        this.fetchCategories();
                    } else if (tab === 'categories') {
                        this.fetchCategories();
                    } else {
                        this.render();
                    }
                });
            }
        });

        // Logout
        const logoutBtn = this.container.querySelector('#admin-btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    this.app.state.user = null;
                    // Reset URL hash to storefront home
                    window.location.hash = '#home';
                    // Re-render layout back to standard storefront
                    this.app.renderLayout();
                } catch (e) {
                    // Fail silently
                }
            });
        }

        // Status select dropdown change
        const selects = this.container.querySelectorAll('.admin-status-select');
        selects.forEach(select => {
            select.addEventListener('change', (e) => {
                const orderId = parseInt(e.target.getAttribute('data-order-id'));
                const newStatus = e.target.value;
                this.updateOrderStatus(orderId, newStatus);
            });
        });

        // Product Search & Filter
        const searchInput = this.container.querySelector('#admin-prod-search');
        if (searchInput) {
            searchInput.value = this.productSearch;
            searchInput.addEventListener('keyup', (e) => {
                this.productSearch = e.target.value;
            });
            searchInput.addEventListener('change', (e) => {
                this.productSearch = e.target.value;
                this.render();
            });
        }
        const catFilter = this.container.querySelector('#admin-prod-cat-filter');
        if (catFilter) {
            catFilter.value = this.productCategoryFilter;
            catFilter.addEventListener('change', (e) => {
                this.productCategoryFilter = e.target.value;
                this.render();
            });
        }

        // Add Product Trigger
        const addProdBtn = this.container.querySelector('#admin-btn-add-product');
        if (addProdBtn) {
            addProdBtn.addEventListener('click', () => {
                this.editingProduct = null;
                this.showProductModal = true;
                this.render();
            });
        }

        // Add Category Trigger
        const addCatBtn = this.container.querySelector('#admin-btn-add-category');
        if (addCatBtn) {
            addCatBtn.addEventListener('click', () => {
                this.editingCategory = null;
                this.showCategoryModal = true;
                this.render();
            });
        }

        // Edit Product Trigger
        const editProdBtns = this.container.querySelectorAll('.admin-prod-edit-btn');
        editProdBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const prod = this.products.find(p => parseInt(p.id) === id);
                if (prod) {
                    this.editingProduct = prod;
                    this.showProductModal = true;
                    this.render();
                }
            });
        });

        // Delete Product Trigger
        const deleteProdBtns = this.container.querySelectorAll('.admin-prod-delete-btn');
        deleteProdBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                if (confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) {
                    this.deleteProduct(id);
                }
            });
        });

        // Edit Category Trigger
        const editCatBtns = this.container.querySelectorAll('.admin-cat-edit-btn');
        editCatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const cat = this.categories.find(c => parseInt(c.id) === id);
                if (cat) {
                    this.editingCategory = cat;
                    this.showCategoryModal = true;
                    this.render();
                }
            });
        });

        // Delete Category Trigger
        const deleteCatBtns = this.container.querySelectorAll('.admin-cat-delete-btn');
        deleteCatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                if (confirm('Bạn có chắc chắn muốn xoá danh mục này?')) {
                    this.deleteCategory(id);
                }
            });
        });

        // Modal Close triggers
        const closeProductModal = this.container.querySelector('#admin-product-modal-close');
        if (closeProductModal) {
            closeProductModal.addEventListener('click', () => {
                this.showProductModal = false;
                this.editingProduct = null;
                this.render();
            });
        }
        const closeCategoryModal = this.container.querySelector('#admin-category-modal-close');
        if (closeCategoryModal) {
            closeCategoryModal.addEventListener('click', () => {
                this.showCategoryModal = false;
                this.editingCategory = null;
                this.render();
            });
        }

        // Product Modal dynamic inputs
        const addVarBtn = this.container.querySelector('#btn-prod-add-variant');
        if (addVarBtn) {
            addVarBtn.addEventListener('click', () => {
                const container = this.container.querySelector('#prod-variants-container');
                if (container) {
                    const row = document.createElement('div');
                    row.className = 'grid grid-cols-4 gap-2 variant-row mt-2';
                    row.innerHTML = `
                        <input type="text" placeholder="Size (S, M, L)" class="var-size border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium uppercase" required />
                        <input type="text" placeholder="Màu sắc" class="var-color border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium" />
                        <input type="number" placeholder="Kho" class="var-stock border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium" min="0" value="0" required />
                        <input type="text" placeholder="SKU" class="var-sku border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium uppercase" />
                    `;
                    container.appendChild(row);
                }
            });
        }
        const addImgBtn = this.container.querySelector('#btn-prod-add-image');
        if (addImgBtn) {
            addImgBtn.addEventListener('click', () => {
                const container = this.container.querySelector('#prod-images-container');
                if (container) {
                    const input = document.createElement('input');
                    input.type = 'url';
                    input.placeholder = 'https://example.com/image.jpg';
                    input.className = 'prod-image-url w-full border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium mt-2';
                    container.appendChild(input);
                }
            });
        }

        // Product Modal Save submit
        const productForm = this.container.querySelector('#admin-product-form');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProduct();
            });
        }

        // Category Modal Save submit
        const categoryForm = this.container.querySelector('#admin-category-form');
        if (categoryForm) {
            categoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCategory();
            });
        }

        // Initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    getStatusBadgeClass(status) {
        switch (status) {
            case 'pending': return 'text-yellow-700 border-yellow-200 bg-yellow-50';
            case 'processing': return 'text-blue-750 border-blue-200 bg-blue-50';
            case 'shipped': return 'text-purple-750 border-purple-200 bg-purple-50';
            case 'delivered': return 'text-emerald-700 border-emerald-200 bg-emerald-50';
            case 'cancelled': return 'text-zinc-550 border-zinc-200 bg-zinc-50';
            default: return 'text-zinc-600 border-zinc-200';
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
    }

    mount() {
        if (this.orders.length === 0) {
            this.fetchOrders();
        }
        if (this.logs.length === 0) {
            this.fetchLogs();
        }
        this.fetchAdminProducts();
        this.fetchCategories();
    }

    async fetchAdminProducts() {
        this.loadingProducts = true;
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            if (data.success) {
                this.products = data.data || [];
            }
        } catch (e) {
            this.products = [];
        } finally {
            this.loadingProducts = false;
            this.render();
        }
    }

    async fetchCategories() {
        this.loadingCategories = true;
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (data.success) {
                this.categories = data.data || [];
            }
        } catch (e) {
            this.categories = [];
        } finally {
            this.loadingCategories = false;
            this.render();
        }
    }

    async saveProduct() {
        const form = this.container.querySelector('#admin-product-form');
        if (!form) return;

        const formData = new FormData(form);
        const isNew = form.querySelector('#prod-is-new').checked;
        const isSale = form.querySelector('#prod-is-sale').checked;

        // Collect variants
        const variants = [];
        const variantRows = this.container.querySelectorAll('.variant-row');
        variantRows.forEach(row => {
            const sizeInput = row.querySelector('.var-size');
            if (!sizeInput) return; // Header row
            const size = sizeInput.value.trim();
            const color = row.querySelector('.var-color').value.trim();
            const stock = parseInt(row.querySelector('.var-stock').value || 0);
            const sku = row.querySelector('.var-sku').value.trim();
            if (size) {
                variants.push({ size, color, stock, sku });
            }
        });

        // Collect images
        const images = [];
        const imageInputs = this.container.querySelectorAll('.prod-image-url');
        imageInputs.forEach(input => {
            const url = input.value.trim();
            if (url) {
                images.push(url);
            }
        });

        const payload = {
            id: this.editingProduct ? this.editingProduct.id : null,
            name: formData.get('name').trim(),
            category_id: formData.get('category_id'),
            price: parseFloat(formData.get('price')),
            sale_price: formData.get('sale_price') ? parseFloat(formData.get('sale_price')) : null,
            description: formData.get('description').trim(),
            status: formData.get('status'),
            is_new: isNew,
            is_sale: isSale,
            variants: variants,
            images: images
        };

        const endpoint = this.editingProduct ? '/api/admin/products/update' : '/api/admin/products/create';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                this.actionMsg = this.editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Tạo sản phẩm mới thành công!';
                this.showProductModal = false;
                this.editingProduct = null;
                this.fetchAdminProducts();
                
                setTimeout(() => {
                    this.actionMsg = '';
                    this.render();
                }, 3000);
            } else {
                alert('Lỗi: ' + data.error);
            }
        } catch (e) {
            alert('Lỗi kết nối máy chủ.');
        }
    }

    async deleteProduct(id) {
        try {
            const res = await fetch('/api/admin/products/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            const data = await res.json();
            if (data.success) {
                this.actionMsg = 'Xoá sản phẩm thành công!';
                this.fetchAdminProducts();
                setTimeout(() => {
                    this.actionMsg = '';
                    this.render();
                }, 3000);
            } else {
                alert('Lỗi: ' + data.error);
            }
        } catch (e) {
            alert('Lỗi kết nối máy chủ.');
        }
    }

    async saveCategory() {
        const form = this.container.querySelector('#admin-category-form');
        if (!form) return;

        const formData = new FormData(form);
        const payload = {
            id: this.editingCategory ? this.editingCategory.id : null,
            name: formData.get('name').trim(),
            description: formData.get('description').trim(),
            parent_id: formData.get('parent_id')
        };

        const endpoint = this.editingCategory ? '/api/admin/categories/update' : '/api/admin/categories/create';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                this.actionMsg = this.editingCategory ? 'Cập nhật danh mục thành công!' : 'Tạo danh mục mới thành công!';
                this.showCategoryModal = false;
                this.editingCategory = null;
                this.fetchCategories();
                
                setTimeout(() => {
                    this.actionMsg = '';
                    this.render();
                }, 3000);
            } else {
                alert('Lỗi: ' + data.error);
            }
        } catch (e) {
            alert('Lỗi kết nối máy chủ.');
        }
    }

    async deleteCategory(id) {
        try {
            const res = await fetch('/api/admin/categories/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            const data = await res.json();
            if (data.success) {
                this.actionMsg = 'Xoá danh mục thành công!';
                this.fetchCategories();
                setTimeout(() => {
                    this.actionMsg = '';
                    this.render();
                }, 3000);
            } else {
                alert('Lỗi: ' + data.error);
            }
        } catch (e) {
            alert('Lỗi kết nối máy chủ.');
        }
    }

    renderProducts() {
        if (this.loadingProducts) {
            return `
                <div class="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <div class="spinner border-zinc-300 border-t-zinc-600 mb-3"></div>
                    <p class="text-[10px] uppercase tracking-widest font-bold">Đang tải danh sách sản phẩm...</p>
                </div>
            `;
        }

        const filtered = this.products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(this.productSearch.toLowerCase()) || p.slug.toLowerCase().includes(this.productSearch.toLowerCase());
            const matchesCategory = !this.productCategoryFilter || parseInt(p.category_id) === parseInt(this.productCategoryFilter);
            return matchesSearch && matchesCategory;
        });

        return `
            <div class="space-y-6 select-none animate-fadeIn">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div class="flex flex-1 gap-3 max-w-lg">
                        <input type="text" id="admin-prod-search" placeholder="Tìm sản phẩm theo tên hoặc slug..." class="w-full border border-zinc-200 p-2.5 text-xs focus:outline-none focus:border-accent font-medium bg-white" />
                        <select id="admin-prod-cat-filter" class="border border-zinc-200 p-2.5 text-xs focus:outline-none focus:border-accent font-bold uppercase tracking-wide bg-white">
                            <option value="">Tất cả danh mục</option>
                            ${this.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <button id="admin-btn-add-product" class="px-5 py-2.5 bg-primary text-white hover:bg-accent font-bold text-xs uppercase tracking-widest transition-colors duration-300">
                        Thêm sản phẩm mới
                    </button>
                </div>

                <div class="border border-zinc-200 bg-white shadow-sm p-6">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr class="border-b border-zinc-200 uppercase text-[9px] tracking-wider text-zinc-500 font-bold">
                                    <th class="py-3 px-2">Hình ảnh</th>
                                    <th class="py-3 px-2">Tên sản phẩm / Slug</th>
                                    <th class="py-3 px-2">Danh mục</th>
                                    <th class="py-3 px-2">Giá bán</th>
                                    <th class="py-3 px-2">Trạng thái</th>
                                    <th class="py-3 px-2 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-zinc-150">
                                ${filtered.map(p => {
                                    const mainImg = p.images && p.images[0] ? p.images[0].image_url : 'https://placehold.co/120x160?text=No+Image';
                                    const priceHtml = p.sale_price 
                                        ? `<p class="font-bold text-accent">${this.formatCurrency(p.sale_price)}</p><p class="text-[10px] text-zinc-400 line-through">${this.formatCurrency(p.price)}</p>`
                                        : `<p class="font-bold text-zinc-900">${this.formatCurrency(p.price)}</p>`;
                                    
                                    let statusBadge = '';
                                    if (p.status === 'active') {
                                        statusBadge = '<span class="px-2 py-0.5 text-[8px] font-bold border border-emerald-250 bg-emerald-50 text-emerald-700 uppercase tracking-wider rounded-sm">Active</span>';
                                    } else if (p.status === 'draft') {
                                        statusBadge = '<span class="px-2 py-0.5 text-[8px] font-bold border border-zinc-200 bg-zinc-50 text-zinc-550 uppercase tracking-wider rounded-sm">Draft</span>';
                                    } else {
                                        statusBadge = '<span class="px-2 py-0.5 text-[8px] font-bold border border-red-200 bg-red-50 text-red-700 uppercase tracking-wider rounded-sm">Out of Stock</span>';
                                    }

                                    return `
                                        <tr class="hover:bg-zinc-50/50 transition-colors">
                                            <td class="py-3 px-2">
                                                <img src="${mainImg}" alt="${p.name}" class="w-10 h-13 object-cover border border-zinc-200 rounded-sm" />
                                            </td>
                                            <td class="py-3 px-2 space-y-0.5">
                                                <h4 class="font-extrabold text-zinc-800">${p.name}</h4>
                                                <p class="text-[10px] text-zinc-400 font-mono font-light">${p.slug}</p>
                                            </td>
                                            <td class="py-3 px-2 text-zinc-650 font-medium">${p.category_name || 'Không có'}</td>
                                            <td class="py-3 px-2 space-y-0.5">${priceHtml}</td>
                                            <td class="py-3 px-2">${statusBadge}</td>
                                            <td class="py-3 px-2 text-right space-x-2 whitespace-nowrap">
                                                <button class="admin-prod-edit-btn px-2.5 py-1.5 bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold hover:bg-primary hover:text-white transition-colors duration-300" data-id="${p.id}">
                                                    Sửa
                                                </button>
                                                <button class="admin-prod-delete-btn px-2.5 py-1.5 bg-zinc-150 text-accent font-bold hover:bg-accent hover:text-white transition-colors duration-300" data-id="${p.id}">
                                                    Xoá
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderCategories() {
        if (this.loadingCategories) {
            return `
                <div class="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <div class="spinner border-zinc-300 border-t-zinc-600 mb-3"></div>
                    <p class="text-[10px] uppercase tracking-widest font-bold">Đang tải danh sách danh mục...</p>
                </div>
            `;
        }

        return `
            <div class="space-y-6 select-none animate-fadeIn">
                <div class="flex justify-end">
                    <button id="admin-btn-add-category" class="px-5 py-2.5 bg-primary text-white hover:bg-accent font-bold text-xs uppercase tracking-widest transition-colors duration-300">
                        Thêm danh mục mới
                    </button>
                </div>

                <div class="border border-zinc-200 bg-white shadow-sm p-6">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr class="border-b border-zinc-200 uppercase text-[9px] tracking-wider text-zinc-500 font-bold">
                                    <th class="py-3 px-2">ID</th>
                                    <th class="py-3 px-2">Tên danh mục</th>
                                    <th class="py-3 px-2">Slug</th>
                                    <th class="py-3 px-2">Mô tả</th>
                                    <th class="py-3 px-2">Danh mục cha</th>
                                    <th class="py-3 px-2 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-zinc-150">
                                ${this.categories.map(c => {
                                    const parent = this.categories.find(p => parseInt(p.id) === parseInt(c.parent_id));
                                    return `
                                        <tr class="hover:bg-zinc-50/50 transition-colors">
                                            <td class="py-3.5 px-2 text-zinc-400 font-bold">${c.id}</td>
                                            <td class="py-3.5 px-2 font-extrabold text-zinc-800">${c.name}</td>
                                            <td class="py-3.5 px-2 text-zinc-500 font-mono">${c.slug}</td>
                                            <td class="py-3.5 px-2 text-zinc-500 font-light truncate max-w-[200px]" title="${c.description || ''}">${c.description || '<span class="text-zinc-300 font-normal">Trống</span>'}</td>
                                            <td class="py-3.5 px-2 text-zinc-650 font-semibold">${parent ? parent.name : '<span class="text-zinc-400 font-normal">-</span>'}</td>
                                            <td class="py-3.5 px-2 text-right space-x-2 whitespace-nowrap">
                                                <button class="admin-cat-edit-btn px-2.5 py-1.5 bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold hover:bg-primary hover:text-white transition-colors duration-300" data-id="${c.id}">
                                                    Sửa
                                                </button>
                                                <button class="admin-cat-delete-btn px-2.5 py-1.5 bg-zinc-150 text-accent font-bold hover:bg-accent hover:text-white transition-colors duration-300" data-id="${c.id}">
                                                    Xoá
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderProductModal() {
        const prod = this.editingProduct || {
            name: '', category_id: '', price: '', sale_price: '', description: '',
            status: 'active', is_new: true, is_sale: false, variants: [], images: []
        };

        const isEdit = !!this.editingProduct;

        return `
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div class="bg-white border border-zinc-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl p-6 sm:p-8 space-y-6 relative rounded-sm">
                    <button id="admin-product-modal-close" class="absolute top-4 right-4 text-zinc-400 hover:text-primary focus:outline-none">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>

                    <div class="space-y-1.5 border-b border-zinc-100 pb-4">
                        <span class="text-[9px] text-zinc-450 font-bold uppercase tracking-widest">${isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</span>
                        <h2 class="text-lg font-black uppercase tracking-wider text-zinc-900">${isEdit ? 'Chỉnh sửa chi tiết sản phẩm' : 'Tạo mới sản phẩm'}</h2>
                    </div>

                    <form id="admin-product-form" class="space-y-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">Tên sản phẩm *</label>
                                <input type="text" name="name" value="${prod.name}" class="w-full border border-zinc-200 p-2.5 text-xs focus:outline-none focus:border-accent font-medium" required />
                            </div>

                            <div class="space-y-1">
                                <label class="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">Danh mục</label>
                                <select name="category_id" class="w-full border border-zinc-200 p-2.5 text-xs focus:outline-none focus:border-accent font-bold uppercase tracking-wide bg-white">
                                    <option value="">Không có</option>
                                    ${this.categories.map(c => `<option value="${c.id}" ${parseInt(c.id) === parseInt(prod.category_id) ? 'selected' : ''}>${c.name}</option>`).join('')}
                                </select>
                            </div>

                            <div class="space-y-1">
                                <label class="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">Giá bán (đ) *</label>
                                <input type="number" name="price" value="${prod.price}" class="w-full border border-zinc-200 p-2.5 text-xs focus:outline-none focus:border-accent font-medium" min="0" required />
                            </div>

                            <div class="space-y-1">
                                <label class="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">Giá khuyến mãi (đ)</label>
                                <input type="number" name="sale_price" value="${prod.sale_price || ''}" class="w-full border border-zinc-200 p-2.5 text-xs focus:outline-none focus:border-accent font-medium" min="0" />
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">Mô tả sản phẩm</label>
                            <textarea name="description" class="w-full border border-zinc-200 p-2.5 text-xs focus:outline-none focus:border-accent font-medium h-24 resize-y">${prod.description || ''}</textarea>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                            <div class="space-y-1">
                                <label class="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">Trạng thái</label>
                                <select name="status" class="w-full border border-zinc-200 p-2.5 text-xs focus:outline-none focus:border-accent font-bold uppercase tracking-wide bg-white">
                                    <option value="active" ${prod.status === 'active' ? 'selected' : ''}>Kinh doanh (Active)</option>
                                    <option value="draft" ${prod.status === 'draft' ? 'selected' : ''}>Nháp (Draft)</option>
                                    <option value="out_of_stock" ${prod.status === 'out_of_stock' ? 'selected' : ''}>Hết hàng (Out of stock)</option>
                                </select>
                            </div>

                            <div class="flex items-center space-x-2 pt-4">
                                <input type="checkbox" id="prod-is-new" ${prod.is_new ? 'checked' : ''} class="w-4 h-4 border-zinc-200 text-accent focus:ring-accent" />
                                <label for="prod-is-new" class="text-[10px] font-bold text-zinc-650 uppercase tracking-wider cursor-pointer">Sản phẩm mới (New)</label>
                            </div>

                            <div class="flex items-center space-x-2 pt-4">
                                <input type="checkbox" id="prod-is-sale" ${prod.is_sale ? 'checked' : ''} class="w-4 h-4 border-zinc-200 text-accent focus:ring-accent" />
                                <label for="prod-is-sale" class="text-[10px] font-bold text-zinc-650 uppercase tracking-wider cursor-pointer">Khuyến mãi (Sale)</label>
                            </div>
                        </div>

                        <!-- Product Image URLs Section -->
                        <div class="space-y-3 pt-2">
                            <div class="flex justify-between items-center border-b border-zinc-100 pb-2">
                                <h4 class="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Hình ảnh sản phẩm (URLs)</h4>
                                <button type="button" id="btn-prod-add-image" class="text-[9px] font-bold text-accent border border-accent/25 hover:bg-accent/5 px-2.5 py-1 rounded-sm uppercase tracking-wider transition-colors duration-200">Thêm ảnh</button>
                            </div>
                            <div id="prod-images-container" class="space-y-2">
                                ${prod.images && prod.images.length > 0
                                    ? prod.images.map(img => `<input type="url" placeholder="https://example.com/image.jpg" value="${img.image_url}" class="prod-image-url w-full border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium mt-2" />`).join('')
                                    : '<input type="url" placeholder="https://example.com/image.jpg" class="prod-image-url w-full border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium mt-2" />'
                                }
                            </div>
                        </div>

                        <!-- Product Variants Section -->
                        <div class="space-y-3 pt-2">
                            <div class="flex justify-between items-center border-b border-zinc-100 pb-2">
                                <h4 class="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Thuộc tính & Phân loại (Variants)</h4>
                                <button type="button" id="btn-prod-add-variant" class="text-[9px] font-bold text-accent border border-accent/25 hover:bg-accent/5 px-2.5 py-1 rounded-sm uppercase tracking-wider transition-colors duration-200">Thêm phân loại</button>
                            </div>
                            <div id="prod-variants-container" class="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                <div class="grid grid-cols-4 gap-2 text-[9px] font-bold uppercase tracking-wider text-zinc-400 select-none pb-1">
                                    <span>Size *</span>
                                    <span>Màu sắc</span>
                                    <span>Số lượng kho *</span>
                                    <span>SKU</span>
                                </div>
                                ${prod.variants && prod.variants.length > 0
                                    ? prod.variants.map(v => `
                                        <div class="grid grid-cols-4 gap-2 variant-row mt-2">
                                            <input type="text" placeholder="Size (S, M, L)" value="${v.size}" class="var-size border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium uppercase" required />
                                            <input type="text" placeholder="Màu sắc" value="${v.color || ''}" class="var-color border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium" />
                                            <input type="number" placeholder="Kho" value="${v.stock}" class="var-stock border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium" min="0" required />
                                            <input type="text" placeholder="SKU" value="${v.sku}" class="var-sku border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium uppercase" />
                                        </div>
                                    `).join('')
                                    : `
                                        <div class="grid grid-cols-4 gap-2 variant-row mt-2">
                                            <input type="text" placeholder="Size (S, M, L)" class="var-size border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium uppercase" required />
                                            <input type="text" placeholder="Màu sắc" class="var-color border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium" />
                                            <input type="number" placeholder="Kho" class="var-stock border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium" min="0" value="0" required />
                                            <input type="text" placeholder="SKU" class="var-sku border border-zinc-200 p-2 text-xs focus:outline-none focus:border-accent font-medium uppercase" />
                                        </div>
                                    `
                                }
                            </div>
                        </div>

                        <div class="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                            <button type="button" id="admin-product-modal-close" class="px-5 py-2.5 bg-zinc-100 border border-zinc-200 text-zinc-700 hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest transition-colors duration-200">Huỷ</button>
                            <button type="submit" class="px-5 py-2.5 bg-primary text-white hover:bg-accent text-xs font-bold uppercase tracking-widest transition-colors duration-200">Lưu sản phẩm</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    renderCategoryModal() {
        const cat = this.editingCategory || {
            name: '', parent_id: '', description: ''
        };

        const isEdit = !!this.editingCategory;

        return `
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div class="bg-white border border-zinc-200 w-full max-w-md shadow-xl p-6 sm:p-8 space-y-6 relative rounded-sm">
                    <button id="admin-category-modal-close" class="absolute top-4 right-4 text-zinc-400 hover:text-primary focus:outline-none">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>

                    <div class="space-y-1.5 border-b border-zinc-100 pb-4">
                        <span class="text-[9px] text-zinc-450 font-bold uppercase tracking-widest">${isEdit ? 'Cập nhật danh mục' : 'Thêm danh mục'}</span>
                        <h2 class="text-lg font-black uppercase tracking-wider text-zinc-900">${isEdit ? 'Chỉnh sửa chi tiết danh mục' : 'Tạo mới danh mục'}</h2>
                    </div>

                    <form id="admin-category-form" class="space-y-5">
                        <div class="space-y-1">
                            <label class="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">Tên danh mục *</label>
                            <input type="text" name="name" value="${cat.name}" class="w-full border border-zinc-200 p-2.5 text-xs focus:outline-none focus:border-accent font-medium" required />
                        </div>

                        <div class="space-y-1">
                            <label class="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">Danh mục cha</label>
                            <select name="parent_id" class="w-full border border-zinc-200 p-2.5 text-xs focus:outline-none focus:border-accent font-bold uppercase tracking-wide bg-white">
                                <option value="">Không có (Danh mục gốc)</option>
                                ${this.categories.filter(c => !isEdit || parseInt(c.id) !== parseInt(cat.id)).map(c => `<option value="${c.id}" ${parseInt(c.id) === parseInt(cat.parent_id) ? 'selected' : ''}>${c.name}</option>`).join('')}
                            </select>
                        </div>

                        <div class="space-y-1">
                            <label class="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">Mô tả danh mục</label>
                            <textarea name="description" class="w-full border border-zinc-200 p-2.5 text-xs focus:outline-none focus:border-accent font-medium h-24 resize-y">${cat.description || ''}</textarea>
                        </div>

                        <div class="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                            <button type="button" id="admin-category-modal-close" class="px-5 py-2.5 bg-zinc-100 border border-zinc-200 text-zinc-700 hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest transition-colors duration-200">Huỷ</button>
                            <button type="submit" class="px-5 py-2.5 bg-primary text-white hover:bg-accent text-xs font-bold uppercase tracking-widest transition-colors duration-200">Lưu danh mục</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
}
