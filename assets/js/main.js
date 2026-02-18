import { store } from './store.js';
import { Router } from './router.js';

// Import Components
import './components/app-header.js';
import './components/product-card.js';
import './components/product-list.js';
import './components/cart-modal.js';
import './components/alert-modal.js';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Router
    const router = new Router({
        '#/': {
            template: '<product-list></product-list>',
            init: () => {
                // If we need to re-fetch or something
            }
        },
        // We could add other pages here
    });

    // Initialize Store (fetch data)
    store.init();
});
