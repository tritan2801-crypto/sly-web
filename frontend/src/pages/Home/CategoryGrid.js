/**
 * Section: Homepage Category Grid
 */
export default class CategoryGrid {
    constructor() {
        this.categories = [
            {
                name: 'Áo Thun / T-Shirt',
                image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600',
                link: '#shop?category_id=11'
            },
            {
                name: 'Áo Nỉ / Hoodie',
                image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600',
                link: '#shop?category_id=21'
            },
            {
                name: 'Áo Khoác / Jacket',
                image: 'https://images.pexels.com/photos/1619806/pexels-photo-1619806.jpeg?auto=compress&cs=tinysrgb&w=600',
                link: '#shop?category_id=22'
            },
            {
                name: 'Phụ Kiện / Accessories',
                image: 'https://images.pexels.com/photos/2905278/pexels-photo-2905278.jpeg?auto=compress&cs=tinysrgb&w=600',
                link: '#shop?category_group=accessories'
            }
        ];
        this.container = document.createElement('section');
        this.container.className = 'py-12 sm:py-16 w-full px-4 sm:px-8 lg:px-12 border-b border-borderMuted';
    }

    render() {
        this.container.innerHTML = `
            <div class="mb-10 text-center sm:text-left">
                <span class="text-accent text-xs font-bold tracking-widest uppercase">DANH MỤC</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary uppercase mt-1">PHÂN LOẠI TRANG PHỤC</h2>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                ${this.categories.map(cat => `
                    <a href="${cat.link}" class="group relative block aspect-[3/4] overflow-hidden bg-zinc-900 border border-borderMuted">
                        <!-- Background Image -->
                        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url('${cat.image}');"></div>
                        
                        <!-- Text -->
                        <div class="absolute bottom-5 left-5 right-5 text-left flex items-center justify-between">
                            <span class="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">${cat.name}</span>
                            <span class="text-white bg-accent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            </span>
                        </div>
                    </a>
                `).join('')}
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
