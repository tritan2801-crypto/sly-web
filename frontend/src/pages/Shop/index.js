/**
 * Shop Catalog Page Orchestrator (Conductor Pattern - Rule 3.2)
 * Orchestrates: FilterSidebar and ProductGrid
 */
import FilterSidebar from './FilterSidebar.js';
import ProductGrid from './ProductGrid.js';

export default class ShopPage {
    constructor(app) {
        this.app = app;
        this.container = document.createElement('div');
        this.container.className = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col md:flex-row gap-8';

        // Instantiate section components
        this.sidebar = new FilterSidebar(this);
        this.grid = new ProductGrid(this);
    }

    getQueryParams() {
        const hash = window.location.hash;
        if (!hash.includes('?')) return {};
        
        const queryStr = hash.split('?')[1];
        const params = {};
        const pairs = queryStr.split('&');
        
        pairs.forEach(pair => {
            const [key, val] = pair.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(val || '');
            }
        });
        
        return params;
    }

    render() {
        // Clear containers
        this.container.innerHTML = '';

        // Render side layout
        this.container.appendChild(this.sidebar.render());
        this.container.appendChild(this.grid.render());

        return this.container;
    }

    mount() {
        this.sidebar.mount();
        this.grid.mount();
    }

    // Listens to secondary updates in orchestrator if page is already active but route updates
    update() {
        // Re-fetch products grid if filters changed
        this.grid.fetchProducts();
        this.sidebar.render();
        this.sidebar.mount();
    }
}
