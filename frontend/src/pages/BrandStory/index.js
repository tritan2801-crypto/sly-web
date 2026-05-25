/**
 * Brand Story Page Orchestrator (Conductor Pattern - Rule 3.2)
 * Orchestrates: StoryContent
 */
import StoryContent from './StoryContent.js';

export default class BrandStoryPage {
    constructor(app) {
        this.app = app;
        this.container = document.createElement('div');
        this.container.className = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12';

        this.contentSection = new StoryContent();
    }

    render() {
        this.container.innerHTML = '';
        this.container.appendChild(this.contentSection.render());
        return this.container;
    }

    mount() {
        this.contentSection.mount();
    }
}
