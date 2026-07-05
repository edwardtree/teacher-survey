# 老師合作調查表 — CLAUDE.md

> 本檔案由跨專案治理標準化工作建立（2026-07-05），素材來源：
> `專案整理\附錄_各專案詳細體檢_2026-07-02.md`（915-987 行）＋本次實地重新驗證。
> 下次對話請先讀本檔＋STATUS.md，不要重新探索整個資料夾。

## 一句話定位

「大小樹教育學院—老師合作調查表」：一個靜態問卷網頁（GitHub Pages）收集想合作的老師資料，
POST 到 Google Apps Script (GAS) Web App，後端把填答存成 Markdown 到 Google Drive／Obsidian Vault，
並同步寫入 Notion 資料庫（含失敗重試與待補送佇列）。用途是篩選、建檔潛在合作教育者。

**專案根目錄澄清**：給定的起點 `老師合作資料\` 底下只有一個子資料夾
`合作調查表\`，那才是真正的程式碼與 git 倉庫所在，本 CLAUDE.md／STATUS.md／_archive
都建立在 `老師合作資料\合作調查表\` 這一層，不是上一層的 `老師合作資料\`。

## 部署地圖（2026-07-05 已實地開啟確認皆正常運作）

- **前端（GitHub Pages）**：`https://edwardtree.github.io/teacher-survey/`
  - Git remote：`https://github.com/edwardtree/teacher-survey.git`（分支 main）
  - 實測：WebFetch 開啟後回傳「大小樹教育學院 ✕ 老師合作調查表」問卷頁面，含機構介紹／16題問卷／感謝頁，正常。
- **後端（GAS Web App）**：
  - URL：`https://script.google.com/macros/s/AKfycbwxwuTSd_KxNsOgN1lZlbQ5Q1m09dDUGQhmgIXv6_cqRQ0kXvowR3LAmBrq7SEdEgrQeQ/exec`
  - 實測：WebFetch GET 該 URL（會 302 導到 script.googleusercontent.com）回傳「大小樹教育學院合作調查表後端服務運作正常。」，doGet 健康檢查通過。
  - scriptId（`gas-project/.clasp.json`）：`1G5yAZm3dhEK1e3oFTdLPKIP9ug4MiONYMq-Vlsy368tVbPLDUu7Eq8GP`
  - `executeAs: USER_DEPLOYING`、`access: ANYONE_ANONYMOUS`（見 `gas-project/appsscript.json`）
  - 時區：`Asia/Taipei`（GAS 專案設定與 CONFIG.TIMEZONE 都是這個）
- **資料落地**：
  - Google Drive 主資料夾 ID：`1NLpkHrX6W4YXjGx5EsWaVmJpB21JjG_6`
  - Obsidian Vault 資料夾 ID：`10VZYbI8OYFZ8JJD3LI3-HeB5BN_pVzgQ`
  - Notion 資料庫 ID：`367ebdb7-1903-81db-af20-ef1469c1b5a6`
  - 待補送佇列檔：`_notion_pending.json`，存在上面 Drive 主資料夾裡（不是本機檔案）
- **排程（雲端 GAS time-based trigger，非本機 cron）**：
  - `syncPendingToNotion` 每 10 分鐘執行一次，由 `setupSyncTrigger()` 建立。
  - **待確認**：本機／git 無法確認這個 trigger 目前是否真的存在於雲端（要登入
    https://script.google.com 該專案的「觸發條件」頁面才能看到）。若當初沒執行過
    `setupSyncTrigger()`，失敗的 Notion/Obsidian 補送會永遠卡在 `_notion_pending.json`
    裡沒人知道。**這是本專案唯一真正需要人工確認的事**，附錄與本次都沒有實地登入 GAS 後台驗證。
  - 沒有本機固定排程（無 cron/n8n workflow），與全域 CLAUDE.md 提到的「04:00-04:30 自動化高峰」無關。

## 現行 vs 已淘汰對照表

| 檔案 | 狀態 | 說明 |
|---|---|---|
| `gas-project/Code.js` | **現行**，唯一真相 | 讀 Script Property `NOTION_TOKEN`、有佇列＋重試＋`setupSyncTrigger`。用 `clasp push` 部署，最後更新約 6/28（clasp 同步不進 git，git log 看不到這個時間點）。 |
| `google-apps-script.js`（根目錄） | **已淘汰，勿改** | 2026-05-21 舊版，`CONFIG` 留空、無佇列/觸發器機制。`SETUP.md` 目前仍教人貼這份檔案，是文件落後於程式碼，**不要照 SETUP.md 字面操作**，實際要改要推的是 `gas-project/Code.js`。 |
| `script.js`（前端，GitHub Pages 用） | 現行 | 第 5 行 `GAS_URL` 已指向上面的正式 `/exec` 網址，`mode: 'no-cors'` 送出。 |
| `index.html` / `style.css` | 現行 | GitHub Pages 三檔之二，git 有追蹤。 |
| `SETUP.md` | **部分過時** | 說金鑰直接填 `CONFIG`、沒提 clasp、沒提 `setupSyncTrigger`／佇列機制，實際已改讀 Script Property。需要照真實流程操作時以本檔（CLAUDE.md）為準，不要照 SETUP.md 逐字做。 |

## 勿讀清單

- `.git/`（物件庫，不用讀）
- `node_modules/`、`__pycache__/`（目前資料夾內沒有，但 `gas-project/.gitignore` 已預留排除規則）
- 大型輸出／媒體檔（目前資料夾內沒有圖片/影片，如未來有問卷附件匯出可歸這類）
- `_archive/`（一次性/舊版檔案的存放處，除非要找歷史版本否則不用讀）

## 常用操作 Runbook

- **改前端**（問卷文字、樣式）：直接改 `index.html` / `style.css` / `script.js` → `git add` → `git commit` → `git push`（push 到 `origin/main` 即會透過 GitHub Pages 自動部署，URL 不變，約 1 分鐘生效）。
- **改後端**（GAS 邏輯、Notion 欄位對應）：只改 `gas-project/Code.js` → 需要用 `clasp push`（`gas-project/.clasp.json` 已有 `scriptId`，前提是本機有裝 `clasp` 且已 `clasp login`；本次未驗證本機是否已裝 clasp）→ 回到 GAS 編輯器「部署→管理部署→新版本」發佈（URL 不會變）。
  - 注意：`gas-project/` 整個資料夾被上層 `.gitignore` 排除，git 不追蹤這裡的變更，版本歷史只存在 Apps Script 自己的版本紀錄或 clasp 的本機檔案，**git log 看不到後端的變更歷史**。
- **健康檢查**：瀏覽器或 `curl` 開啟上面的 GAS Web App URL，應看到「後端服務運作正常」。前端「送出問卷」用 `no-cors`，送出後永遠顯示成功頁，**不代表後端真的存成功**——要驗證要嘛去查 GAS「執行記錄」，要嘛去 Notion/Drive 資料夾看有沒有新紀錄。
- **改 Notion 欄位**：Notion 資料庫屬性名稱是中文固定字串（稱呼、LINE ID、信箱…），改資料庫欄位名稱要同步改 `gas-project/Code.js` 的 `saveToNotion()` 裡的 payload key，兩邊沒對上會直接被 Notion API 拒絕。

## 跨專案依賴

- 與 `_金鑰中心`：Notion API Token 存在 **GAS 自己的 Script Property**（`NOTION_TOKEN`），不是存在 `_金鑰中心`，本次沒看到本專案程式碼裡有明文金鑰（`NOTION_API_KEY` 一律用 `PropertiesService.getScriptProperties().getProperty(...)` 讀取）。若之後要盤點/輪換金鑰，這一份要單獨去 GAS 後台的「專案設定→指令碼屬性」改，`_金鑰中心` 的資安體檢報告若沒列到這個 Token 要提醒補上。
- 與「資料庫延伸功能」／其他專案：附錄記載為「無程式相依，僅服務對象（合作老師）重疊」，本次未重新驗證此點（不影響本專案運作，判斷為低風險，不列入本次 surprises）。
- 與 Google Drive／Obsidian Vault：資料落地共用同一個 Google 帳號的 Drive，Obsidian Vault 資料夾若被搬動/改名，`OBSIDIAN_FOLDER_ID` 需要同步更新，否則 Obsidian 補送會持續失敗並卡進待補送佇列。

## 已知問題（節錄自 2026-07-02 附錄，2026-07-05 尚未處理，細節見 STATUS.md）

1. 舊版 `google-apps-script.js` 與現行 `gas-project/Code.js` 並存，容易改錯檔（本次確認問題依然存在）。
2. `SETUP.md` 與現行程式流程不一致（本次確認問題依然存在）。
3. `syncPendingToNotion` 的每 10 分鐘雲端觸發器是否真的啟用，無法從本機/git 驗證（本次仍未能驗證，見上「排程」一節）。
4. 前端 `no-cors` 送出，使用者看到的成功頁不代表後端真的存檔成功（程式碼本次確認仍是這個寫法）。
5. 無新填答通知機制、Drive/Notion ID 硬編碼在 Code.js（低優先度，細節見附錄）。
