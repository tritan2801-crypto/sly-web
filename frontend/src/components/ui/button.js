/**
 * Reusable UI Button Component
 * Aligned with Design System: Rectangular block, sharp edges, hover invert colors
 */
export default class Button {
    /**
     * Renders button HTML string
     * 
     * @param {string} text - Button label
     * @param {string} variant - primary, secondary, accent, disabled
     * @param {string} extraClasses - Custom Tailwind classes
     * @param {string} extraAttrs - Custom attributes (e.g. id, data-track-cta)
     * @returns {string}
     */
    static render(text, variant = 'primary', extraClasses = '', extraAttrs = '') {
        const base = "px-6 py-3 font-bold text-xs uppercase tracking-widest transition-all duration-300 border focus:outline-none select-none cursor-pointer";
        
        let styles = "";
        switch (variant) {
            case 'primary':
                styles = "bg-primary text-white border-primary hover:bg-white hover:text-primary";
                break;
            case 'secondary':
                styles = "bg-white text-primary border-primary hover:bg-primary hover:text-white";
                break;
            case 'accent':
                styles = "bg-accent text-white border-accent hover:bg-white hover:text-accent";
                break;
            case 'disabled':
                styles = "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed pointer-events-none";
                break;
        }

        return `<button ${extraAttrs} class="${base} ${styles} ${extraClasses}">${text}</button>`;
    }
}
