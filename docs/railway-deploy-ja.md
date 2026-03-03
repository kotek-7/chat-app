# Railwayデプロイ手順（バックエンド）

このプロジェクトは `railway.json` とルート `Dockerfile` を用意しているため、Railwayにそのままデプロイできます。

## 1. Railwayプロジェクト作成
1. Railwayで新規プロジェクトを作成
2. このリポジトリを接続
3. サービスとしてこのリポジトリを選択（Dockerfileが自動検出されます）

## 2. PostgreSQLを追加
1. 同じプロジェクトに `PostgreSQL` サービスを追加
2. バックエンドサービスの環境変数 `DATABASE_URL` に、PostgreSQLの `DATABASE_URL` を参照として設定

## 3. 環境変数
- `DATABASE_URL`（必須）
- `PORT` はRailway側が自動設定するため、通常は手動設定不要

## 4. デプロイ後の確認
- ヘルスチェック: `GET /health`
- API:
  - `GET /api/rooms`
  - `GET /api/messages?limit=20`
  - `POST /api/messages`

## 5. 参加者向け公開情報
イベント参加者には次を共有すればフロント実装を始められます。
- APIベースURL（例: `https://xxx.up.railway.app`）
- [backend-guide-ja.md](./backend-guide-ja.md)
- [openapi.yaml](./openapi.yaml)
- [frontend-guide-ja.md](./frontend-guide-ja.md)
