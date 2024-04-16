# プロジェクト名

読書管理アプリ - Read Scale

## Read Scale

読んだ本を登録すると書籍の厚みが高さに換算され、今までの読書記録を積み上げていくことができる読書管理アプリです。

## 動機

自分が本を読むのが大好きで、小さい頃から絵本、小説から漫画までたくさんの本を読んできました。
いままで読んだことのある本をまとめることで、どれくらいの書籍を読んできたのかを視覚化すると読書がより楽しくなると思い、制作しました。

## 目標

1. React/Next.jsを使用したアプリを最後まで作り切る
1. リファクタリングを行い、よりよい実装方法を模索する
1. テストコードの書き方を学ぶ
1. 今回の失敗経験を今後の個人制作のディレクトリ構造やコンポーネント設計に活かす

## 機能一覧

- **認証機能**

  - 新規会員登録
  - ログイン
  - ログアウト
  - パスワードの変更

- **検索機能**

  - Google Book APIを使用した書籍検索
  - 検索した書籍の並び替え
  - 書籍の読了日、ページ数の登録

- **マイページ**

  - アイコン画像の設定
  - 登録した書籍の累計の高さの表示
  - 累計の高さに応じたアイコンの表示
  - 登録済み書籍の読了日、ページ数の変更
  - 登録済み書籍の削除
  - 登録済み書籍を読了日の月、年で絞り込み

- **タイムライン**
  - 他ユーザーの書籍登録情報の表示

###　追加機能（実装予定）

- **マイページ**

  - フォロー、フォロワーの確認
  - フォローの登録、削除
  - 積み上げのSNS共有

- **他ユーザーマイページ**
  - フォロー機能
  - ユーザー情報の表示

## 使用技術

このプロジェクトでは以下の技術を使用しています

- **使用言語**

  - HTML
  - CSS
  - Typescript

- **ライブラリ**

  - Tailwind CSS
  - React

- **フレームワーク**

  - Next.js

- **外部API**

  - Google Book API

- **DB**

  - Cloud Firestore

- **ストレージ**

  - Cloud Storage for Firebase

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
src/
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

URLよりfigmaデザインの確認ができます。
https://www.figma.com/file/I03ssWJsITenc7cu3pzURF/Read-Scale?type=design&node-id=0%3A1&mode=design&t=Y1cT0JqxrgaY8MpP-1
