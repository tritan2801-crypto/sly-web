/**
 * Section: Homepage Trust Policy Grid
 * 6-column grid displaying policy cards with hover animations and custom event triggers.
 */
export default class TrustPolicyGrid {
    constructor() {
        this.policies = [
            {
                type: 'shipping',
                title: 'WORLDWIDE SHIPPING',
                titleVi: 'GIAO HÀNG TOÀN CẦU',
                icon: 'globe',
                subtext: 'Vận chuyển nhanh chóng, tin cậy trên toàn quốc và quốc tế.',
                action: 'policy'
            },
            {
                type: 'care',
                title: 'PRODUCT CARE',
                titleVi: 'BẢO QUẢN SẢN PHẨM',
                icon: 'shirt',
                subtext: 'Hướng dẫn chi tiết giữ chất vải luôn đứng phom và bền đẹp.',
                action: 'policy'
            },
            {
                type: 'returns',
                title: '7-DAY RETURNS',
                titleVi: 'ĐỔI TRẢ 7 NGÀY',
                icon: 'refresh-cw',
                subtext: 'Hỗ trợ đổi size hoặc phom dáng dễ dàng trong vòng 7 ngày.',
                action: 'policy'
            },
            {
                type: 'privacy',
                title: 'SECURE PRIVACY',
                titleVi: 'BẢO MẬT TUYỆT ĐỐI',
                icon: 'lock',
                subtext: 'Cam kết mã hóa và bảo vệ an toàn thông tin giao dịch 100%.',
                action: 'policy'
            },
            {
                type: 'member',
                title: 'MEMBERSHIP SYSTEM',
                titleVi: 'THÀNH VIÊN SLY SQUAD',
                icon: 'credit-card',
                subtext: 'Tích điểm Loyalty qua mỗi đơn hàng và nhận chiết khấu đến 15%.',
                action: 'link',
                link: '#member'
            },
            {
                type: 'stores',
                title: 'STORE LOCATOR',
                titleVi: 'HỆ THỐNG CỬA HÀNG',
                icon: 'map-pin',
                subtext: 'Ghé thăm các chi nhánh cửa hàng của chúng tôi tại TP. Hồ Chí Minh.',
                action: 'policy'
            }
        ];
        this.container = document.createElement('section');
        this.container.className = 'py-12 sm:py-16 w-full px-4 sm:px-8 lg:px-12 bg-white border-b border-borderMuted';
    }

    render() {
        this.container.innerHTML = `
            <div class="mb-10 text-center sm:text-left">
                <span class="text-accent text-xs font-bold tracking-widest uppercase">SLY POLICY</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary uppercase mt-1">DỊCH VỤ & CHĂM SÓC KHÁCH HÀNG</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
                ${this.policies.map(p => `
                    <div class="border border-borderMuted p-6 flex flex-col items-center justify-between text-center space-y-4 bg-white transition-all duration-350 hover:bg-[#F5F5F5] hover:-translate-y-1 hover:shadow-md cursor-pointer group min-h-[220px]" data-policy-btn="${p.type}">
                        <div class="flex flex-col items-center space-y-3.5">
                            <div class="p-3 bg-zinc-50 border border-zinc-100 rounded-none transition-colors duration-300 group-hover:bg-primary group-hover:border-primary flex items-center justify-center">
                                <i data-lucide="${p.icon}" class="w-6 h-6 text-primary group-hover:text-white transition-colors duration-350"></i>
                            </div>
                            <h3 class="text-xs font-extrabold uppercase tracking-widest text-primary font-sans leading-tight">
                                ${p.titleVi}
                            </h3>
                            <p class="text-[11px] text-zinc-500 font-light leading-relaxed">
                                ${p.subtext}
                            </p>
                        </div>
                        <span class="text-[9px] text-accent font-black uppercase tracking-widest opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center">
                            Xem chi tiết <i data-lucide="chevron-right" class="w-3 h-3 ml-0.5"></i>
                        </span>
                    </div>
                `).join('')}
            </div>
        `;

        return this.container;
    }

    mount() {
        this.container.querySelectorAll('[data-policy-btn]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.getAttribute('data-policy-btn');
                const policy = this.policies.find(p => p.type === type);
                
                if (policy) {
                    if (policy.action === 'link') {
                        window.location.hash = policy.link;
                    } else {
                        // Dispatch global event for MainNavbar policy modal trigger
                        window.dispatchEvent(new CustomEvent('sly-open-policy', {
                            detail: { type: policy.type }
                        }));
                    }
                }
            });
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}
