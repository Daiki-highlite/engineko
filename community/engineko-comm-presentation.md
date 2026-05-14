---
marp: true
theme: default
paginate: true
---

<style>
@import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

:root {
  --paper:       #FAFAF8;
  --ink:         #232323;
  --ink-2:       #4A4A4A;
  --ink-3:       #6B6B6B;
  --ink-4:       #9A9A9A;
  --ink-5:       #C8C8C8;
  --border:      #E0E0DC;
  --surface:     #F5F5F2;
  --silver-dark: #5A6870;
  --silver:      #8AABBA;
  --silver-pale: #EBF1F4;
  --gold:        #B89968;
  --gold-pale:   #E8DCC4;
}

section {
  background: var(--paper);
  color: var(--ink);
  font-family: 'Zen Kaku Gothic New', 'Hiragino Kaku Gothic ProN', sans-serif;
  font-size: 18px;
  line-height: 1.7;
  padding: 56px 64px;
}

/* ── ページ番号 ── */
section::after {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  color: var(--ink-4);
  letter-spacing: 0.15em;
}

/* ── 見出し ── */
h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 52px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--ink);
  line-height: 1.2;
  margin-bottom: 0.3em;
}

h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 30px;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--ink);
  border-bottom: 1px solid var(--border);
  padding-bottom: 12px;
  margin-bottom: 28px;
}

h3 {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--gold);
  margin-top: 24px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

/* ── テーブル ── */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 12px;
}
th {
  background: var(--surface);
  color: var(--ink-3);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}
td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--ink-2);
  vertical-align: top;
}
tr:last-child td { border-bottom: none; }

/* ── リスト ── */
ul, ol {
  padding-left: 1.4em;
  color: var(--ink-2);
}
li { margin-bottom: 6px; }
li strong { color: var(--ink); }

/* ── コードブロック（フロー図代用）── */
pre {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 20px 24px;
  font-size: 13px;
  color: var(--ink-2);
  line-height: 1.8;
}
code { font-family: 'Menlo', 'Consolas', monospace; }

/* ── ゴールドアクセント ── */
em {
  color: var(--gold);
  font-style: normal;
  font-weight: 600;
}

/* ── セクション区切り（ラベル）── */
.kicker {
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px;
  letter-spacing: 0.35em;
  color: var(--ink-4);
  text-transform: uppercase;
  margin-bottom: 16px;
}

/* ── タイトルスライド専用 ── */
section.title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--ink);
  color: #fff;
}
section.title h1 { color: #fff; font-size: 56px; }
section.title .kicker { color: var(--gold); }
section.title p { color: var(--ink-5); font-size: 14px; letter-spacing: 0.1em; }

/* ── 2カラムレイアウト ── */
.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 16px;
}
.cols-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin-top: 16px;
}

/* ── カード ── */
.card {
  background: #fff;
  border: 1px solid var(--border);
  border-top: 3px solid var(--gold);
  border-radius: 4px;
  padding: 20px;
}
.card .num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  color: var(--gold);
  line-height: 1;
  margin-bottom: 8px;
}
.card .label {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}
.card .desc {
  font-size: 12px;
  color: var(--ink-3);
  line-height: 1.5;
}

/* ── ハイライトボックス ── */
.callout {
  background: var(--gold-pale);
  border-left: 3px solid var(--gold);
  padding: 14px 20px;
  border-radius: 0 4px 4px 0;
  font-size: 15px;
  color: var(--ink-2);
  margin: 20px 0;
}

/* ── NG ボックス ── */
.ng {
  background: #FEF2F2;
  border-left: 3px solid #C24545;
  padding: 14px 20px;
  border-radius: 0 4px 4px 0;
  font-size: 14px;
  color: var(--ink-2);
  margin: 12px 0;
}

/* ── バッジ ── */
.badge {
  display: inline-block;
  background: var(--silver-pale);
  color: var(--silver-dark);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 2px;
  margin-bottom: 12px;
}
.badge.gold {
  background: var(--gold-pale);
  color: #7A6030;
}
</style>

<!-- ============================================================
     SLIDE 01 — TITLE
     ============================================================ -->

<!-- _class: title -->

<div class="kicker">ENGINEKO · Internal Review · 2026-05</div>

# 会員コミュニティ<br>設計

縁を結ぶ場の、設計と仕組み

<br>

参照：会員コミュニティ_事例リサーチ.md ／ 運営プラットフォーム検討.md

---

<!-- ============================================================
     SLIDE 02 — なぜコミュニティか：LTV問題
     ============================================================ -->

## なぜコミュニティが必要か

<!-- 図解エリア：左に「購入→接点消滅」の一本道の矢印図、右に「購入→コミュニティ→再購入→継続」のループ図を配置 -->

<div class="callout">
現状、ENGINEKOは ¥50,000 の一点販売。購買後に接点が切れ、<em>LTVは ¥50,000 で止まる。</em><br>高単価工芸品において、これは事業継続の最大リスクである。
</div>

### コミュニティの3層の目的

| 優先度 | 目的 | 問い |
|--------|------|------|
| **1位** | LTVの最大化 | 事業が持続する設計か |
| **2位** | ブランド哲学の体現 | 縁の連鎖が実際に起きているか |
| **3位** | コンテンツ・ストーリーの蓄積 | ブランド資産になっているか |

> 意思決定に迷ったときはこの順序で判断する。ただし、**1位が2位（ブランド哲学）と矛盾する設計は採用しない。**

---

<!-- ============================================================
     SLIDE 03 — LTV設計：4ドライバーと目標
     ============================================================ -->

## LTVを高める設計

<!-- 図解エリア：左に棒グラフ（¥50K→¥75K→¥130K の推移）を配置 -->

### LTVを構成する4つのドライバー

| ドライバー | 現状 | コミュニティがもたらす変化 |
|-----------|------|--------------------------|
| **購入頻度** | 1点購入が大半 | 次エディション・新色への購買意欲を月次で維持 |
| **購入単価** | ¥50,000 均一 | 上位エディション（¥80K〜）への優先アクセスで単価向上 |
| **継続期間** | 購買後に関係が切れる | 月次ライブ・工房訪問・先行情報で3〜5年継続 |
| **紹介** | 構造なし | 「縁の連鎖」リファラルでオーナーが新規を連れてくる |

<div class="cols">
<div class="card">
<div class="num">¥50K</div>
<div class="label">現状LTV</div>
<div class="desc">コミュニティなし / 1点購入のみ</div>
</div>
<div class="card">
<div class="num">¥75K</div>
<div class="label">Y1目標</div>
<div class="desc">追加購入 0.5点 + ZINE等</div>
</div>
<div class="card">
<div class="num">¥130K</div>
<div class="label">Y2目標</div>
<div class="desc">累計 2点化 + 上位エディション差額 + 紹介削減コスト</div>
</div>
</div>

---

<!-- ============================================================
     SLIDE 04 — コア接点：6つの特典設計
     ============================================================ -->

## コミュニティの核となる6接点

<!-- 図解エリア：6接点を六角形またはハニカム状に配置した図（各接点のLTVドライバーを矢印で示す） -->

| # | 接点 | LTVドライバー | 優先度 |
|---|------|-------------|--------|
| 1 | **月次窯入れライブ（1230℃ Live）オーナー限定視聴** | 継続期間 | ★★★ |
| 2 | **新色・限定エディション 先行案内・優先購入権** | 購入頻度・単価向上 | ★★★ |
| 3 | **Atelier Visit Toyama 工房訪問ツアー優先予約** | 継続期間・単価向上 | ★★★ |
| 4 | **上位エディション・一点物ライン優先購入権** | 単価向上 | ★★★ |
| 5 | **「縁の連鎖」リファラル（コンセプトブック記名）** | 紹介・新規獲得コスト削減 | ★★★ |
| 6 | **所有年数に応じた称号と非売品** | 継続期間 | ★★☆ |

<div class="callout">
目標：<em>コミュニティ参加オーナーのLTVを非参加者の2倍以上</em>にする。新規購入者の30%以上をオーナー経由の紹介に。
</div>

---

<!-- ============================================================
     SLIDE 05 — 設計しないこと（ブランド哲学との一貫性）
     ============================================================ -->

## 設計しないこと

<!-- 図解エリア：「ENGINEKOの5原則」を左側に配置し、各NGとの対応を線で繋ぐ図 -->

### ブランド哲学「押さない、消さない」との整合

<div class="ng">
<strong>ポイント制・ランク制</strong>　「貯める」動機はブランドと矛盾し、LTVより短期CVRを優先させる
</div>
<div class="ng">
<strong>頻繁なプッシュ通知・にぎやかな掲示板</strong>　静かさがENGINEKOの価値を守る。騒がしいコミュニティは縁を壊す
</div>
<div class="ng">
<strong>金銭的インセンティブによるリファラル</strong>　ブランドを毀損し、長期的なLTVを下げる。紹介は名誉として設計する
</div>
<div class="ng">
<strong>大規模スケール設計・パブリックコミュニティ</strong>　希少性と純度を守るために、質を量より優先する
</div>

<br>

> **判断基準：** LTVを高める施策が、ブランド哲学と矛盾していないかを常に確認する。

---

<!-- ============================================================
     SLIDE 06 — 事例マップ（8事例の概観）
     ============================================================ -->

## 事例リサーチ — 8事例の概観

<!-- 図解エリア：各事例を4象限マトリクス（横軸：物理体験↔デジタル体験 / 縦軸：一般↔高価格帯）にプロットした散布図 -->

| ブランド | カテゴリ | コミュニティ型 | LTV貢献 | 関連度 |
|---------|---------|--------------|--------|--------|
| Harley-Davidson H.O.G. | モーターサイクル | オーナーズクラブ | 継続期間・紹介 | ★★★ |
| Porsche Club of America | 高級自動車 | 体験型クラブ | 継続期間・単価向上 | ★★★ |
| Peloton | フィットネス機器 | ライブ継続型 | 継続・サブスク収益 | ★★★ |
| Minimal Collective | 工芸食品 | 招待制・非ポイント型 | 購入頻度・ロイヤルティ | ★★★ |
| Aesop | スキンケア | 哲学共鳴型 | 継続期間・ロイヤルティ | ★★★ |
| Astier de Villatte | 陶器（パリ） | コレクター型 | 購入頻度・継続期間 | ★★★ |
| Tesla Owners Club | 電気自動車 | 紹介×SNS型 | 紹介・獲得コスト削減 | ★★☆ |
| Glossier | コスメD2C | UGC×共創型 | 購入頻度・紹介 | ★★☆ |

ENGINEKOは **「体験継続型 × 世界観参加型 × コレクター型」** の組み合わせを目指す。

---

<!-- ============================================================
     SLIDE 07 — 主要事例から得た示唆
     ============================================================ -->

## 主要事例からの示唆

<!-- 図解エリア：3事例を横並びカードで、各カードに代表的なメカニズムを小さな矢印フローで図示 -->

<div class="cols-3">
<div>
<div class="badge">H.O.G.</div>

**記録文化の実装**

所有年数・走行距離を称える仕組みが離脱防止に機能。

→ ENGINEKOでは**所有年数の称号**と非売品で翻訳。継続期間を直接延ばす。
</div>
<div>
<div class="badge">Peloton</div>

**月次の習慣設計**

「日曜の朝に教会へ行くような体験」まで習慣化。やめる理由が消える。

→ **1230℃ Live** をオーナー限定の月次行事に。「次の窯を待つ」習慣がコミュニティを離れにくくする。
</div>
<div>
<div class="badge gold">Astier de Villatte</div>

**コレクター化の設計**

季節限定品・希少品が購入頻度と継続期間を同時に最大化。

→ ENGINEKOの**到達点**として参照。エディション設計・季節展開がLTV最大化の核になる。
</div>
</div>

<div class="callout" style="margin-top:28px">
<strong>Minimal Collective（国内最直接参照）</strong>：「ポイントなし・世界観への参加型」の設計思想が一致。非売品・限定品がコミュニティにいる価値を作る。
</div>

---

<!-- ============================================================
     SLIDE 08 — コミュニティ設計の骨格
     ============================================================ -->

## コミュニティ設計の骨格

<!-- 図解エリア：コミュニティ構造を「入口（購入）→場（特典）→出口（紹介・コレクター化）」の流れで図示 -->

<div class="cols">
<div>

### 基本設計

| 項目 | 設計 |
|------|------|
| **名称候補** | 縁の輪（En no Wa）／縁の座 |
| **入会条件** | ENGINEKO購入者のみ（自動入会） |
| **規模感** | 質優先・大きくしない |
| **投稿頻度** | 月2〜3回（窯入れ前後・イベント前） |
| **トーン** | 40字以内・絵文字なし・事実のみ |

</div>
<div>

### LTV計測の設計

```
コミュニティ参加オーナー
  vs
非参加オーナー

― 追加購入点数
― 購入間隔
― 紹介件数
― 継続月数

→ Klaviyo で四半期ごとに比較
```

</div>
</div>

---

<!-- ============================================================
     SLIDE 09 — プラットフォーム推奨構成
     ============================================================ -->

## プラットフォーム推奨構成

<!-- 図解エリア：Y1 / Y2のプラットフォーム構成を「Klaviyo（基盤）を中心に、LINE・Circle.soが接続される」アーキテクチャ図で表現 -->

### Y1（国内立ち上げ）：Klaviyo ＋ LINE

```
購入完了
  │
  ├─▶ Klaviyo ── LTV計測・購入者データ管理・メール自動フロー（基盤）
  │       └─▶ メール配信（先行案内 / 工房ライブ告知 / JOURNAL）
  │
  └─▶ LINE公式アカウント ── 国内オーナーとの日常的な接点
           └─▶ LINEグループ（招待制・最大100名）── オーナー同士の縁の場
```

### Y2（欧州展開）：Circle.so を追加

```
Circle.so ── 英語コンテンツアーカイブ・欧州オーナー向けイベント管理
               └─▶ Klaviyo と連携してLTV計測を継続
```

| プラットフォーム | 月額コスト | タイミング |
|----------------|-----------|-----------|
| Klaviyo | $0〜$45 | 即時（Shopify立ち上げと同時） |
| LINE公式アカウント | ¥0〜¥5,000 | Y1ローンチと同時 |
| Circle.so | $0（Y1は不使用） | Y2フェーズから $89/月〜 |
| **Y1合計** | **実質ほぼ ¥0** | オーナー100名規模では無料範囲内 |

---

<!-- ============================================================
     SLIDE 10 — Klaviyo自動フロー ＋ 次のアクション
     ============================================================ -->

## 購入後フロー設計 ＆ 次のアクション

<!-- 図解エリア：左にKlaviyo自動フローのタイムライン（横軸：日数）、右にアクション一覧 -->

<div class="cols">
<div>

### Klaviyo 自動フロー（購入後）

```
Day  0  ウェルカムメール
         + LINE登録へ招待

Day  3  ブランドコンセプトメール
         「縁（En）について」

Day 14  工房・職人紹介メール
         「富山工房から」

Day 30  1230℃ Live 案内
         「来月の窯入れ、先行でご案内」

Day 60  次エディション先行案内
         「次の縁が、生まれます」

以降：月次で窯・新色・イベント情報
```

</div>
<div>

### 次のアクション

- [ ] **コミュニティの名称を決める**
- [ ] Klaviyo の Shopify 連携を設定する
- [ ] 購入後の自動フロー（〜Day 60）を実装する
- [ ] LINE公式アカウントを開設し購入後の導線に組み込む
- [ ] LINEグループの招待条件・運営ルールを確定する
- [ ] ローンチ時の特典セット3点を選定する
- [ ] Y2フェーズのCircle.so 試用タイミングを計画する

<br>

<div class="callout">
<em>最優先：</em>Klaviyo の Shopify 連携設定。LTV計測の基盤がなければ、コミュニティの効果を検証できない。
</div>

</div>
</div>
