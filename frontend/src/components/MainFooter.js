/**
 * Global Footer Component for SLY CLOTHING
 */
export default class MainFooter {
    constructor() {
        this.container = document.createElement('footer');
        this.container.className = 'bg-primary text-white border-t border-zinc-800 py-12 sm:py-16 mt-auto';
    }

    render() {
        this.container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                    
                    <!-- Column 1: Company details -->
                    <div class="space-y-4">
                        <h4 class="text-lg font-extrabold uppercase tracking-widest text-accent font-sans">SLY CLOTHING</h4>
                        <div class="space-y-2 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                            <p><strong>Công ty TNHH SLY CLOTHING Việt Nam</strong></p>
                            <p>Mã số doanh nghiệp: 0315998822 do Sở KH&ĐT TP.HCM cấp.</p>
                            <p>Địa chỉ: 123 Nguyễn Trãi, Phường 2, Quận 5, TP. Hồ Chí Minh.</p>
                            <p>Hotline: 090 123 4567 (9:00 - 22:00)</p>
                            <p>Email: contact@slyclothing.vn</p>
                        </div>
                    </div>

                    <!-- Column 2: Legal & Customer Care Policies -->
                    <div class="space-y-4">
                        <h4 class="text-sm font-bold uppercase tracking-wider text-white">Chính Sách & Hỗ Trợ</h4>
                        <ul class="space-y-2.5 text-xs sm:text-sm text-zinc-400 font-light">
                            <li><a href="#brand-story" class="hover:text-accent transition-colors">Về SLY CLOTHING</a></li>
                            <li><a href="#shop" class="hover:text-accent transition-colors">Chính sách Bảo hành trọn đời</a></li>
                            <li><a href="#shop" class="hover:text-accent transition-colors">Chính sách Đổi trả 7 ngày</a></li>
                            <li><a href="#shop" class="hover:text-accent transition-colors">Chính sách Vận chuyển & Giao nhận</a></li>
                        </ul>
                    </div>

                    <!-- Column 3: Store Locations & Socials -->
                    <div class="space-y-4">
                        <h4 class="text-sm font-bold uppercase tracking-wider text-white">Hệ Thống Cửa Hàng</h4>
                        <div class="text-xs sm:text-sm text-zinc-400 space-y-2 font-light">
                            <p class="flex items-start">
                                <i data-lucide="map-pin" class="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0"></i>
                                <span>Chi nhánh 1: 123 Nguyễn Trãi, Quận 5, TP.HCM</span>
                            </p>
                            <p class="flex items-start">
                                <i data-lucide="map-pin" class="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0"></i>
                                <span>Chi nhánh 2: 456 Lê Văn Sỹ, Quận 3, TP.HCM</span>
                            </p>
                        </div>
                        <div class="pt-4 flex items-center space-x-3">
                            <a href="https://facebook.com" target="_blank" class="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-accent hover:text-accent transition-all duration-300 flex items-center justify-center" title="Facebook">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" class="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-accent hover:text-accent transition-all duration-300 flex items-center justify-center" title="Instagram">
                                <svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                            <a href="https://tiktok.com" target="_blank" class="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-accent hover:text-accent transition-all duration-300 flex items-center justify-center" title="TikTok">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.2 2.27 2.05 3.71 2.45v3.83c-1.74-.06-3.4-.64-4.82-1.63-.44-.31-.85-.66-1.21-1.06v7.71c.08 2.02-.67 4.02-2.1 5.48-1.57 1.62-3.82 2.5-6.09 2.4-2.58-.1-4.99-1.55-6.24-3.83-1.26-2.28-1.28-5.12-.04-7.41 1.22-2.28 3.59-3.79 6.18-3.95v3.86c-1.18.09-2.27.76-2.87 1.77-.66 1.1-.64 2.52.06 3.6.69 1.07 1.94 1.73 3.22 1.63 1.33-.1 2.48-1.11 2.76-2.42.08-.41.11-.83.1-1.25V0z"/></svg>
                            </a>
                            <a href="https://shopee.vn" target="_blank" class="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-accent hover:text-accent transition-all duration-300 flex items-center justify-center" title="Shopee">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.03 8.358c-.378-.973-1.077-1.854-1.996-2.502L12.35 2.503a1.442 1.442 0 0 0-1.7 0L5.966 5.856c-.92.648-1.618 1.53-1.996 2.502L2.016 13.38c-.378.97-.247 2.05.347 2.923l2.88 4.237c.365.536.936.892 1.583.992l5.12.793a1.442 1.442 0 0 0 .44 0l5.12-.793c.647-.1 1.218-.456 1.583-.992l2.88-4.237c.594-.873.725-1.953.347-2.923l-1.954-5.022zM12 18.243c-3.116 0-5.642-2.527-5.642-5.642 0-3.116 2.526-5.642 5.642-5.642s5.642 2.526 5.642 5.642c0 3.115-2.526 5.642-5.642 5.642z"/></svg>
                            </a>
                        </div>
                    </div>

                </div>

                <div class="border-t border-zinc-850 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-[11px] text-zinc-500 font-light space-y-4 sm:space-y-0">
                    <p>© 2026 SLY CLOTHING. All rights reserved.</p>
                    <p class="tracking-widest uppercase text-zinc-600">RIGID DESIGN • HIGH CONTRAST STREETWEAR</p>
                </div>
            </div>
        `;
        
        return this.container;
    }
}
