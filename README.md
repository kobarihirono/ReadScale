# プロジェクト名

読書管理アプリ - Read Scale

## Read Scale

読んだ本を登録すると書籍の厚みが高さに換算され、今までの読書記録を積み上げていくことができる読書管理アプリです。

## URL
以下のURLよりアプリを体験できます。

https://read-scale-9ka5plcwx-kobaris-projects.vercel.app/

メールアドレス：test@test.com
パスワード：Test1234

### 実際の挙動

https://github.com/kobarihirono/ReadScale/assets/131847306/63394ad3-08ef-4d79-b6f6-9b1475321a72

## 制作の動機

自分が本を読むのが大好きで、小さい頃から絵本、小説から漫画までたくさんの本を読んでいました。
いままで読んだことのある本をまとめ、どれくらいの書籍を読んできたのかを視覚化すると読書がより楽しくなると思い、制作しました。

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
  - 書籍の読了日の登録

- **マイページ**

  - アイコン画像の設定
  - 登録した書籍の累計の高さの表示
  - 累計の高さに応じたアイコンの表示
  - 登録済み書籍の読了日の変更
  - 登録済み書籍の削除

- **タイムライン**
  - 他ユーザーの書籍登録情報の表示

### 追加機能（予定）

- **マイページ**

  - 月毎、年ごとの積み上げグラフ
  - 今月のベスト書籍、今年のベスト書籍の登録・表示
  - SNS共有

## 使用技術

このプロジェクトでは以下の技術を使用しています

- **使用言語**

  - HTML
  - Typescript

- **ライブラリ**

  - Tailwind CSS
  - Chakra UI
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
|   |-- Footer.tsx
|   |-- Header.tsx
|   |-- ...
|
|-- components/ # UI コンポーネント
|
|-- common/ # UIライブラリなどの設定
|
|-- lib/ # カスタムフックやfirebaseのconfigなどを格納
|   |-- apis # firebase関連のapi
|   |-- hooks # カスタムフック
|   |-- ...
|
|-- page/ # 外部APIを使用する際の設定を格納
|   |-- apis
|
`-- ...
```

## テスト

### テスト仕様書

## デザイン

URLよりfigmaデザインの確認ができます。
https://www.figma.com/file/I03ssWJsITenc7cu3pzURF/Read-Scale?type=design&node-id=0%3A1&mode=design&t=Y1cT0JqxrgaY8MpP-1
