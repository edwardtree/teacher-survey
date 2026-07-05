# STATUS — 老師合作調查表

最後更新：2026-07-05（本次治理標準化＋實地重新驗證，取代 2026-07-02 附錄快照）

## 現況一句話

前端（GitHub Pages）與後端（GAS Web App）**都實測正常運作中**（2026-07-05 WebFetch 實測開啟兩個 URL 皆回應正常）。系統本身沒有故障，未完事項都是「文件/流程債」與「一個無法遠端驗證的雲端設定」。

## 雲端部署版本與日期

- 前端 git 最後一次 commit：`d23ea01`（2026-05-22）「修改Q4問題文字：改為詢問從事事業的故事與原因」，已 push 到 `origin/main`，GitHub Pages 用此分支自動部署。
- 後端 GAS（`gas-project/Code.js`）：附錄記載 2026-06-28 曾用 clasp 更新過，**這個時間點在 git log 裡看不到**（該資料夾被 `.gitignore` 排除、不受這個 git 倉庫版控），本次未重新確認 clasp 端是否有更新的版本。
- 兩邊本次（2026-07-05）健康檢查皆通過：前端頁面內容正常顯示、後端 `doGet` 回傳「後端服務運作正常」。

## 進行中的工作

目前沒有已知「進行中」的開發工作——這是一個穩態運作中的單人小工具，主要是治理/文件債待清。

## 未完事項（承接 2026-07-02 附錄「問題清單」，本次逐項重新確認仍未處理）

| 優先度 | 項目 | 狀態 |
|---|---|---|
| 高 | 刪除或改名根目錄舊版 `google-apps-script.js` 為 `_archive`，避免未來改錯檔 | 未處理（本次僅建立空的 `_archive/`，刻意沒搬檔案，見下方候選清單） |
| 中 | 更新 `SETUP.md`：金鑰改走 Script Property、部署改講 clasp、補上 `setupSyncTrigger` 首次設定步驟 | 未處理 |
| 中 | 登入 script.google.com 確認 `syncPendingToNotion` 的每 10 分鐘 time-based trigger 真的存在 | **未處理，且無法遠端/本機驗證**，需要人工登入 GAS 後台確認一次並記錄確認日期 |
| 中 | 前端 `no-cors` 送出無法得知後端真實結果，成功頁可能是假象 | 未處理（程式碼現狀確認仍是如此） |
| 低 | 新填答無通知機制（可加 MailApp/LINE 通知） | 未處理 |
| 低 | Drive/Notion 資料夾與資料庫 ID 硬編碼在 `Code.js` | 未處理（非機密，非急迫） |

## 一次性/疑似舊版候選檔案（本輪未搬動，留給下一輪個別確認）

- `google-apps-script.js`（根目錄，2026-05-21）——已被 `gas-project/Code.js` 取代的舊版後端，`SETUP.md` 目前仍教人用這份，是最大的「改錯檔」風險來源。
- `SETUP.md` 本身不是要丟棄，但內容有相當部分描述的是舊版流程（見 CLAUDE.md「現行 vs 已淘汰」表），建議下一輪重寫而非封存。

## 本次治理標準化做了什麼

- 讀附錄 915-987 行素材，並實地重新探索 `老師合作資料\` 資料夾，確認真正專案根目錄是子資料夾 `合作調查表\`（`老師合作資料\` 底下沒有其他內容）。
- 用 WebFetch 實測前端 GitHub Pages URL 與後端 GAS Web App URL，兩者皆正常回應（見上「雲端部署版本與日期」）。
- 確認 git 倉庫本來就存在（remote 指向 `github.com/edwardtree/teacher-survey.git`），本輪**沒有動它**，只新增 CLAUDE.md / STATUS.md / `_archive/.gitkeep` 三個檔案（未 commit，留給使用者或下一輪確認後再 commit）。
- 建立空的 `_archive/`（含 `.gitkeep`），**沒有搬動任何檔案**，候選清單見上。

## 下次對話建議動作（若使用者要求繼續清理這個專案）

1. 先確認 `git status` 是否要把這次新增的 CLAUDE.md/STATUS.md/_archive 加入 commit。
2. 人工登入 script.google.com 該專案，確認 `syncPendingToNotion` 觸發器狀態，寫回本檔。
3. 徵求同意後，把 `google-apps-script.js` 搬進 `_archive/` 並改寫 `SETUP.md`。
