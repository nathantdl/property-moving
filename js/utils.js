/**
 * Utility functions for the Property Management System
 */

const Utils = {
    /**
     * Generate a unique ID
     * @returns {string} Unique ID
     */
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    /**
     * Format a date string to a readable format
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate: (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },

    /**
     * Create a DOM element with classes and content
     * @param {string} tag - HTML tag
     * @param {string} className - properties (classes, id, etc)
     * @param {string} innerHTML - Inner HTML content
     * @returns {HTMLElement}
     */
    createElement: (tag, className = '', innerHTML = '') => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    }
};
