/**
 * Section: Login & Register Toggle Forms
 */
import Button from '../../components/ui/button.js';

export default class AuthForm {
    constructor(app, page) {
        this.app = app;
        this.page = page;
        this.container = document.createElement('section');
        this.container.className = 'max-w-md mx-auto border border-borderMuted bg-white p-6 sm:p-8 shadow-sm';
        
        // Component state
        this.activeTab = 'login'; // 'login' or 'register'
        this.errorMsg = '';
        this.successMsg = '';
        this.submitting = false;
    }

    render() {
        this.container.innerHTML = `
            <!-- Tabs Header -->
            <div class="flex border-b border-borderMuted mb-6 text-sm font-bold uppercase tracking-wider">
                <button id="tab-login-btn" class="w-1/2 py-3 text-center border-b-2 transition-colors focus:outline-none ${this.activeTab === 'login' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-primary'}" data-track-cta="tab_login">Đăng Nhập</button>
                <button id="tab-register-btn" class="w-1/2 py-3 text-center border-b-2 transition-colors focus:outline-none ${this.activeTab === 'register' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-primary'}" data-track-cta="tab_register">Đăng Ký</button>
            </div>

            <!-- Messages -->
            ${this.errorMsg ? `<p class="text-xs text-accent font-bold mb-4 bg-accent/5 p-3 border border-accent/20">${this.errorMsg}</p>` : ''}
            ${this.successMsg ? `<p class="text-xs text-green-600 font-bold mb-4 bg-green-50 p-3 border border-green-200">${this.successMsg}</p>` : ''}

            <!-- Auth Form Content -->
            ${this.activeTab === 'login' ? this.renderLoginForm() : this.renderRegisterForm()}
        `;

        this.bindEvents();
        return this.container;
    }

    renderLoginForm() {
        return `
            <form id="auth-login-form" class="space-y-4">
                <div class="space-y-1">
                    <label for="login-email" class="text-[10px] font-bold uppercase text-zinc-500">Email *</label>
                    <input type="email" id="login-email" class="w-full border border-borderMuted p-3 text-sm focus:outline-none focus:border-primary font-medium" placeholder="yourname@gmail.com" required />
                </div>
                <div class="space-y-1">
                    <div class="flex justify-between items-center">
                        <label for="login-password" class="text-[10px] font-bold uppercase text-zinc-500">Mật khẩu *</label>
                        <a href="#account" class="text-[10px] text-zinc-400 hover:text-accent font-semibold">Quên mật khẩu?</a>
                    </div>
                    <div class="relative">
                        <input type="password" id="login-password" class="w-full border border-borderMuted p-3 pr-10 text-sm focus:outline-none focus:border-primary font-medium" placeholder="••••••••" required />
                        <button type="button" class="toggle-password-btn absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary focus:outline-none" data-target="login-password">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                <div class="pt-2">
                    ${Button.render(this.submitting ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP', 'primary', 'w-full py-3.5', 'id="btn-login-submit"')}
                </div>
                <p class="text-center text-[10px] text-zinc-500 font-light mt-4">Tài khoản demo test: <strong>customer1@gmail.com / customer123</strong></p>
            </form>
        `;
    }

    renderRegisterForm() {
        return `
            <form id="auth-register-form" class="space-y-4">
                <div class="space-y-1">
                    <label for="reg-name" class="text-[10px] font-bold uppercase text-zinc-500">Họ và Tên *</label>
                    <input type="text" id="reg-name" class="w-full border border-borderMuted p-3 text-sm focus:outline-none focus:border-primary font-medium" placeholder="Nguyễn Văn A" required />
                </div>
                <div class="space-y-1">
                    <label for="reg-email" class="text-[10px] font-bold uppercase text-zinc-500">Email *</label>
                    <input type="email" id="reg-email" class="w-full border border-borderMuted p-3 text-sm focus:outline-none focus:border-primary font-medium" placeholder="yourname@gmail.com" required />
                </div>
                <div class="space-y-1">
                    <label for="reg-phone" class="text-[10px] font-bold uppercase text-zinc-500">Số Điện Thoại *</label>
                    <input type="tel" id="reg-phone" class="w-full border border-borderMuted p-3 text-sm focus:outline-none focus:border-primary font-medium" placeholder="0901234567" required />
                </div>
                <div class="space-y-1">
                    <label for="reg-password" class="text-[10px] font-bold uppercase text-zinc-500">Mật khẩu *</label>
                    <div class="relative">
                        <input type="password" id="reg-password" class="w-full border border-borderMuted p-3 pr-10 text-sm focus:outline-none focus:border-primary font-medium" placeholder="Tối thiểu 6 ký tự" required />
                        <button type="button" class="toggle-password-btn absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary focus:outline-none" data-target="reg-password">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                <div class="pt-2">
                    ${Button.render(this.submitting ? 'Đang đăng ký...' : 'ĐĂNG KÝ TÀI KHOẢN', 'primary', 'w-full py-3.5', 'id="btn-register-submit"')}
                </div>
            </form>
        `;
    }

    bindEvents() {
        // Toggle password visibility
        const toggleBtns = this.container.querySelectorAll('.toggle-password-btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const input = this.container.querySelector(`#${targetId}`);
                if (input) {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    btn.innerHTML = isPassword 
                        ? `<i data-lucide="eye-off" class="w-4 h-4"></i>` 
                        : `<i data-lucide="eye" class="w-4 h-4"></i>`;
                    
                    if (window.lucide) {
                        window.lucide.createIcons();
                    }
                }
            });
        });

        // Tab switching
        const loginTab = this.container.querySelector('#tab-login-btn');
        const registerTab = this.container.querySelector('#tab-register-btn');

        if (loginTab && registerTab) {
            loginTab.addEventListener('click', () => {
                this.activeTab = 'login';
                this.errorMsg = '';
                this.successMsg = '';
                this.render();
            });
            registerTab.addEventListener('click', () => {
                this.activeTab = 'register';
                this.errorMsg = '';
                this.successMsg = '';
                this.render();
            });
        }

        // Login submit
        const loginForm = this.container.querySelector('#auth-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = this.container.querySelector('#login-email').value.trim();
                const password = this.container.querySelector('#login-password').value;

                this.submitting = true;
                this.errorMsg = '';
                this.render();

                try {
                    const res = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    const data = await res.json();

                    if (data.success) {
                        // Load User details and reload layout shell
                        await this.app.checkAuthStatus();
                        this.app.renderLayout();
                    } else {
                        this.errorMsg = data.error || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.';
                        this.submitting = false;
                        this.render();
                    }
                } catch (err) {
                    this.errorMsg = 'Lỗi kết nối máy chủ.';
                    this.submitting = false;
                    this.render();
                }
            });
        }

        // Register submit
        const regForm = this.container.querySelector('#auth-register-form');
        if (regForm) {
            regForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = this.container.querySelector('#reg-name').value.trim();
                const email = this.container.querySelector('#reg-email').value.trim();
                const phone = this.container.querySelector('#reg-phone').value.trim();
                const password = this.container.querySelector('#reg-password').value;

                if (password.length < 6) {
                    this.errorMsg = 'Mật khẩu phải chứa ít nhất 6 ký tự.';
                    this.render();
                    return;
                }

                this.submitting = true;
                this.errorMsg = '';
                this.render();

                try {
                    const res = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, phone, password })
                    });
                    const data = await res.json();

                    if (data.success) {
                        this.successMsg = 'Đăng ký thành công! Đang đăng nhập...';
                        await this.app.checkAuthStatus();
                        setTimeout(() => {
                            this.app.renderLayout();
                        }, 1200);
                    } else {
                        this.errorMsg = data.error || 'Đăng ký thất bại. Email có thể đã tồn tại.';
                        this.submitting = false;
                        this.render();
                    }
                } catch (err) {
                    this.errorMsg = 'Lỗi kết nối máy chủ.';
                    this.submitting = false;
                    this.render();
                }
            });
        }

        // Initialize Lucide icons on rendering forms
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}
