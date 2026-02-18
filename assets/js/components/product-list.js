import { store } from '../store.js';

export class ProductList extends HTMLElement {
    connectedCallback() {
        this.render();
        store.addEventListener('products_loaded', () => this.renderItems());
        
        if (store.state.products.length > 0) {
            this.renderItems();
        }
    }

    renderItems() {
        const grid = this.querySelector('#product-grid');
        grid.innerHTML = '';
        
        store.state.products.forEach(product => {
            const card = document.createElement('product-card');
            card.data = product; 
            grid.appendChild(card);
        });
    }

    render() {
        this.innerHTML = `
            <div class="py-8">
                <h2 class="text-3xl font-bold text-hacker-green mb-8 border-l-4 border-hacker-green pl-4">精選裝備</h2>
                <div id="product-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Products injected here -->
                    <div class="text-white animate-pulse">正在載入黑市資料...</div>
                </div>
            </div>
        `;
    }
}

customElements.define('product-list', ProductList);
