export class AlertModal extends HTMLElement {
    connectedCallback() {
        this.render();
        this.dialog = this.querySelector('dialog');
        this.titleEl = this.querySelector('#alert-title');
        this.messageEl = this.querySelector('#alert-message');
        this.okBtn = this.querySelector('#alert-ok-btn');

        this.okBtn.addEventListener('click', () => {
            this.close();
            if (this._resolve) {
                this._resolve();
                this._resolve = null;
            }
        });

        // Expose globally for easy replacement of window.alert
        window.customAlert = (message, title = '系統訊息') => this.show(message, title);
    }

    show(message, title = '系統訊息') {
        this.titleEl.textContent = title;
        this.messageEl.innerHTML = message.replace(/\n/g, '<br>');
        this.dialog.showModal();
        return new Promise(resolve => {
            this._resolve = resolve;
        });
    }

    close() {
        this.dialog.close();
    }

    render() {
        this.innerHTML = `
            <dialog class="bg-hacker-black border-2 border-hacker-green text-hacker-green rounded-lg shadow-[0_0_30px_#00ff00] p-0 w-full max-w-3xl backdrop:bg-black/80">
                <div class="p-6 text-center">
                    <div class="text-6xl mb-4">⚠️</div>
                    <h2 id="alert-title" class="text-2xl font-bold font-mono mb-4 text-white"></h2>
                    <p id="alert-message" class="text-lg mb-8 font-mono break-words text-left inline-block"></p>
                    
                    <button id="alert-ok-btn" class="w-full bg-hacker-green text-black font-bold py-2 rounded hover:bg-white transition-colors uppercase tracking-wider">
                        確 認
                    </button>
                </div>
            </dialog>
        `;
    }
}

customElements.define('alert-modal', AlertModal);
