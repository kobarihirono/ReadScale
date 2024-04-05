# プロジェクト名

読書管理アプリ - Read Scale

## Read Scale

読んだ本を登録すると書籍の厚みが高さに換算され、今までの読書記録を積み上げていくことができる読書管理アプリです。

## 機能一覧

- **認証機能**

  - 新規会員登録
  - ログイン
  - パスワードの変更

- **検索機能**

  - Google Book APIを使用した書籍検索
  - 検索した書籍の並び替え
  - 書籍の読了日の登録

- **マイページ**

  - アイコン画像の設定
  - 登録した書籍の累計の高さの表示
  - 登録済み書籍の読了日変更
  - 登録済み書籍の削除

- **タイムライン**
  - 他ユーザーの登録情報の表示

## 使用技術

このプロジェクトでは以下の技術を使用しています

- **使用言語**

  - HTML
  - CSS
  - Javascript

- **ライブラリ**

  - Tailwind CSS
  - React

- **フレームワーク**

  - Next.js

- **外部API**

  - Google Book API

- **DB**

  - Firestore

- **認証**

  - Firebase Authentication

- **テスト**

  - Jest
  - React Testing Library

- **デザインツール**

  - figma

- **エディタ**

  - VisualStudio Code

- **ホスティング**
  - Vercel

## src ファイル構成

```plaintext
scr/
|
|-- app/ # サイト全体のページ構造
|   |-- types # 型設定ファイルを格納
|   |--
|   |-- 
|
|-- components/ # 再利用可能な UI コンポーネント
|   |-- Buttons/ # ボタンを格納するファイル
|   |    |-- AuthButton.tsx # 認証に使用するボタン
|   |    |-- ...
|   |-- ...
| 
|-- common/ # UIライブラリなどの設定
|   |-- ...
|
|-- lib/ # カスタムフックやfirebaseのconfigなどを格納
|   |-- apis # firebase関連のapi
|   |-- hooks # カスタムフック
|   |-- ...
|
|-- page/ # 外部APIを使用する際の設定を格納
|   |-- apis # firebase関連のapi
|   |-- ...
|
`-- ...
```

## テスト

### テスト仕様書

## デザイン

以下URLよりデザインの確認ができます。
https://www.figma.com/file/I03ssWJsITenc7cu3pzURF/Read-Scale?type=design&node-id=0%3A1&mode=design&t=Y1cT0JqxrgaY8MpP-1
