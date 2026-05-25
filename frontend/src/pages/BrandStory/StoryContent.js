/**
 * Section: Brand Story content
 */
export default class StoryContent {
    constructor() {
        this.container = document.createElement('section');
        this.container.className = 'py-12 sm:py-16 space-y-16 max-w-5xl mx-auto';
    }

    render() {
        this.container.innerHTML = `
            <!-- Block 1: Intro Hero Banner -->
            <div class="relative overflow-hidden aspect-[21/9] bg-zinc-900 border border-borderMuted select-none flex items-center justify-center text-center p-6">
                <div class="absolute inset-0 bg-cover bg-center opacity-40" style="background-image: url('https://images.pexels.com/photos/9558583/pexels-photo-9558583.jpeg?auto=compress&cs=tinysrgb&w=1200');"></div>
                <div class="relative z-10 space-y-3">
                    <span class="text-accent text-xs font-bold tracking-[0.3em] uppercase">SLY CLOTHING ORIGINS</span>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-widest uppercase leading-tight font-sans">BẢN SẮC ĐƯỜNG PHỐ</h1>
                </div>
            </div>

            <!-- Block 2: Brand Manifesto Split layout -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div class="space-y-6">
                    <span class="text-accent text-xs font-bold tracking-widest uppercase">CÂU CHUYỆN THƯƠNG HIỆU</span>
                    <h2 class="text-2xl sm:text-3xl font-extrabold text-primary uppercase tracking-wider">ĐỊNH HÌNH PHONG CÁCH TỐI GIẢN</h2>
                    <p class="text-sm text-zinc-650 leading-relaxed font-light">
                        Được thành lập tại Sài Gòn, Việt Nam, SLY CLOTHING sinh ra từ niềm đam mê phong cách thời trang đường phố (streetwear) gai góc, tối giản và có tính tương phản cực cao. Chúng tôi không chạy theo những xu hướng nhất thời mà hướng tới việc xây dựng một phong cách sống tối giản nhưng đầy cá tính cho thế hệ Gen Z và người trẻ năng động.
                    </p>
                    <p class="text-sm text-zinc-650 leading-relaxed font-light">
                        Từng đường may, mũi kim hay hình in trên sản phẩm SLY đều được chăm chút kỹ lưỡng để tạo nên những bộ trang phục phom dáng cứng cáp, mang chất "grunge/underground" đặc trưng, khẳng định cái tôi riêng biệt của người mặc.
                    </p>
                </div>
                <div class="aspect-[4/3] bg-zinc-100 border border-borderMuted overflow-hidden relative">
                    <img src="https://images.pexels.com/photos/1619806/pexels-photo-1619806.jpeg?auto=compress&cs=tinysrgb&w=800" class="w-full h-full object-cover" alt="Streetwear styling lookbook" />
                </div>
            </div>

            <!-- Block 3: Techwear Fabric Quality focus -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-b border-borderMuted py-10">
                <div class="space-y-3 text-center sm:text-left">
                    <div class="w-10 h-10 bg-black text-white flex items-center justify-center mx-auto sm:mx-0">
                        <span class="font-extrabold text-xs">250G</span>
                    </div>
                    <h3 class="text-sm font-bold uppercase tracking-wider text-primary">Heavyweight Cotton</h3>
                    <p class="text-xs text-zinc-550 leading-relaxed font-light">Sử dụng chất liệu thun cotton 100% định lượng cao (250gsm - 350gsm) đảm bảo sản phẩm đứng phom, dày dặn, thấm hút mồ hôi cực tốt.</p>
                </div>
                <div class="space-y-3 text-center sm:text-left">
                    <div class="w-10 h-10 bg-black text-white flex items-center justify-center mx-auto sm:mx-0">
                        <i data-lucide="shield-check" class="w-5 h-5 text-accent"></i>
                    </div>
                    <h3 class="text-sm font-bold uppercase tracking-wider text-primary">Lifetime Warranty</h3>
                    <p class="text-xs text-zinc-550 leading-relaxed font-light">SLY cam kết bảo hành trọn đời đối với tất cả hình in decal/lụa và đường kim mũi chỉ. Khách hàng hoàn toàn yên tâm sử dụng lâu dài.</p>
                </div>
                <div class="space-y-3 text-center sm:text-left">
                    <div class="w-10 h-10 bg-black text-white flex items-center justify-center mx-auto sm:mx-0">
                        <i data-lucide="refresh-cw" class="w-5 h-5"></i>
                    </div>
                    <h3 class="text-sm font-bold uppercase tracking-wider text-primary">7-Day Returns</h3>
                    <p class="text-xs text-zinc-550 leading-relaxed font-light">Chính sách đổi trả linh hoạt trong vòng 7 ngày kể từ ngày nhận hàng với bất kì lý do không hài lòng nào về phom dáng hay size áo.</p>
                </div>
            </div>

            <!-- Block 4: Call to Action -->
            <div class="text-center py-6 space-y-6">
                <h3 class="text-xl sm:text-2xl font-extrabold uppercase tracking-wider">BẠN ĐÃ SẴN SÀNG TRẢI NGHIỆM?</h3>
                <a href="#shop" class="inline-block px-8 py-4 bg-primary text-white border border-primary font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-colors duration-300">
                    Bắt đầu mua sắm ngay
                </a>
            </div>
        `;

        return this.container;
    }

    mount() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}
