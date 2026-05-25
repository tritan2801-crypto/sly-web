/**
 * Member Online Page Orchestrator (Conductor Pattern - Rule 3.2)
 * Orchestrates: MembershipInfo
 */
import MembershipInfo from './MembershipInfo.js';

export default class MemberOnlinePage {
    constructor(app) {
        this.app = app;
        this.container = document.createElement('div');
        this.container.className = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12';

        this.infoSection = new MembershipInfo(this.app);
    }

    render() {
        this.container.innerHTML = '';
        this.container.appendChild(this.infoSection.render());
        return this.container;
    }

    mount() {
        this.infoSection.mount();
    }
}
