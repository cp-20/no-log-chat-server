# のーろぐちゃっと

![](https://no-log-chat.vercel.app/ogp.png)

のーろぐちゃっとはログが残らないことで、既存のチャットアプリにはあまり見られないリアルタイム性を追及したチャットアプリです

このリポジトリはサーバー側です。[クライアント側はこちら](https://github.com/cp-20/no-log-chat)

## アプリ

https://no-log-chat.vercel.app/

## 詳しくは

[Zenn の記事](https://zenn.dev/cp20/articles/no-log-chat-app) にまとめています

## 開発者クイックスタート

必要なもの: [Deno](https://deno.land/)

1. このリポジトリをクローンする

```
git clone https://github.com/cp-20/no-log-chat-server
```

2. サーバー起動

必要に応じて環境変数`PORT`を指定してください

```
deno run --allow-net --allow-env src/main.ts
```
