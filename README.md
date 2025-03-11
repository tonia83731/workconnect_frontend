# WORKCONNECT (Vue Vite + Pinia + NodeJS + Mongodb)

## 製作背景/目的

本平台目的為提供一個高效的計畫規劃與溝通工具，讓團隊能夠在線上協作，管理日程，並提升工作效率。無論是團隊專案還是個人行程安排，都能透過本平台輕鬆掌握進度，確保計畫順利執行。

## 專案使用者

- 想透過平台進行計畫規劃，並透過其進行線上溝通的團隊
- 想透過平台管理日程的個別使用者

## DEMO

- 前端開發連結請參考[這裡](workconnect-frontend-omega.vercel.app)
- 後端開發使用Nodejs + Expressjs + Mongodb，相關資訊請參考:
  - CODING: [https://github.com/tonia83731/workconnect_backend](https://github.com/tonia83731/workconnect_backend)
  - DOCUMENTS: [https://github.com/tonia83731/workconnect_backend_docs](https://github.com/tonia83731/workconnect_backend_docs)

## 專案介紹(User Story)

- 使用者可以 註冊或登入 APP: 當使用者註冊成功時，WORKCONNECT會寄信至使用者信箱進行通知
- 登入後，使用者可以看到擁有權限的Workspace及目前被邀請的Workspace
- 登入後，使用者可以接受/拒絕Workspace邀請
- 登入後，使用者可以更改個人姓名、Email、頭像背景顏色、頭像文字顏色
- 進入Workspace後，使用者可以看到代辦清單、成員名單、聊天區
- 使用者可以新增、修改、刪除 Bucket，文件夾，代辦清單 (Todo可編輯項目包含: 標題、日期、進度、負責人、備註及（記事）清單)
- 使用者可以托拽代辦清單來更改順序或文件夾
- 使用者可以邀請、取消邀請成員，被邀請的成員會收到邀請信
- 使用者可以(必須是管理員)移除成員；也可以設立/取消設立管理員 → 每個Workspace可以擁有3個管理員
- 使用者可以切換工作區(即回到Dashboard)，或直接選擇登出

##　專案角色

- 前端與後端的開發與優化: 根據需求提供相對應的API (使用MongoDB)，並交付前端進行視覺化顯示

## 專案挑戰與解決

- 問題: 開發即時溝通(Chat Room)時，沒辦法根據現實情況追蹤上線的成員及發送的訊息。需透過重新整理才能看到最新訊息
  - 解決方法: 在前端Vue框架需增加以下資訊:
  ```javascript
  export const socket = io(import.meta.env.VITE_API_URL, {
    transports: ['websocket'], // Force WebSocket
    withCredentials: true, // Allow cross-origin requests if needed
  })
  ```
  也需透過重複的`console.log`確認`socket.io`是否在`client`端運作正常

## 使用工具

- vue @3.5.13
- vue-router @4.5.0
- pinia @2.3.0
- pinia-plugin-persistedstate @4.2.0
- axios @1.7.9
- socket.io-client @4.8.1
- @vee-validate/i18n @4.15.0
- @vee-validate/rules @4.15.0
- dayjs @1.11.13
- vue-multiselect @3.1.0
- vue3-emoji-picker @1.1.8
- vue3-toastify @0.2.8
- eslint @9.14.0

## 後續發展

- 目前DATA設計: Workspace > Workbucket > Workfolder > Todo
  Workfolder內的Todo可以更換Workfolder，後續需擴大考慮Workfolder(連同內部的Todo)是否可以更換Workbucket
- 考慮是否要加入1v1的Chat Room (無需進入Workspace也可以聊天)
- Chat Room是否可以建立最新消息通知，包含溝通內容、創建內容、新加入的成員等

## 專案設定

```sh
git clone [https://github.com/tonia83731/workconnect_frontend.git](https://github.com/tonia83731/workconnect_frontend.git)
```

```sh
npm install
```

```sh
npm run dev
```
