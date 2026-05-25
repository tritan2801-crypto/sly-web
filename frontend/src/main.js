/**
 * SPA Entry Point & Global Router for SLY CLOTHING
 */

import MainNavbar from './components/MainNavbar.js';
import MainFooter from './components/MainFooter.js';

// Page Orchestrator Imports
import HomePage from './pages/Home/index.js';
import ShopPage from './pages/Shop/index.js';
import BrandStoryPage from './pages/BrandStory/index.js';
import MemberOnlinePage from './pages/MemberOnline/index.js';
import OrderTrackingPage from './pages/OrderTracking/index.js';
import AccountPage from './pages/Account/index.js';
import CartCheckoutPage from './pages/CartCheckout/index.js';
import ProductDetailPage from './pages/ProductDetail/index.js';
import AdminDashboard from './pages/Admin/AdminDashboard.js';

class App {
    constructor() {
        this.appContainer = document.getElementById('app');
        
        // Generate or retrieve Session ID for behavior logs
        if (!localStorage.getItem('sly_session_id')) {
            localStorage.setItem('sly_session_id', 'sly_sess_' + Math.random().toString(36).substring(2, 15));
        }
        this.sessionId = localStorage.getItem('sly_session_id');

        // State Management
        this.state = {
            cart: this.loadCart(),
            user: null,
            currentRoute: this.getRouteFromHash()
        };

        // Bind events
        window.addEventListener('hashchange', () => this.handleRouteChange());
        
        // Initialize App
        this.init();
    }

    async init() {
        // 1. Fetch current user from session on startup
        await this.checkAuthStatus();

        // 2. Initial render
        this.renderLayout();

        // 3. Register analytics trackers
        this.initBehaviorLogs();
    }

    getRouteFromHash() {
        const hash = window.location.hash.split('?')[0] || '#home';
        return hash;
    }

    loadCart() {
        try {
            return JSON.parse(localStorage.getItem('sly_cart')) || [];
        } catch (e) {
            return [];
        }
    }

    saveCart() {
        localStorage.setItem('sly_cart', JSON.stringify(this.state.cart));
        // Dispatch custom event to notify components (like Navbar) of cart change
        window.dispatchEvent(new CustomEvent('sly-cart-updated'));
    }

    async checkAuthStatus() {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.success) {
                this.state.user = data.data;
            } else {
                this.state.user = null;
            }
        } catch (e) {
            this.state.user = null;
        }
    }

    async handleRouteChange() {
        this.state.currentRoute = this.getRouteFromHash();
        
        // Log page view behavior
        this.logBehavior('page_view', this.state.currentRoute);

        this.renderPage();
        
        // Scroll to top on navigation
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderLayout() {
        const user = this.state.user;
        if (user && user.role === 'admin') {
            // Render Admin Layout: No global customer navbar, no global footer, full height container
            this.appContainer.innerHTML = `
                <div id="admin-page-content" class="w-full min-h-screen"></div>
            `;
            this.renderPage();
            return;
        }

        this.appContainer.innerHTML = `
            <!-- Navbar Hook -->
            <div id="navbar-container"></div>
            
            <!-- Page Frame -->
            <main id="page-content" class="flex-grow min-h-[70vh]"></main>
            
            <!-- Footer Hook -->
            <div id="footer-container"></div>
        `;

        // Render Navbar and Footer
        this.navbarComponent = new MainNavbar(this);
        this.footerComponent = new MainFooter();

        document.getElementById('navbar-container').appendChild(this.navbarComponent.render());
        document.getElementById('footer-container').appendChild(this.footerComponent.render());

        this.navbarComponent.mount();

        // Render current page content
        this.renderPage();
    }

    renderPage() {
        const user = this.state.user;
        if (user && user.role === 'admin') {
            const adminContainer = document.getElementById('admin-page-content');
            if (!adminContainer) {
                this.renderLayout();
                return;
            }
            adminContainer.innerHTML = '';
            
            const pageInstance = new AdminDashboard(this);
            adminContainer.appendChild(pageInstance.render());
            pageInstance.mount();
            return;
        }

        const contentContainer = document.getElementById('page-content');
        if (!contentContainer) {
            this.renderLayout();
            return;
        }
        contentContainer.innerHTML = ''; // Clear page

        // Dynamically toggle top spacer padding for fixed navbar
        const currentRoute = this.state.currentRoute;
        if (currentRoute === '#home' || currentRoute === '') {
            contentContainer.className = 'flex-grow min-h-[70vh] pt-0';
        } else {
            contentContainer.className = 'flex-grow min-h-[70vh] pt-14 sm:pt-16';
        }

        let pageInstance;

        switch (this.state.currentRoute) {
            case '#home':
                pageInstance = new HomePage(this);
                break;
            case '#shop':
                pageInstance = new ShopPage(this);
                break;
            case '#product':
                pageInstance = new ProductDetailPage(this);
                break;
            case '#brand-story':
                pageInstance = new BrandStoryPage(this);
                break;
            case '#member':
                pageInstance = new MemberOnlinePage(this);
                break;
            case '#tracking':
                pageInstance = new OrderTrackingPage(this);
                break;
            case '#account':
                pageInstance = new AccountPage(this);
                break;
            case '#cart':
                pageInstance = new CartCheckoutPage(this);
                break;
            default:
                contentContainer.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <h1 class="text-6xl font-bold tracking-tight text-primary mb-4">404</h1>
                        <p class="text-xl text-gray-600 mb-8">Trang bạn tìm kiếm không tồn tại.</p>
                        <a href="#home" class="px-8 py-3 bg-primary text-white border border-primary hover:bg-white hover:text-primary transition-all font-semibold uppercase tracking-wider">Trang Chủ</a>
                    </div>
                `;
                return;
        }

        contentContainer.appendChild(pageInstance.render());
        pageInstance.mount();

        // Trigger Lucide SVG icon renders
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // --- BEHAVIOR TELEMETRY LOGGING (Rule 5.2 / Skill 2.2 / Skill 4.1) ---
    initBehaviorLogs() {
        // 1. Scroll Stop Tracker (Logs if user stops scrolling for 3 seconds)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = scrollHeight > 0 ? Math.round((window.scrollY / scrollHeight) * 100) : 0;
                
                this.logBehavior('scroll_stop', this.state.currentRoute, 'body', {
                    scroll_percentage: scrollPercent
                });
            }, 3000);
        });

        // 2. Product Hover Duration Tracker (Logs hovers lasting >= 2 seconds)
        let hoverTimer;
        let activeHoverId = null;
        let hoverStartTime = 0;

        document.addEventListener('mouseover', (e) => {
            const card = e.target.closest('[data-track-hover]');
            if (card) {
                const elementId = card.getAttribute('data-track-hover');
                if (activeHoverId !== elementId) {
                    clearTimeout(hoverTimer);
                    activeHoverId = elementId;
                    hoverStartTime = Date.now();
                    
                    hoverTimer = setTimeout(() => {
                        this.logBehavior('product_hover_start', this.state.currentRoute, elementId, {
                            action: 'hovered_2_seconds'
                        });
                    }, 2000);
                }
            }
        });

        document.addEventListener('mouseout', (e) => {
            const card = e.target.closest('[data-track-hover]');
            if (card) {
                clearTimeout(hoverTimer);
                if (activeHoverId === card.getAttribute('data-track-hover')) {
                    const duration = (Date.now() - hoverStartTime) / 1000;
                    if (duration >= 2.0) {
                        this.logBehavior('product_hover_duration', this.state.currentRoute, activeHoverId, {
                            duration_seconds: parseFloat(duration.toFixed(2))
                        });
                    }
                    activeHoverId = null;
                }
            }
        });

        // 3. CTA Button Click Tracker
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-track-cta]');
            if (btn) {
                const ctaName = btn.getAttribute('data-track-cta');
                this.logBehavior('cta_click', this.state.currentRoute, btn.id || null, {
                    cta_name: ctaName,
                    button_text: btn.innerText.trim()
                });
            }
        });
    }

    async logBehavior(actionType, pageUrl, elementId = null, payload = {}) {
        try {
            const logBody = {
                session_id: this.sessionId,
                action_type: actionType,
                page_url: pageUrl,
                element_id: elementId,
                payload: payload
            };

            // Call proxy backend controller (Rule 5.2)
            await fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logBody)
            });
        } catch (e) {
            // Silently suppress analytics dispatch errors to maintain seamless user flow
        }
    }
}

// Instantiate app on load
window.addEventListener('DOMContentLoaded', () => {
    window.slyApp = new App();
});
