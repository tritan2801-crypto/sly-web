/**
 * Shopping Cart & Checkout Page Orchestrator (Conductor Pattern - Rule 3.2)
 * Orchestrates: CartSummary, CheckoutForm
 */
import CartSummary from './CartSummary.js';
import CheckoutForm from './CheckoutForm.js';

export default class CartCheckoutPage {
    constructor(app) {
        this.app = app;
        this.container = document.createElement('div');
        this.container.className = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12';

        this.cartSummarySection = null;
        this.checkoutFormSection = null;
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
        this.container.innerHTML = '';
        const params = this.getQueryParams();

        if (params.checkout === 'true') {
            // Render Checkout Form details
            this.checkoutFormSection = new CheckoutForm(this.app, this);
            this.cartSummarySection = null;
            this.container.appendChild(this.checkoutFormSection.render());
        } else {
            // Render standard shopping cart items list
            this.cartSummarySection = new CartSummary(this.app, this);
            this.checkoutFormSection = null;
            this.container.appendChild(this.cartSummarySection.render());
        }

        return this.container;
    }

    mount() {
        if (this.cartSummarySection) {
            this.cartSummarySection.mount();
        }
        if (this.checkoutFormSection) {
            this.checkoutFormSection.mount();
        }
    }

    // Handles updates on hash changes if page is already active
    update() {
        this.render();
        this.mount();
    }
}
