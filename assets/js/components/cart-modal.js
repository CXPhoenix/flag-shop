
import { store } from '../store.js';

export class CartModal extends HTMLElement {
    connectedCallback() {
        this.render();
        this.dialog = this.querySelector('dialog');
        // Close on backdrop click
        this.dialog.addEventListener('click', (e) => {
            if (e.target === this.dialog) this.close();
        });
        
        store.addEventListener('cart_updated', () => {
            if (this.dialog.open) this.updateCartItems();
        });

        store.addEventListener('checkout_success', () => {
            alert("購買成功！請檢查你的物品欄 (Console or Network for now, logic to be added)");
            this.close();
            
            this.checkInventoryForFlag();
        });
    }

    checkInventoryForFlag() {
        
    }

    open() {
        this.updateCartItems();
        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
    }

    updateCartItems() {
        const container = this.querySelector('#cart-items');
        const totalEl = this.querySelector('#cart-total');
        const items = store.state.cart;

        container.innerHTML = '';
        
        if (items.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 py-8">購物車是空的</p>';
        } else {
            items.forEach(item => {
                const row = document.createElement('div');
                row.className = 'flex justify-between items-center bg-hacker-gray p-3 rounded mb-2 border border-hacker-dark-green';
                row.innerHTML = `
                    <div class="flex-1">
                        <h4 class="font-bold text-hacker-green">${item.name}</h4>
                        <div class="text-sm text-gray-400">$${item.price} / 個</div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center">
                            <label class="mr-2 text-sm text-gray-400">數量:</label>
                            <input type="number" data-id="${item.id}" value="${item.qty}" 
                                class="qty-input bg-black text-white border border-hacker-green rounded w-20 px-2 py-1 text-right"
                                > 
                        </div>
                        <div class="w-24 text-right font-mono text-white">
                            $${item.price * item.qty}
                        </div>
                        <button class="remove-btn text-red-500 hover:text-red-400 ml-2" data-id="${item.id}">❌</button>
                    </div>
                `;
                container.appendChild(row);
            });
        }

        totalEl.textContent = store.cartTotal;
        
        // Check if affordable
        const checkoutBtn = this.querySelector('#checkout-btn');
        if (store.cartTotal > store.state.balance) {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
            checkoutBtn.innerHTML = "餘額不足 (還是你想駭入我？)";
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            checkoutBtn.innerHTML = "確認結帳";
        }

        this.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const qty = parseFloat(e.target.value); 
                store.updateCartItemQty(e.target.dataset.id, qty);
            });
        });

        this.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                store.removeFromCart(e.target.dataset.id);
            });
        });
    }

    render() {
        this.innerHTML = `
            <dialog class="bg-hacker-black border border-hacker-green text-green-500 rounded-lg shadow-[0_0_50px_rgba(0,255,0,0.2)] p-0 w-full max-w-2xl backdrop:bg-black/80">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6 border-b border-hacker-dark-green pb-4">
                        <h2 class="text-2xl font-bold font-mono">🛒 購物車</h2>
                        <button onclick="this.closest('cart-modal').close()" class="text-gray-500 hover:text-white text-2xl">&times;</button>
                    </div>

                    <div id="cart-items" class="max-h-[60vh] overflow-y-auto mb-6 custom-scrollbar">
                        <!-- Items injected here -->
                    </div>

                    <div class="border-t border-hacker-dark-green pt-4 flex justify-between items-end">
                        <div class="text-right flex-1">
                            <span class="text-gray-400 mr-2">總金額:</span>
                            <span class="text-3xl font-bold text-white font-mono">$<span id="cart-total">0</span></span>
                        </div>
                    </div>

                    <button id="checkout-btn" class="w-full mt-6 bg-hacker-green text-black font-bold py-3 rounded hover:bg-white transition-colors uppercase tracking-wider">
                        確認結帳
                    </button>
                </div>
            </dialog>
        `;

        this.querySelector('#checkout-btn').addEventListener('click', () => {
             
            const result = store.checkout();
            
            if (result && result.success) {
                let message = "購買成功！\n\n";
                result.items.forEach(item => {
                    message += `📦 ${item.name}`;
                    if (item.content) {
                        message += `\n   內容: ${item.content}`;
                    }
                    message += "\n\n";
                });
                window.customAlert(message, "🎉 交易完成");
                this.close();
            }
        });
    }
}

customElements.define('cart-modal', CartModal);
