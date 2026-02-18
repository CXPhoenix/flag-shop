import { store } from '../store.js';

export class AppHeader extends HTMLElement {
    connectedCallback() {
        this.render();
        store.addEventListener('state_changed', () => this.updateBalance());
        store.addEventListener('cart_updated', () => this.updateCartCount());
    }

    updateBalance() {
        const el = this.querySelector('#balance-display');
        if (el) el.textContent = `$${store.state.balance}`;
    }

    updateCartCount() {
        const count = store.state.cart.reduce((acc, item) => acc + (item.qty > 0 ? item.qty : 0), 0); 
        
        const badge = this.querySelector('#cart-badge');
        if (badge) {
            badge.textContent = store.state.cart.length;
            badge.classList.toggle('hidden', store.state.cart.length === 0);
        }
    }

    render() {
        this.innerHTML = `
            <nav class="bg-hacker-black border-b border-hacker-dark-green p-4 flex justify-between items-center shadow-[0_0_10px_#00ff00]">
                <div class="flex items-center gap-2">
                    <div class="text-4xl">🚩</div>
                    <h1 class="text-2xl font-bold text-hacker-green tracking-tighter">FLAG 飄揚商店</h1>
                </div>
                
                <div class="flex items-center gap-6">
                    <div class="text-hacker-green font-mono text-xl">
                        餘額: <span id="balance-display" class="text-white">$${store.state.balance}</span>
                    </div>
                    
                    <button id="cart-btn" class="relative p-2 hover:bg-hacker-dark-green rounded transition-colors text-hacker-green">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span id="cart-badge" class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full hidden">0</span>
                    </button>
                </div>
            </nav>
        `;

        this.querySelector('#cart-btn').addEventListener('click', () => {
            const modal = document.querySelector('cart-modal');
            modal.open();
        });
    }
}

customElements.define('app-header', AppHeader);
