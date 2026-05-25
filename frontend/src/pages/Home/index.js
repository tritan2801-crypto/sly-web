/**
 * Homepage Orchestrator (Conductor Pattern - Rule 3.2)
 * Orchestrates: Hero slider, CategoryGrid, and FeaturedSection
 */
import Hero from './Hero.js';
import MembershipBanner from './MembershipBanner.js';
import CategoryGrid from './CategoryGrid.js';
import FeaturedSection from './FeaturedSection.js';
import ShopTheLook from './ShopTheLook.js';
import TrustPolicyGrid from './TrustPolicyGrid.js';

export default class HomePage {
    constructor(app) {
        this.app = app;
        this.container = document.createElement('div');
        this.container.className = 'w-full flex flex-col min-h-screen';

        // Instantiate section components
        this.heroSection = new Hero();
        this.membershipBannerSection = new MembershipBanner();
        this.categoryGridSection = new CategoryGrid();
        this.featuredSection = new FeaturedSection(this.app);
        this.shopTheLookSection = new ShopTheLook(this.app);
        this.trustPolicySection = new TrustPolicyGrid();
    }

    render() {
        // Clear container first
        this.container.innerHTML = '';

        // Append rendering layouts in correct layout order
        this.container.appendChild(this.heroSection.render());
        this.container.appendChild(this.membershipBannerSection.render());
        this.container.appendChild(this.categoryGridSection.render());
        this.container.appendChild(this.featuredSection.render());
        this.container.appendChild(this.shopTheLookSection.render());
        this.container.appendChild(this.trustPolicySection.render());

        return this.container;
    }

    mount() {
        // Lifecycle mount triggers for each sub-section
        this.heroSection.mount();
        this.membershipBannerSection.mount();
        this.categoryGridSection.mount();
        this.featuredSection.mount();
        this.shopTheLookSection.mount();
        this.trustPolicySection.mount();
    }

    destroy() {
        // Destruct event listeners and loops
        if (this.heroSection.destroy) {
            this.heroSection.destroy();
        }
        if (this.shopTheLookSection && this.shopTheLookSection.closeDrawer) {
            this.shopTheLookSection.closeDrawer();
        }
    }
}
