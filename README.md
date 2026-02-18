![Flag Shop Banner](./img/banner.png)

# 🚩 飄揚商店 (Flag Shop) - Capture The Flag Challenge

![License](https://img.shields.io/badge/license-ECL--2.0-blue.svg)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/cxphoenix/easy-flag-shop)
![Category](https://img.shields.io/badge/category-Web%20Security-red.svg)
![Difficulty](https://img.shields.io/badge/difficulty-Easy-green.svg)

這是一個專為資安初學者設計的 Web CTF 挑戰。在這個模擬的 hacker 商店中，你需要利用邏輯漏洞來購買你買不起的 Flag。

## 🚀 快速開始

### 前置需求
- Python 3.x (用於啟動本地伺服器)
- 任何現代瀏覽器 (Chrome, Firefox, Safari)

### 安裝與執行

1.  Clone 此專案到本地：
    ```bash
    git clone <your-repo-url>
    cd ch1_easy-chall
    ```

2.  啟動本地伺服器：
    ```bash
    python -m http.server 8000
    ```

3.  打開瀏覽器並訪問：
    [http://localhost:8000](http://localhost:8000)

## 🎯 挑戰目標
你的目標是購買商店中價格高昂的 **"The Flag"** 商品。
你會發現你的初始餘額只有 $100，而 Flag 的價格遠高於此。你需要分析網頁的原始碼，找出邏輯漏洞來繞過限制。

## 📚 相關文件
- **[Writeup.md](./Writeup.md)**: 詳細的解題報告，包含漏洞分析 (CWE-1284) 與攻擊步驟。
- **[CHANGELOG.md](./CHANGELOG.md)**: 版本更新紀錄。

## ⚖️ License
本專案採用 **Educational Community License, Version 2.0 (ECL-2.0)** 授權。
詳細內容請參閱 [LICENSE](./LICENSE) 檔案。

> [!NOTE]
> 
> This project is for educational purposes only. The vulnerabilities demonstrated here are intentional.
