# バックエンド仕様（初心者向け + AI向け）

この仕様書は、運営側が提供する共通バックエンドAPIを利用する前提です。参加者はこの仕様に合わせてフロントエンドを実装します。

## 共通バックエンドURL
- `https://doer-chat-api.up.railway.app`

## 1. このAPIでできること
- グローバルルーム（1つ固定）のチャットメッセージを取得する
- グローバルルームにメッセージを投稿する

## 2. ルール
- ルームは `global` の1つだけ
- 投稿時に必要な値は `userName` と `text`
- `userName`: 1〜40文字
- `text`: 1〜500文字

## 3. エンドポイント
### GET `/health`
サーバー起動確認。

レスポンス例:
```json
{ "ok": true }
```

### GET `/api/rooms`
ルーム一覧取得（実質1件）。

レスポンス例:
```json
{
  "rooms": [
    { "id": "global", "name": "Global Room" }
  ]
}
```

### GET `/api/messages?limit=50`
最新メッセージを取得。

クエリ:
- `limit`（任意）: 1〜200

レスポンス例:
```json
{
  "messages": [
    {
      "id": 1,
      "roomId": "global",
      "userName": "alice",
      "text": "こんにちは",
      "createdAt": "2026-03-03T12:00:00.000Z"
    }
  ]
}
```

### POST `/api/messages`
メッセージ投稿。

リクエスト例:
```json
{
  "userName": "alice",
  "text": "はじめまして"
}
```

成功レスポンス（201）:
```json
{
  "message": {
    "id": 2,
    "roomId": "global",
    "userName": "alice",
    "text": "はじめまして",
    "createdAt": "2026-03-03T12:01:00.000Z"
  }
}
```

エラーレスポンス（400/500）:
```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "入力が不正です"
  }
}
```

## 4. AIに渡すときのポイント
- 厳密仕様は `docs/openapi.yaml` を渡す
- 実装意図はこの `backend-guide-ja.md` を渡す
- 生成コードでは `POST /api/messages` のバリデーション（文字数制約）を必ず保持する
