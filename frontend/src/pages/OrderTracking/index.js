/**
 * Order Tracking Page Orchestrator (Conductor Pattern - Rule 3.2)
 * Orchestrates: TrackingForm
 */
import TrackingForm from './TrackingForm.js';

export default class OrderTrackingPage {
    constructor(app) {
        this.app = app;
        this.container = document.createElement('div');
        this.container.className = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12';

        this.trackingSection = new TrackingForm(this.app);
    }

    render() {
        this.container.innerHTML = '';
        this.container.appendChild(this.trackingSection.render());
        return this.container;
    }

    mount() {
        this.trackingSection.mount();
    }
}
