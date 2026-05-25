/**
 * Section: Hero Lookbook Slider
 */
import Button from '../../components/ui/button.js';

export default class Hero {
    constructor() {
        this.slides = [
            {
                image: 'https://images.pexels.com/photos/10324869/pexels-photo-10324869.jpeg?auto=compress&cs=tinysrgb&w=1600',
                title: 'CRIMSON CHAOS COLLECTION',
                subtitle: 'GEN Z MINIMALIST STREETWEAR // VOL. 26',
                cta: 'XEM BỘ SƯU TẬP'
            },
            {
                image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1600',
                title: 'OUT OF THE SHADOWS',
                subtitle: 'OVERSIZED SILHOUETTES & HEAVY FABRIC',
                cta: 'MUA NGAY'
            }
        ];
        this.currentIndex = 0;
        this.container = document.createElement('section');
        this.container.className = 'relative overflow-hidden w-full aspect-[16/9] md:h-[650px] bg-black text-white';
        this.interval = null;
    }

    render() {
        this.container.innerHTML = `
            <!-- Slide Images -->
            <div id="hero-slides-wrapper" class="absolute inset-0 w-full h-full">
                ${this.slides.map((slide, index) => `
                    <div class="hero-slide absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === this.currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65)), url('${slide.image}'); background-size: cover; background-position: center;">
                        
                        <!-- Overlay Text container -->
                        <div class="absolute bottom-16 sm:bottom-24 left-4 sm:left-12 max-w-2xl px-4 space-y-4">
                            <span class="text-accent text-[11px] font-bold tracking-[0.25em] uppercase">${slide.subtitle}</span>
                            <h1 class="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight uppercase font-sans">${slide.title}</h1>
                            <div class="pt-4">
                                ${Button.render(slide.cta, 'accent', 'px-8 py-3.5', `id="hero-cta-btn" onclick="window.location.hash='#shop'" data-track-cta="hero_collection"`)}
                            </div>
                        </div>

                    </div>
                `).join('')}
            </div>

            <!-- Slide Navigation indicators -->
            <div class="absolute bottom-6 right-6 z-20 flex space-x-2.5">
                ${this.slides.map((_, index) => `
                    <button class="slide-indicator w-8 h-1 transition-all duration-300 ${index === this.currentIndex ? 'bg-accent' : 'bg-white/40'}" data-index="${index}"></button>
                `).join('')}
            </div>
        `;

        return this.container;
    }

    mount() {
        const indicators = this.container.querySelectorAll('.slide-indicator');
        indicators.forEach(ind => {
            ind.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                this.goToSlide(idx);
            });
        });

        // Autoplay
        this.startAutoplay();
    }

    startAutoplay() {
        this.interval = setInterval(() => {
            const nextIdx = (this.currentIndex + 1) % this.slides.length;
            this.goToSlide(nextIdx);
        }, 6000);
    }

    goToSlide(index) {
        this.currentIndex = index;
        const slides = this.container.querySelectorAll('.hero-slide');
        const indicators = this.container.querySelectorAll('.slide-indicator');

        slides.forEach((slide, idx) => {
            if (idx === index) {
                slide.classList.add('opacity-100', 'z-10');
                slide.classList.remove('opacity-0', 'z-0');
            } else {
                slide.classList.remove('opacity-100', 'z-10');
                slide.classList.add('opacity-0', 'z-0');
            }
        });

        indicators.forEach((ind, idx) => {
            if (idx === index) {
                ind.classList.remove('bg-white/40');
                ind.classList.add('bg-accent');
            } else {
                ind.classList.remove('bg-accent');
                ind.classList.add('bg-white/40');
            }
        });

        // Reset timer
        clearInterval(this.interval);
        this.startAutoplay();
    }

    destroy() {
        clearInterval(this.interval);
    }
}
