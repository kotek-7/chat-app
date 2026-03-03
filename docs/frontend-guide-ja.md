# フロントエンド作成ガイド（HTML + JS）

このガイドは、初心者が「APIを使ってLINE風チャット画面を作る」ことだけに集中できるように書いています。

## 1. 先に決めること
- APIのベースURL（イベント共通）: `https://doer-chat-api.up.railway.app`
- 今回使うルームID: `global`（固定）

## 2. 最小機能
まずは次の2つを作ればOKです。

- メッセージ一覧を表示する
- メッセージを投稿する

## 3. 画面の最小構成
- 名前入力欄（`userName`）
- メッセージ入力欄（`text`）
- 投稿ボタン
- メッセージ一覧表示エリア
- ステータス表示エリア（成功/失敗メッセージ）

## 4. APIの使い方
詳細は `docs/backend-guide-ja.md` と `docs/openapi.yaml` を参照してください。

### 4-1. 一覧取得
`GET /api/messages?limit=100`

レスポンスの `messages` 配列を画面に表示します。

### 4-2. 投稿
`POST /api/messages`

送信JSON:
```json
{
  "userName": "alice",
  "text": "こんにちは"
}
```

## 5. 実装ステップ（推奨）
1. まずHTMLだけで入力欄・ボタン・一覧エリアを作る
2. JSで `GET /api/messages` を呼んで一覧表示する
3. JSで `POST /api/messages` を実装する
4. 投稿成功後に再取得して一覧を更新する
5. 余裕があれば5秒ごと自動更新を入れる

## 6. 実装時の注意
- `userName` は1〜40文字、`text` は1〜500文字
- 空文字は送らない（送信前に `trim()` でチェック）
- APIエラー時は、画面に分かるメッセージを出す
- 表示時はHTMLエスケープしてXSSを避ける

## 7. AIに依頼するときのプロンプト例
```text
以下のAPI仕様に合わせて、HTML + vanilla JSで1ページのチャット画面を作ってください。
要件:
- 名前入力、メッセージ入力、投稿ボタン
- メッセージ一覧表示
- GET /api/messages?limit=100 で初期表示
- POST /api/messages で投稿
- 投稿成功後に再取得
- API_BASE は定数で切り替え可能
- エラー表示あり
```
