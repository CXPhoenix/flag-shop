import { store } from './store.js';
import { Router } from './router.js';

// Import Components
import './components/app-header.js';
import './components/product-card.js';
import './components/product-list.js';
import './components/cart-modal.js';
import './components/alert-modal.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const router = new Router({
        '#/': {
            template: '<product-list></product-list>',
            init: () => {
                
            }
        },
        
    });

    store.init();
});
