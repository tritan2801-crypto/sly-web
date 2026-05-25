/**
 * Section: Homepage Membership Gamification Banner
 * Split-screen banner with metallic 3D member card mockups on the left, and marketing rewards copy on the right.
 */
export default class MembershipBanner {
    constructor() {
        this.container = document.createElement('section');
        this.container.className = 'w-full bg-[#000000] text-white border-b border-zinc-800 overflow-hidden';
    }

    render() {
        this.container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-10 gap-0">
                
                <!-- Left Side (60%): Digital Membership Cards Mockups -->
                <div class="lg:col-span-6 relative bg-gradient-to-br from-[#121212] via-[#0c0c0c] to-[#1a1a1a] p-10 sm:p-16 flex items-center justify-center min-h-[350px] lg:min-h-[420px] overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800 select-none">
                    
                    <!-- Decorative background grid lights -->
                    <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                    <div class="absolute top-1/4 left-1/3 w-72 h-72 bg-accent/5 rounded-full filter blur-[80px] pointer-events-none"></div>
                    
                    <!-- Cards Stack Container -->
                    <div class="relative w-full max-w-[400px] h-[240px] flex items-center justify-center">
                        
                        <!-- 1. Platinum Card (Back) -->
                        <div class="absolute w-[280px] h-[170px] bg-gradient-to-br from-zinc-800 via-zinc-650 to-zinc-950 rounded-lg p-5 border border-zinc-550/40 shadow-2xl flex flex-col justify-between transform -rotate-12 -translate-x-14 -translate-y-6 transition-all duration-500 hover:z-30 hover:scale-105 cursor-pointer group">
                            <div class="flex justify-between items-start">
                                <span class="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">PLATINUM MEMBER</span>
                                <span class="text-xs font-black tracking-widest text-white/50">SLY®</span>
                            </div>
                            <div class="space-y-1">
                                <p class="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">LIFETIME DISCOUNT</p>
                                <h3 class="text-2xl font-black text-white font-sans leading-none">15% OFF</h3>
                            </div>
                            <div class="flex justify-between items-end">
                                <span class="text-[8px] font-mono text-zinc-500">CARD ID: SLY-PLAT-998</span>
                                <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                    <svg class="w-3.5 h-3.5 fill-current text-white/40" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                </div>
                            </div>
                        </div>

                        <!-- 2. Gold Card (Middle) -->
                        <div class="absolute w-[280px] h-[170px] bg-gradient-to-br from-yellow-700 via-yellow-450 to-yellow-850 rounded-lg p-5 border border-yellow-500/30 shadow-2xl flex flex-col justify-between transform rotate-6 translate-x-12 -translate-y-4 transition-all duration-500 hover:z-30 hover:scale-105 cursor-pointer group">
                            <div class="flex justify-between items-start">
                                <span class="text-[9px] font-black uppercase tracking-widest text-yellow-300 group-hover:text-yellow-100 transition-colors">GOLD MEMBER</span>
                                <span class="text-xs font-black tracking-widest text-white/50">SLY®</span>
                            </div>
                            <div class="space-y-1">
                                <p class="text-[9px] text-yellow-600/70 font-mono tracking-widest uppercase">LIFETIME DISCOUNT</p>
                                <h3 class="text-2xl font-black text-white font-sans leading-none">10% OFF</h3>
                            </div>
                            <div class="flex justify-between items-end">
                                <span class="text-[8px] font-mono text-yellow-600">CARD ID: SLY-GOLD-521</span>
                                <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                    <svg class="w-3.5 h-3.5 fill-current text-white/40" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                </div>
                            </div>
                        </div>

                        <!-- 3. Silver Card (Front) -->
                        <div class="absolute w-[280px] h-[170px] bg-gradient-to-br from-zinc-350 via-zinc-150 to-zinc-500 rounded-lg p-5 border border-zinc-200/50 shadow-2xl flex flex-col justify-between transform -rotate-3 translate-y-6 transition-all duration-500 hover:z-30 hover:scale-105 cursor-pointer group">
                            <div class="flex justify-between items-start">
                                <span class="text-[9px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-800 transition-colors">SILVER MEMBER</span>
                                <span class="text-xs font-black tracking-widest text-zinc-800/40">SLY®</span>
                            </div>
                            <div class="space-y-1">
                                <p class="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">LIFETIME DISCOUNT</p>
                                <h3 class="text-2xl font-black text-zinc-900 font-sans leading-none">5% OFF</h3>
                            </div>
                            <div class="flex justify-between items-end">
                                <span class="text-[8px] font-mono text-zinc-650">CARD ID: SLY-SILV-102</span>
                                <div class="w-6 h-6 rounded-full bg-zinc-900/10 flex items-center justify-center border border-zinc-950/20">
                                    <svg class="w-3.5 h-3.5 fill-current text-zinc-800" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Right Side (40%): Copy details & CTA registration -->
                <div class="lg:col-span-4 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
                    <div class="space-y-2">
                        <span class="text-accent text-xs font-bold tracking-[0.2em] uppercase">SLY LOYALTY CLUB</span>
                        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase leading-tight font-sans">
                            BE SLY,<br/>GET REWARDED
                        </h2>
                    </div>

                    <div class="space-y-4 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                        <p>
                            Gia nhập thế hệ **SLY SQUAD** ngay hôm nay. Mỗi giao dịch mua sắm của bạn đều tích điểm Loyalty đổi quà ưu đãi lớn.
                        </p>
                        <p>
                            Mở khóa thẻ thành viên trọn đời và nhận các đặc quyền chiết khấu trực tiếp lên đến **15%**, nhận ưu đãi quà tặng ngày sinh nhật và quyền truy cập sớm để đặt hàng các đợt phát hành Drops giới hạn của hãng.
                        </p>
                    </div>

                    <div class="pt-4">
                        <button id="btn-join-vip-club" class="w-full sm:w-auto px-8 py-3.5 bg-white text-primary border border-white font-extrabold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 focus:outline-none">
                            THAM GIA NGAY
                        </button>
                    </div>
                </div>

            </div>
        `;

        return this.container;
    }

    mount() {
        const joinBtn = this.container.querySelector('#btn-join-vip-club');
        if (joinBtn) {
            joinBtn.addEventListener('click', () => {
                window.location.hash = '#account';
            });
        }
    }
}
