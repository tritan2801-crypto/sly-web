/**
 * Account Page Orchestrator (Conductor Pattern - Rule 3.2)
 * Orchestrates: AuthForm, ProfileView
 */
import AuthForm from './AuthForm.js';
import ProfileView from './ProfileView.js';

export default class AccountPage {
    constructor(app) {
        this.app = app;
        this.container = document.createElement('div');
        this.container.className = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12';

        this.authSection = null;
        this.profileSection = null;
    }

    render() {
        this.container.innerHTML = '';

        if (!this.app.state.user) {
            // Show login / registration form
            this.authSection = new AuthForm(this.app, this);
            this.profileSection = null;
            this.container.appendChild(this.authSection.render());
        } else {
            // Show logged in user dashboard
            this.profileSection = new ProfileView(this.app, this);
            this.authSection = null;
            this.container.appendChild(this.profileSection.render());
        }

        return this.container;
    }

    mount() {
        if (this.authSection) {
            this.authSection.mount();
        }
        if (this.profileSection) {
            this.profileSection.mount();
        }
    }
}
