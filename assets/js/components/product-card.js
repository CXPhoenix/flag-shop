import { store } from '../store.js';

export class ProductCard extends HTMLElement {
    set data(product) {
        this._product = product;
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="bg-hacker-gray border border-hacker-dark-green p-4 rounded-lg hover:shadow-[0_0_15px_#00ff00] transition-all duration-300 group h-full flex flex-col">
                <div class="text-6xl text-center mb-4 group-hover:scale-110 transition-transform cursor-default select-none">
                    ${this._product.image}
                </div>
                <h3 class="text-xl font-bold text-hacker-green mb-2">${this._product.name}</h3>
                <p class="text-gray-400 text-sm mb-4 flex-1">${this._product.description}</p>
                
                <div class="flex justify-between items-center mt-auto">
                    <span class="text-2xl font-mono text-white">$${this._product.price}</span>
                    <button class="add-to-cart-btn bg-hacker-dark-green text-hacker-green border border-hacker-green px-4 py-2 rounded hover:bg-hacker-green hover:text-black transition-colors font-bold uppercase tracking-wider">
                        加入購物車
                    </button>
                </div>
            </div>
        `;

        this.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            store.addToCart(this._product.id);
            
            const btn = this.querySelector('.add-to-cart-btn');
            const originalText = btn.innerText;
            btn.innerText = "已加入";
            btn.classList.add("bg-white", "text-black");
            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.remove("bg-white", "text-black");
            }, 500);
        });
    }
}

customElements.define('product-card', ProductCard);
