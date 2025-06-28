# hiking-3d-map

開発ステータス: 開発中止

登山中に現在の位置を 3D 表示するマップ

https://naotaro0123.github.io/hiking-3d-map/

## TODO

- Waymarked Trails を参考に同じ API で処理を変更
- API Host: https://hiking.waymarkedtrails.org/
- 登山名からルート検索 API: /api/v1/list/search?query=高尾山
- 登山道リストから一つを選択 API: /api/v1/details/relation/{id}

- 1. 登山名を入力
- 2. ルート選択
- 3. ルートに Zoom し地図でハイライト
- 4. 現在地を調べる
- 5. 距離を割り出す

## Build Setup

```ts
# install dependencies
$ yarn

# launch server
$ yarn dev

# build for production and launch server
$ yarn build

# Lint Fix
$ yarn lint

# deploy github page
$ yarn deploy

```
