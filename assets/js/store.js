import { decrypt } from './utils/crypto.js';

class Store extends EventTarget {
    constructor() {
        super();
        this.state = {
            balance: 100,
            cart: [], // { id, qty, ...product }
            products: [],
            user: {
                name: "Hacker101"
            }
        };
    }

    async init() {
        try {
            const response = await fetch('./assets/data/products.json');
            this.state.products = await response.json();
            this.notify('products_loaded');
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    get balance() { return this.state.balance; }
    get cart() { return this.state.cart; }
    get products() { return this.state.products; }

    addToCart(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.state.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            this.state.cart.push({ ...product, qty: 1 });
        }
        this.notify('cart_updated');
    }

    updateCartItemQty(productId, qty) {
        // Validation 1: No decimals Allowed (Strict check for UI, but vulnerability might bypass this if logic allows)
        // User requirement: "product quantity cannot be decimal"
        if (!Number.isInteger(qty)) {
            // Check if customAlert exists (might be called before UI loads, though unlikely in this architecture)
            if (window.customAlert) window.customAlert("錯誤：數量不能為小數！", "❌ 輸入錯誤");
            else alert("錯誤：數量不能為小數！");
            return;
        }

        const item = this.state.cart.find(i => i.id === productId);
        if (item) {
            item.qty = qty;
            if (item.qty === 0) {
                this.removeFromCart(productId);
            } else {
                this.notify('cart_updated');
            }
        }
    }

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        this.notify('cart_updated');
    }

    get cartTotal() {
        return this.state.cart.reduce((total, item) => total + (item.price * item.qty), 0);
    }

    checkout() {
        const total = this.cartTotal;
        
        // Validation 2: Total cannot be negative (Vulnerability prerequisite)
        if (total < 0) {
            if (window.customAlert) window.customAlert("錯誤：購物車總金額不能小於 0！", "⛔️ 非法操作");
            else alert("錯誤：購物車總金額不能小於 0！");
            return { success: false };
        }

        // Validation 3: Balance check
        if (total > this.state.balance) {
            if (window.customAlert) window.customAlert("餘額不足！", "💸 資金短缺");
            else alert("餘額不足！");
            return { success: false };
        }

        // Success!
        const purchasedItems = [...this.state.cart];
        this.state.balance -= total;
        this.state.cart = [];
        this.notify('cart_updated'); // Clear cart UI
        this.notify('state_changed'); // Update balance UI

        // Decrypt purchased items content
        const decryptedItems = purchasedItems.map(item => {
            return {
                ...item,
                content: item.content ? decrypt(item.content) : ""
            };
        });

        return { success: true, items: decryptedItems };
    }

    notify(event) {
        this.dispatchEvent(new CustomEvent(event, { detail: this.state }));
    }
}

export const store = new Store();
window.store = store; // For debugging/hacking console access
