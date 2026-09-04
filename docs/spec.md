# Product Match 仕様書 v0.1

## 1．サービス概要

### 1.1 サービス名

仮称：**Product Match**

### 1.2 コンセプト

Product Matchは，Webサービス・SaaS・アプリなどを**1対1のトーナメント形式で発見・評価するプロダクト発見プラットフォーム**である．

Product Huntのように多数のサービスを同時にランキング表示するのではなく，すべてのサービスが必ず他の1サービスと1対1で対戦する．

各Matchは24時間開催され，ログインユーザーの投票数が多かったサービスが次Roundへ進む．

1つのArenaには128サービスが参加し，7日間のシングルエリミネーショントーナメントでChampionを決定する．

### 1.3 基本コピー案

> Two products．One winner．

または，

> Discover products，one battle at a time．

### 1.4 Product Huntとの差別化

Product Hunt：

* 多数のサービスが同日に並ぶ
* 下位サービスは露出が少ない
* Upvote数によるランキング

Product Match：

* 必ず1 vs 1
* 参加したサービスは必ず対戦画面の50％を占める
* 128サービスによるトーナメント
* 勝てば翌日も露出される
* Championまで7連勝する必要がある
* 各サービスに対戦履歴が残る

---

# 2．基本原則

Product Matchでは以下を最重要原則とする．

### 2.1 Pay to Winは禁止

課金によって，

* 得票数
* Matchの勝敗
* 表示順
* Match内での優遇
* 投票倍率

を変更してはならない．

### 2.2 Matchは単純多数決

各Matchは，

> 得票数が多いサービスが勝利

のみで判定する．

Elo Ratingや補正スコアなどは勝敗判定には使用しない．

### 2.3 対戦相手はランダム

同一Arena内のサービスをサーバー側でランダムシャッフルし，対戦カードを生成する．

カテゴリによるマッチング補正は行わない．

### 2.4 1サービスにつき同時に1Matchのみ

1つのProductが同時に複数のMatchへ参加することは禁止する．

### 2.5 投票にはログイン必須

投票，コメント，Product登録にはアカウントを必要とする．

1ユーザーにつき1Match1票までとする．

---

# 3．主要用語

| 用語         | 意味                     |
| ---------- | ---------------------- |
| Product    | 登録されたWebサービス・アプリ       |
| Maker      | Productを登録したユーザー       |
| Arena      | 128 Productから構成される1大会  |
| Match      | 2 Productによる1対1の対戦     |
| Round      | トーナメントの各段階             |
| Champion   | Arenaで7連勝したProduct     |
| Vote       | Matchに対するユーザーの投票       |
| Entry      | ProductのArena参加情報      |
| Gate Match | サイトへ入る前に要求されるランダムMatch |

---

# 4．トーナメント仕様

## 4.1 Arena

標準Arenaサイズ：

**128 Product**

トーナメント構造：

| Day   | Round        | Product数 | Match数 |
| ----- | ------------ | -------: | -----: |
| Day 1 | Round of 128 |      128 |     64 |
| Day 2 | Round of 64  |       64 |     32 |
| Day 3 | Round of 32  |       32 |     16 |
| Day 4 | Round of 16  |       16 |      8 |
| Day 5 | Quarterfinal |        8 |      4 |
| Day 6 | Semifinal    |        4 |      2 |
| Day 7 | Final        |        2 |      1 |

最終的に1 ProductがChampionとなる．

## 4.2 Arena生成

Approved状態かつArena未参加のProductをEntry Queueに追加する．

Queue内で古いProductから128件取得する．

128件揃った時点でArenaを生成する．

例：

Arena #001
Arena #002
Arena #003

登録数が多い場合は複数Arenaを同時開催可能とする．

例えば512 Productが待機している場合，

Arena A：128
Arena B：128
Arena C：128
Arena D：128

として4大会を並列開催できる．

## 4.3 Arena開始時刻

全Roundは共通のUTC基準時刻で切り替える．

具体的な開始時刻は環境変数またはAdmin Settingsから変更可能とする．

例：

`ROUND_START_HOUR_UTC = 15`

Arenaに128 Productが揃った場合，次のRound Start時刻から大会を開始する．

これによりProduct登録から概ね1日前後でMatchが開始される設計とする．

## 4.4 初期組み合わせ

Arena作成時に128 Productを暗号学的乱数でシャッフルする．

シャッフル後，

1 vs 2
3 vs 4
5 vs 6
…

として64 Matchを生成する．

カテゴリ，過去戦績，知名度等は一切考慮しない．

---

# 5．Match仕様

## 5.1 Match期間

原則：

**24時間**

開始：

`starts_at`

終了：

`ends_at = starts_at + 24 hours`

## 5.2 Match表示

左右または上下に2 Productを同等サイズで表示する．

表示内容：

* Logo
* Product name
* Tagline
* Screenshot
* 簡単なDescription
* Category
* Pricing type
* Visit Website
* Vote button

質問文の初期値：

> Which product would you rather try？

## 5.3 Visit

各Productカードに，

**Visit**

ボタンを設置する．

クリックすると新しいタブでProduct公式サイトを開く．

Visitしても投票とはみなさない．

以下をAnalyticsとして保存する．

* match_id
* product_id
* user_id
* clicked_at

## 5.4 Vote

ユーザーはAまたはBのどちらか一方のみ選択できる．

投票後の変更は禁止する．

DBレベルで，

`UNIQUE(match_id, user_id)`

を設定する．

フロントエンドのみで重複投票を防ぐ実装は禁止する．

## 5.5 投票結果

投票前：

得票数，割合は表示しない．

投票後：

A 58％
B 42％
Total 1,842 votes

のように表示する．

Match終了後は未投票ユーザーにも最終結果を公開する．

## 5.6 勝敗

`ends_at`到達後，

A得票数 > B得票数

ならA勝利．

B得票数 > A得票数

ならB勝利．

Winnerを，

`winner_product_id`

として保存する．

## 5.7 同票

通常Match：

24時間終了時に同票の場合，30分間のOvertimeへ移行する．

Overtime中に最初にリードしたProductを勝者とする．

Finalなど注目度が高いMatchでも同一仕様とする．

最大Overtime：

60分

それでも完全同票の場合のみサーバー側のランダム抽選でWinnerを決定する．

この場合，

**Won by tiebreak draw**

と履歴に明示する．

---

# 6．次Round生成

Round終了後，Supabase CronまたはServer Functionを実行する．

処理：

終了Match取得

↓

各MatchのWinner確定

↓

Winner一覧取得

↓

既存Bracket構造に従って次Match生成

↓

次Round開始

重要：

Round 1以降は再シャッフルしない．

一般的なTournament bracketと同様，

Round 1で決定されたBracketの流れを最後まで維持する．

---

# 7．Productの参加制限

同一Productは，

* 同時に複数Arenaへ参加不可
* 同時に複数Matchへ参加不可

とする．

Arena終了後は再参加可能．

敗北ProductはそのArenaでは復活不可．

---

# 8．再挑戦

## MVP

課金機能は実装しない．

敗北後，

**Join another Arena**

から再度Queueへ参加可能とするか，運営判断で一定期間Cooldownを設ける．

初期案：

敗北後7日間は同一Productの再Entry不可．

## 将来

再Entryを有料化可能な設計にする．

例：

初回参加：無料

再挑戦1回目：$5
再挑戦2回目：$10
再挑戦3回目：$20
再挑戦4回目：$40

ただし，

**同一Arenaへの復活は絶対に認めない．**

課金で購入できるのは，

> 新しいArenaへ再Entryする権利

のみとする．

---

# 9．同一Product間の過去対戦

例えば，

MolSketch vs Product A

が複数Arenaで発生した場合，Match自体は別物として保存する．

ただしProduct detailでは累積対戦成績を表示する．

例：

### Head to Head

MolSketch vs Product A

Matches：4
MolSketch：3 wins
Product A：1 win

Total votes：

MolSketch：3,842
Product A：2,991

---

# 10．入口Gate

Product Matchの特徴的な機能とする．

## 10.1 基本仕様

ユーザーがサイト内部へアクセスした場合，まずランダムなActive Matchを表示する．

ユーザーはそのMatchへ投票することでサイト内部へ入ることができる．

初期設定：

**1 Match必須**

設定値：

`ENTRY_REQUIRED_VOTES = 1`

将来的には，

1
2
3

をA/Bテストできるようにする．

## 10.2 Gate Match選択

対象：

* Active Match
* ユーザーが未投票
* 自分のProductが参加していないMatch

からランダム選択する．

MVPでは完全ランダムで良い．

将来的には，票数の少ないMatchへ若干高い確率を与えるWeighted Randomも導入可能とする．

## 10.3 Gate解除

Gate Matchへ投票後，

`access_granted_at`

を記録する．

同一ブラウザSession中は再度Gateを要求しない．

再訪時は再度1票を要求する．

UXを見ながら，

* Session単位
* 6時間
* 12時間
* 24時間

のいずれかへ変更可能にする．

---

# 11．認証

## 11.1 Auth

Supabase Authを利用する．

初期対応：

* Google
* GitHub
* Email

海外ユーザー中心なのでGoogleログインを最上部に配置する．

## 11.2 ログイン必須操作

以下はログイン必須：

* Vote
* Comment
* Product登録
* Product編集
* Product再Entry
* Maker dashboard

## 11.3 非ログインユーザー

以下は閲覧可能：

* Landing Page
* Product Match概要
* Login / Signup
* 利用規約
* Privacy Policy

Matchへ投票しようとするとLogin Modalを表示する．

---

# 12．User Profile

保存情報：

* id
* username
* display_name
* avatar_url
* bio
* website_url
* x_handle
* created_at
* updated_at

Public Profileでは，

* Maker name
* Profile image
* Products
* Championships
* Total Match wins

を表示可能とする．

---

# 13．Product登録

## 13.1 登録可能ユーザー

ログインユーザーのみ．

原則として，

**自分が所有・開発・運営するProductのみ登録可能**

とする．

## 13.2 登録項目

必須：

* Product Name
* URL
* Tagline
* Description
* Logo
* Primary screenshot
* Category

任意：

* Additional screenshots
* Pricing
* X account
* GitHub URL
* Demo URL
* Maker comment

## 13.3 Tagline

最大：

80 characters

## 13.4 Description

最大：

2,000 characters

## 13.5 Screenshots

Primary screenshot：

1枚必須

追加：

最大4枚

合計最大5枚．

画像はSupabase Storageへ保存する．

---

# 14．Product審査

## MVP推奨

**Manual Approval**

状態：

`draft`

↓

`submitted`

↓

`under_review`

↓

`approved`

または

`rejected`

## 14.1 審査基準

以下を満たす必要がある．

* URLが正常に開く
* Productとして最低限利用可能
* 明らかなScamではない
* Malwareではない
* 違法サービスではない
* Duplicateではない
* 成人向けサービスではない
* Product情報が極端に不十分ではない

## 14.2 将来

一定品質が確保できれば自動Approvalへ移行可能．

ただし初期段階ではManual Approval推奨．

---

# 15．Product所有確認

MVP：

Makerによる自己申告＋Admin確認．

将来的には以下を選択可能にする．

* DNS TXT verification
* HTML meta tag
* `.well-known/productmatch.txt`
* 公式ドメインメール確認

Verification済みProductには，

**Verified Maker**

Badgeを表示する．

---

# 16．Product Detail Page

URL：

`/products/[slug]`

表示：

### Header

Logo
Name
Tagline
Visit Website

### Gallery

Screenshots

### Description

詳細説明

### Stats

Total Matches
Wins
Losses
Championships
Final appearances
Current streak

### Match History

Arena #12

Product A 58％
Product B 42％

WIN

など．

### Head-to-Head

過去に複数回対戦した相手との累積成績．

### Comments

Productに対するコメント．

---

# 17．Comment

Product Huntに近いコメント機能を提供する．

## MVP

Product単位のComment．

項目：

* id
* product_id
* user_id
* body
* created_at
* updated_at
* deleted_at

ログインユーザーのみ投稿可能．

## 将来

* Reply
* Like
* Maker badge
* Pin
* Report

を追加可能．

---

# 18．Arena Page

URL：

`/arenas/[arena_number]`

例：

`/arenas/42`

表示：

**Arena #42**

128 Products

September 2–9

Round：

Round of 128
Round of 64
Round of 32
Round of 16
Quarterfinal
Semifinal
Final

Bracketを表示する．

Desktop：

横方向Bracket．

Mobile：

Round selector形式．

例：

`Round of 16 ▼`

を選ぶと該当Match一覧を表示．

---

# 19．Home

Gate突破後のHome画面．

主要セクション：

### Live Now

現在ActiveなMatch．

### Close Battles

差が小さいMatch．

例：

51％ vs 49％

ただし未投票ユーザーには割合を直接見せない．

「Very close」

程度の表示に留めることも検討する．

### Current Arenas

現在進行中のArena一覧．

### Latest Champions

直近のChampion．

### New Products

新しく登録されたProduct．

### Popular Products

累積勝利数が多いProduct．

---

# 20．Match Page

URL：

`/matches/[id]`

投票前：

Product A

VS

Product B

だけを中心に表示．

投票後：

結果
投票総数
Match残り時間
Comment / Discussion
Share

を表示．

---

# 21．ランキング

Product MatchではEloを使用しない．

基本ランキング指標はすべて実際の勝敗を使用する．

### Most Wins

累積Match勝利数．

### Most Championships

Arena Champion回数．

### Longest Win Streak

連勝記録．

### Most Finals

Final進出回数．

### Recent Champions

最近のChampion．

Primary Rankingは，

**Total Match Wins**

とする．

同率の場合：

1．Championships
2．Final appearances
3．直近勝利日時

の順でTie Breakする．

---

# 22．共有機能

Product Matchの成長に非常に重要．

Matchごとに，

**Share on X**

ボタンを配置する．

投稿例：

> ⚔️ MolSketch vs Product B
>
> We’re competing on Product Match today．
> Who gets your vote？

Final：

> 🏆 Product Match Final
>
> MolSketch vs Product B
>
> Voting ends in 6 hours．

Champion：

> 🏆 MolSketch won Product Match Arena #42．
>
> 7 matches．7 wins．

Share URLにはMatch IDを含める．

---

# 23．公式X自動投稿

将来実装．

以下イベントを自動投稿可能とする．

* Arena開始
* Round開始
* Semifinal開始
* Final開始
* Champion決定
* 注目Match
* 接戦
* Upset

例：

> ⚔️ Arena #42 starts now
> 128 products．7 days．1 winner．

ただしMVPでは手動投稿でも良い．

---

# 24．通知

Makerに以下を通知する．

### Product

* Submission received
* Approved
* Rejected

### Arena

* Assigned to Arena
* Arena starts tomorrow

### Match

* Match started
* 6 hours remaining
* Match won
* Match lost

### Tournament

* Semifinal reached
* Final reached
* Champion

初期：

Email

将来：

In-app notifications

---

# 25．DB設計

Supabase PostgreSQLを使用する．

## profiles

```text
id uuid PK
username text UNIQUE
display_name text
avatar_url text
bio text
website_url text
x_handle text
created_at timestamptz
updated_at timestamptz
```

## products

```text
id uuid PK
owner_id uuid FK profiles
name text
slug text UNIQUE
url text
tagline text
description text
logo_url text
category_id uuid
pricing_type text
x_url text
github_url text
demo_url text
status text
is_verified boolean
created_at timestamptz
updated_at timestamptz
```

## product_screenshots

```text
id uuid PK
product_id uuid FK
image_url text
sort_order integer
created_at timestamptz
```

## arenas

```text
id uuid PK
arena_number integer UNIQUE
arena_size integer DEFAULT 128
status text
starts_at timestamptz
ends_at timestamptz
champion_product_id uuid NULL
created_at timestamptz
```

## arena_entries

```text
id uuid PK
arena_id uuid FK
product_id uuid FK
seed_number integer
status text
eliminated_round integer NULL
final_position integer NULL
created_at timestamptz
```

Constraint：

```text
UNIQUE(arena_id, product_id)
```

## matches

```text
id uuid PK
arena_id uuid FK
round_number integer
bracket_position integer
product_a_id uuid FK
product_b_id uuid FK
winner_product_id uuid NULL
product_a_vote_count integer DEFAULT 0
product_b_vote_count integer DEFAULT 0
status text
starts_at timestamptz
ends_at timestamptz
overtime_ends_at timestamptz NULL
tiebreak_type text NULL
created_at timestamptz
updated_at timestamptz
```

## votes

```text
id uuid PK
match_id uuid FK
user_id uuid FK
product_id uuid FK
created_at timestamptz
```

Constraint：

```text
UNIQUE(match_id, user_id)
```

## product_comments

```text
id uuid PK
product_id uuid FK
user_id uuid FK
body text
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz NULL
```

## outbound_clicks

```text
id uuid PK
product_id uuid FK
match_id uuid NULL
user_id uuid NULL
source text
created_at timestamptz
```

## access_grants

```text
id uuid PK
user_id uuid FK
session_id text
gate_vote_count integer
granted_at timestamptz
expires_at timestamptz
```

---

# 26．Product状態

```text
draft
submitted
under_review
approved
rejected
archived
```

---

# 27．Arena状態

```text
filling
scheduled
active
completed
cancelled
```

---

# 28．Entry状態

```text
queued
active
eliminated
champion
withdrawn
```

---

# 29．Match状態

```text
scheduled
active
overtime
completed
cancelled
```

---

# 30．投票処理

Clientから直接Vote tableへINSERTさせない．

Server ActionまたはPostgres RPC経由で実行する．

処理：

1．ログイン確認
2．Match取得
3．Match status確認
4．現在時刻確認
5．ProductがMatch参加Productか確認
6．既投票確認
7．自己Productへの投票制限確認
8．Vote INSERT
9．Vote Count更新
10．結果返却

すべてTransaction内で行う．

---

# 31．Vote Count

MVPでもMatch tableに，

`product_a_vote_count`

`product_b_vote_count`

を持つ．

Vote INSERT時にDatabase TriggerまたはRPCでAtomic Incrementする．

これにより毎回votes tableをCOUNTする必要をなくす．

定期的に実Vote数とCached Vote CountのIntegrity Checkを実行する．

---

# 32．投票結果の秘匿

重要：

Supabase Clientからvotes tableを自由にSELECTできないようにする．

投票前ユーザーがDevToolsから結果を取得できないよう，

RLSでVote rowsを非公開にする．

Vote後またはMatch終了後のみServer経由でAggregate Resultを返す．

---

# 33．RLS

## products

READ：

公開Productは誰でも可能．

CREATE：

authenticated userのみ．

UPDATE：

ownerのみ．

DELETE：

ownerまたはadmin．

## votes

CREATE：

authenticated userのみ．

READ：

clientから直接不可．

UPDATE：

不可．

DELETE：

不可．

## matches

READ：

可能．

CREATE：

server/adminのみ．

UPDATE：

server/adminのみ．

DELETE：

adminのみ．

## arenas

READ：

可能．

WRITE：

server/adminのみ．

---

# 34．不正投票対策

最低限：

* Login必須
* Email/OAuth verification
* 1 user / 1 match / 1 vote
* Server-side validation
* Rate Limit
* IP単位の異常検知
* 短時間大量アカウントの監視

不自然なVote spikeをAdmin Dashboardに表示する．

例：

通常：

100 votes/hour

突然：

3,000 votes/5min

の場合，Flagを立てる．

ただしMakerによる正当なSNS拡散もあり得るため，自動削除は行わない．

Admin Review対象とする．

---

# 35．自己投票

Product owner本人は，自分のProductが参加するMatchへ投票不可とする．

ただし共有・コメントは可能．

---

# 36．Admin Dashboard

URL：

`/admin`

Adminのみアクセス可能．

### Overview

* Active Arenas
* Active Matches
* Waiting Products
* Pending Reviews
* Votes today
* Users today
* Suspicious activity

### Products

* Approve
* Reject
* Edit
* Archive

### Arenas

* Create
* Start
* Cancel
* View bracket

### Matches

* View
* Force close
* Recalculate votes
* Cancel
* Manual winner override

Manual overrideを行った場合はAudit Logへ記録する．

### Users

* Search
* Suspend
* Ban

### Comments

* Hide
* Delete
* Restore

---

# 37．Audit Log

重要なAdmin操作は記録する．

```text
id
admin_id
action
entity_type
entity_id
before_data
after_data
created_at
```

対象：

* Product approval
* Product rejection
* Match override
* Vote removal
* User suspension
* Arena cancellation

---

# 38．Frontend技術

### Framework

Next.js

App Router

TypeScript

### Hosting

Vercel

### Styling

Tailwind CSS

必要に応じてshadcn/uiなどを利用可能．

---

## 38.1 ディレクトリ構成

実装開始時は，Next.jsアプリケーションとSupabase定義を以下の構成で管理する．

```text
product-match/
├── apps/
│   └── web/                     # Next.js（App Router）
│       ├── app/                 # 画面・Route Handler・Server Actions
│       ├── components/          # UIコンポーネント
│       ├── features/            # Product、Arena、Match等の機能単位
│       ├── lib/                 # Supabase client、共通ユーティリティ
│       ├── public/              # 静的アセット
│       └── types/               # TypeScript型定義
├── supabase/
│   ├── migrations/              # PostgreSQLスキーマ・RLS定義
│   ├── functions/               # Edge Functions
│   └── seed.sql                 # 開発用初期データ
├── docs/
│   └── spec.md                  # 本仕様書
├── .env.example                 # 必要な環境変数の雛形
├── .gitignore
├── package.json
└── README.md
```

`features/`配下は，少なくとも`products`，`arenas`，`matches`，`votes`，`auth`，`admin`に分割する．

---

# 39．Backend

Supabaseを中心に構成する．

### Database

Supabase PostgreSQL

### Authentication

Supabase Auth

### Storage

Supabase Storage

### Scheduled Jobs

Supabase Cron

### Server Functions

Next.js Server Actions

または

Supabase Edge Functions

---

# 40．インフラ構成

```text
User Browser
     │
     ▼
Next.js
     │
     ▼
Vercel
     │
     ├── Server Actions
     │
     ▼
Supabase
     ├── PostgreSQL
     ├── Auth
     ├── Storage
     └── Cron
```

---

# 41．Cron

少なくとも以下を用意する．

### Match Settlement

5分ごと．

終了時刻を過ぎたActive Matchを検索．

Winner確定．

### Round Advancement

Round内の全Match終了後，

次Roundを生成．

### Arena Completion

Final終了後，

Championを確定．

### Integrity Check

1日1回．

Vote Countとvotes tableの整合性確認．

---

# 42．主要Route

```text
/
```

LandingまたはGate

```text
/login
/signup
```

Auth

```text
/discover
```

Home

```text
/arenas
```

Arena一覧

```text
/arenas/[number]
```

Arena bracket

```text
/matches/[id]
```

Match

```text
/products/[slug]
```

Product Detail

```text
/submit
```

Product登録

```text
/dashboard
```

Maker Dashboard

```text
/dashboard/products/[id]
```

Product管理

```text
/profile/[username]
```

User Profile

```text
/admin
```

Admin

---

# 43．Maker Dashboard

表示：

### My Products

Product一覧

### Current Match

現在参加中Match

### Tournament Status

Arena
Round
Opponent
Remaining time

### Past Results

過去Match

### Analytics

* Match impressions
* Votes
* Win/Loss
* Website clicks
* Click-through rate

MVPでは無料提供する．

---

# 44．Product Analytics

Maker本人のみ閲覧可能．

最低限：

Match impressions
Votes received
Vote share
Visit clicks
CTR
Wins
Losses

例：

```text
Match impressions   4,821
Votes                3,104
Votes for you        1,918
Vote share           61.8%
Website visits         342
CTR                    7.1%
```

---

# 45．SEO

Product DetailはServer Side Renderingする．

各Productに，

Title
Description
OG Image
Canonical URL

を設定．

ArenaとMatchにもOG Imageを生成する．

例：

```text
MolSketch
VS
Product B

58% — 42%
```

終了Matchは検索可能なArchiveとして残す．

---

# 46．OG Image

Match共有時に自動生成する．

表示：

Product A Logo
VS
Product B Logo

Match終了前：

`Voting now`

終了後：

`58% vs 42%`

Final：

`FINAL`

Champion：

`ARENA #42 CHAMPION`

SNS拡散に重要なため優先度は高い．

---

# 47．レスポンシブ

Desktop：

2 Productを左右表示．

Mobile：

上下表示．

両Productの情報量を完全に同一にする．

Aを常に上，Bを常に下に固定すると位置バイアスが生じるため，ユーザー単位でA/B表示順をランダム化することを推奨する．

ただしVote集計上のA/B IDは変更しない．

---

# 48．公平性

以下を必須とする．

* Product card面積同一
* Screenshotサイズ同一
* Description文字数同一上限
* CTAデザイン同一
* A/B表示位置ランダム化
* Vote count投票前非表示
* Paid boostなし
* Sponsored Matchなし

---

# 49．Analytics Event

最低限以下を保存する．

```text
page_view
gate_impression
gate_vote
match_impression
vote
product_view
website_click
comment_create
product_submit
product_approved
match_share
arena_view
```

外部Analyticsサービスを使用する場合でも，重要イベントはDB側にも保存可能な設計とする．

---

# 50．エラー処理

### Match終了直前投票

Serverが現在時刻を確認する．

Client表示で残り1秒でも，Server到達時点で終了していれば無効．

### Product削除

Active Match中はProduct削除不可．

### Productサイト停止

AdminがMatchを停止可能．

### Opponent失格

相手が規約違反等で失格した場合，

もう一方をWalkover Winnerとする．

### Arena途中キャンセル

重大障害時のみAdminがArena全体をcancelled可能．

---

# 51．初期ユーザー獲得問題

標準Arenaは128 Productだが，ローンチ直後に128 Makerを集められない可能性がある．

そのためDB上は，

```text
arena_size
```

を固定128ではなく可変とする．

対応可能サイズ：

16
32
64
128

正式版：

128

Beta：

16または32

として開始可能．

これにより最初の大会を早く成立させられる．

---

# 52．MVP

MVPでは以下に絞る．

### 必須

* Auth
* Product submission
* Product approval
* Product detail
* Arena
* Match
* Vote
* Gate
* Tournament advancement
* Comments
* Maker Dashboard
* Admin
* Basic share
* Mobile support

### MVPでは不要

* Payment
* Paid re-entry
* X API自動投稿
* Advanced analytics
* API
* Realtime vote animation
* Category tournaments
* Notifications center
* Follow
* DM
* Reviews
* Rating
* Elo

---

# 53．開発優先順位

## Phase 1

Auth
Supabase schema
RLS
User profile

## Phase 2

Product submission
Storage
Product detail
Admin approval

## Phase 3

Arena generation
Bracket generation
Match
Voting
Vote validation

## Phase 4

Cron
Winner settlement
Automatic next Round
Champion determination

## Phase 5

Entry Gate
Discover page
Arena pages
Comments

## Phase 6

Maker Dashboard
Analytics
Share
OG images

## Phase 7

Anti-abuse
Moderation
Performance optimization

---

# 54．成功指標

ローンチ初期に見る数字：

### User

Signups
DAU
Votes / visitor
Votes / signed-in user

### Product

Submissions / week
Approved products / week

### Tournament

Average votes / Match
Minimum votes / Match
Arena completion rate

### Discovery

Product views
Website outbound clicks
Click-through rate

### Retention

D1
D7
Returning voters

### Viral

Share rate
Traffic from shared Matches
Maker-driven traffic

---

# 55．Product Matchの最重要ループ

MakerがProductを登録

↓

Arenaへ参加

↓

1 vs 1開始

↓

MakerがXでMatchを共有

↓

ユーザーがProduct Matchへ流入

↓

GateまたはMatchへ投票

↓

他Productを発見

↓

Maker自身も別Productを登録

↓

新しいArenaが成立

↓

再びBattle

という循環を作る．

---

# 56．サービスの本質

Product Matchは単なるProduct HuntのランキングUI変更ではない．

中心となる体験は，

> **プロダクトをスポーツのように観戦する**

ことである．

Product Hunt：

「今日は何が人気？」

Product Match：

「今日は誰と誰が戦っている？」

という違いを作る．

したがってUIやコピーも，

Launch
Upvote
Ranking

より，

Arena
Match
Round
Opponent
Win
Loss
Champion

を中心に設計する．

---

# 57．現時点で固定してよい仕様

* Next.js
* Vercel
* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage
* 128 Product / Arena
* 7 Round
* 24h / Match
* Single elimination
* Random matchmaking
* 1 Product = 1 Active Match
* Login required to vote
* 1 User = 1 Vote / Match
* Product owner submission only
* Product Hunt型Product Detail
* Commentsあり
* Vote countは投票前非表示
* Gate Match必須
* Gateは初期1票
* ArenaごとにChampion
* 勝敗履歴を永久保存
* Global Rankingは実勝利数ベース
* Pay to Winなし
* MVPでは課金なし
* 将来Paid Re-entryのみ検討

---

# 58．今後決めればよい仕様

開発を開始するうえで今すぐ決めなくてもよいもの：

* 正式サービス名
* Brand color
* Logo
* Arena開始UTC時刻
* Gateを1票か2〜3票にするか
* Product審査をいつまでManualにするか
* Beta Arenaを16／32／64のどれにするか
* 再Entry Cooldown
* Paid Re-entry価格
* X自動投稿
* Category Arena
* Advanced Analytics
* Maker Verification方式

これらはDBを作り直さなくても後から変更できる設計とする．

---

# 59．MVP完成条件

以下がすべて動けば最初の公開版とする．

1．ユーザーがGoogle等でログインできる．
2．Makerが自分のProductを登録できる．
3．AdminがProductを承認できる．
4．Approved ProductがQueueへ入る．
5．Arenaが自動生成される．
6．Productがランダムに1 vs 1へ配置される．
7．ユーザーがMatchへ1票だけ投票できる．
8．24時間後にWinnerが自動確定する．
9．Winnerのみ次Roundへ進む．
10．7 Round後にChampionが決まる．
11．全Match履歴がProductページに残る．
12．サイト入口でGate Matchが表示される．
13．Gateへ投票するとDiscover画面へ入れる．
14．Product詳細を閲覧できる．
15．公式サイトへ遷移できる．
16．コメントできる．
17．Arena bracketを確認できる．
18．Makerが自分の戦績を確認できる．
19．Adminが不正Product・User・Commentを管理できる．
20．スマートフォンでも問題なく利用できる．

ここまでをProduct Match v1.0の完成条件とする．
