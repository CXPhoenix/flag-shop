# Changelog

本專案的所有重大變更都將記錄於此文件中。

## [1.1.0] - 2026-02-20

### 新增 (Added)
- **結構化解題報告 (Structured Writeup)**: 引入 `ctf-writeup-writing` 規範，以偵探敘事風格重寫 `writeup.md`。
- **漏洞知識卡 (Pattern Card)**: 於解題報告中新增漏洞模式分析，涵蓋前提條件、嗅覺線索與現實安全意義。

### 變更 (Changed)
- **文件規範化 (Documentation Standardization)**: 將解題報告檔案名稱統一為小寫 `writeup.md` 並更新 `README.md` 中的相關連結。
- **解題邏輯修正 (Writeup Logic Fix)**: 修正解題報告中的計算範例，使 Flag 價格（$1,000）與攻擊腳本中的負數偏移量保持一致。

## [1.0.0] - 2026-02-18

### 新增 (Added)
- **安全部署工作流程 (Secure Deployment Workflow)**: 新增 `.github/workflows/deploy.yml` 以自動化部署至 GitHub Pages。
  - 實作安全建置流程 (Secure Build Process)，僅複製 `index.html` 與 `assets/` 至 `dist/` 資料夾。
  - 於建置過程中動態產生加密的 `products.json`，防止原始資料 (Source Data) 外洩。
- **自訂警告視窗 (Custom Alert Modal)**: 使用駭客風格的 `<alert-modal>` Web Component 取代瀏覽器原生的 `alert()`。
- **Shift+6 混淆 (Shift+6 Obfuscation)**: 實作 Shift+6 位移加密 (含混淆函式名稱 `_0x5a1b`/`_0x26db16`) 以取代原本的 XOR 方法，符合 CTF 題目參考設計。

### 變更 (Changed)
- **前端程式碼清理 (Frontend Cleanup)**: 移除所有用戶端 JavaScript 檔案中可能洩漏邏輯的註解，僅保留 JSDoc 型別提示 (Type Hints) 以隱藏漏洞邏輯。
- **混淆邏輯 (Obfuscation Logic)**: 更新 `utils/crypto.js` 與 `store.js` 改用新的簡單位移加密 (Simple Shift Cipher) 處理商品內容的加解密。

### 修正 (Fixed)
- 修正 `cart-modal.js` 中因 Markdown 格式殘留導致的語法錯誤 (Syntax Error)。
