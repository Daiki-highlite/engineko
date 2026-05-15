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

/* ── チャプター区切りスライド ── */
section.chapter {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--surface);
}
section.chapter h1 {
  font-size: 44px;
  color: var(--ink);
}
section.chapter .kicker { color: var(--gold); }

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

/* ── ランクカード ── */
.rank-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 16px;
}
.rank-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 20px 22px;
}
.rank-card .rank-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 0.12em;
  line-height: 1.1;
  margin-bottom: 2px;
}
.rank-card .rank-roman {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--ink-4);
  margin-bottom: 10px;
}
.rank-card .rank-cond {
  font-size: 12px;
  color: var(--ink-3);
  border-top: 1px solid var(--border);
  padding-top: 10px;
  margin-top: 10px;
  line-height: 1.6;
}
.rank-card .rank-perks {
  font-size: 12px;
  color: var(--ink-2);
  margin-top: 8px;
  line-height: 1.6;
}
.rank-en  { border-top: 3px solid var(--silver); }
.rank-en  .rank-label { color: var(--silver-dark); }
.rank-ma  { border-top: 3px solid var(--ink-3); }
.rank-ma  .rank-label { color: var(--ink-2); }
.rank-wabi { border-top: 3px solid var(--gold); }
.rank-wabi .rank-label { color: var(--gold); }
.rank-ensho { border-top: 3px solid var(--gold); background: var(--gold-pale); }
.rank-ensho .rank-label { color: #7A6030; }
</style>

<!-- ============================================================
     SLIDE 01 — TITLE
     ============================================================ -->

<!-- _class: title -->

<div class="kicker">ENGINEKO · Internal Review · 2026-05</div>

# 会員コミュニティ<br>設計

縁を結ぶ場の、設計と仕組み — ランクシステム統合版

<br>

参照：会員コミュニティ_事例リサーチ.md ／ 運営プラットフォーム検討.md ／ engineko-rank-system.pptx

---

<!-- ============================================================
     SLIDE 02 — ENGINEKOが目指す理想のコミュニティ像
     ============================================================ -->

<!-- _class: chapter -->

<div class="kicker">Chapter I — Vision</div>

# ENGINEKOが目指す<br>理想のコミュニティ像

縁が人から人へと流れ続ける、静かで深い場。<br>
それはLTVを高める仕組みであり、同時にブランドが存在する理由そのものである。

---

<!-- ============================================================
     SLIDE 03 — なぜコミュニティが必要か：LTV問題
     ============================================================ -->

## なぜコミュニティが必要か

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
     SLIDE 04 — LTV設計：4ドライバーと目標
     ============================================================ -->

## LTVを高める設計

### LTVを構成する4つのドライバー

| ドライバー | 現状 | コミュニティ＋ランクがもたらす変化 |
|-----------|------|----------------------------------|
| **購入頻度** | 1点購入が大半 | 次エディション・新色への購買意欲を月次で維持。上位ランクほど優先案内 |
| **購入単価** | ¥50,000 均一 | 上位エディション（¥80K〜）への優先アクセスが上位ランクの特典に直結 |
| **継続期間** | 購買後に関係が切れる | 月次ライブ・先行情報・ランクの深まりが「長く関わる理由」を作る |
| **紹介** | 構造なし | 「縁の連鎖」がランク昇格にも寄与。紹介を名誉として設計 |

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
     SLIDE 05 — コア接点：6つの特典設計
     ============================================================ -->

## コミュニティの核となる6接点

| # | 接点 | LTVドライバー | 優先度 |
|---|------|-------------|--------|
| 1 | **月次窯入れライブ（1230℃ Live）オーナー限定視聴**<br>窯元がオンラインコミュニティイベントに参加し、制作の裏側を届ける | 継続期間 | ★★★ |
| 2 | **新色・限定エディション 先行案内・優先購入権** | 購入頻度・単価向上 | ★★★ |
| 3 | **Atelier Visit Toyama 工房訪問ツアー優先予約**（上位ランク特典） | 継続期間・単価向上 | ★★★ |
| 4 | **上位エディション・一点物ライン優先購入権**（ランク連動） | 単価向上 | ★★★ |
| 5 | **「縁の連鎖」リファラル（コンセプトブック記名）** | 紹介・新規獲得コスト削減 | ★★★ |
| 6 | **所有年数・ランクに応じた称号と非売品** | 継続期間 | ★★☆ |

<div class="callout">
目標：<em>コミュニティ参加オーナーのLTVを非参加者の2倍以上</em>にする。新規購入者の30%以上をオーナー経由の紹介に。
</div>

---

<!-- ============================================================
     SLIDE 06 — 設計しないこと（ブランド哲学との一貫性）
     ============================================================ -->

## 設計しないこと

### ブランド哲学「押さない、消さない」との整合

<div class="ng">
<strong>ポイント制（貯める型のゲーミフィケーション）</strong>　「貯める」動機はブランドと矛盾し、LTVより短期CVRを優先させる。ランクは「関係の深さの記録」であり、点数の蓄積とは根本的に異なる
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

> **判断基準：** ランクや特典の設計が「購買を急かす」ではなく「関係を深める」ことに向いているかを常に確認する。

---

<!-- ============================================================
     SLIDE 07 — CHAPTER BREAK: ランクシステム
     ============================================================ -->

<!-- _class: chapter -->

<div class="kicker">Chapter II — Rank System</div>

# ランクシステム

点数を貯めるのではなく、<em>縁の深さを記録する</em>。<br>
ランクはオーナーとENGINEKOが共に歩んできた時間と縁の、静かな証明である。

---

<!-- ============================================================
     SLIDE 08 — ランクシステムとは：哲学と構造
     ============================================================ -->

## ランクシステムの思想と構造

<div class="cols">
<div>

### ランクとは何か

ランクは「競争」でも「報酬」でもない。ENGINEKOとオーナーの間に積み重なってきた**関係の深さを可視化する記録**である。

- 点数ではなく、**所有年数・所有点数・縁の連鎖（紹介）** によって自然に深まる
- ランクが上がることは、購買への動機付けではなく、**すでに深まった縁への承認**
- 競争させず、比べさせず、ただ静かに称える

</div>
<div>

### 4つのランク概観

```
縁匠（Ensho）  ── 縁の体現者
  ↑
侘（Wabi）    ── 深まる縁
  ↑
間（Ma）      ── 広がる縁
  ↑
縁（En）      ── 縁のはじまり
```

昇格条件：所有年数 / 所有点数 / 縁の連鎖（紹介）<br>
いずれかの条件を満たすと、次のランクへ自然に移行する。

</div>
</div>

---

<!-- ============================================================
     SLIDE 09 — ランク詳細：縁・間
     ============================================================ -->

## ランク詳細 — 縁（En） & 間（Ma）

<div class="rank-grid">
<div class="rank-card rank-en">
<div class="rank-label">縁　En</div>
<div class="rank-roman">The First Connection</div>
<div class="rank-perks">
<strong>特典</strong><br>
・コミュニティ参加権（Members Portal）<br>
・1230℃ Live オーナー限定視聴<br>
・新色・限定エディション 先行案内<br>
・ウェルカムギフト（ブランドブック）
</div>
<div class="rank-cond">
<strong>条件：</strong>ENGINEKOを購入した全オーナー（自動付与）
</div>
</div>

<div class="rank-card rank-ma">
<div class="rank-label">間　Ma</div>
<div class="rank-roman">The Space That Deepens</div>
<div class="rank-perks">
<strong>特典（縁に加えて）</strong><br>
・Atelier Visit Toyama 優先予約権<br>
・オーナー限定 ZINE（年1回）<br>
・コミュニティアーカイブへの記録（名前・入会年）<br>
・オンラインコミュニティイベントへの招待
</div>
<div class="rank-cond">
<strong>条件：</strong>所有 1年以上 ／ または 2点以上所有
</div>
</div>
</div>

---

<!-- ============================================================
     SLIDE 10 — ランク詳細：侘・縁匠
     ============================================================ -->

## ランク詳細 — 侘（Wabi） & 縁匠（Ensho）

<div class="rank-grid">
<div class="rank-card rank-wabi">
<div class="rank-label">侘　Wabi</div>
<div class="rank-roman">The Beauty of Depth</div>
<div class="rank-perks">
<strong>特典（間に加えて）</strong><br>
・上位エディション（¥80K〜）優先購入権<br>
・窯元参加オンラインイベントへの優先招待<br>
・次シリーズのカラー名候補提案への参加<br>
・限定称号とシリアル入り非売品
</div>
<div class="rank-cond">
<strong>条件：</strong>所有 3年以上 ／ または 3点以上所有 ／ または縁の連鎖（紹介）1名以上
</div>
</div>

<div class="rank-card rank-ensho">
<div class="rank-label">縁匠　Ensho</div>
<div class="rank-roman">The Master of Connections</div>
<div class="rank-perks">
<strong>特典（侘に加えて）</strong><br>
・一点物制作プロセスへの参加（命名・仕様）<br>
・コンセプトブックへの永続記名<br>
・プライベート工房ビジット（年1組）<br>
・ブランド資料・JOURNALアーカイブへの完全アクセス
</div>
<div class="rank-cond">
<strong>条件：</strong>所有 5年以上 ／ または 5点以上所有 ／ または縁の連鎖（紹介）3名以上
</div>
</div>
</div>

---

<!-- ============================================================
     SLIDE 11 — 縁の循環：コミュニティ×ランク×ブランド
     ============================================================ -->

## 縁の循環 — コミュニティ・ランク・ブランドのシナジー

<div class="cols">
<div>

### 循環の構造

```
　購入（縁のはじまり）
　　　　│
　　　　▼
　コミュニティへの参加
　　　　│
　　　　▼
　1230℃ Live 視聴
　オンラインイベント参加
　縁の連鎖（紹介）
　　　　│
　　　　▼
　ランクの深まり（En → Ensho）
　　　　│
　　　　▼
　特典・認定の充実
　（上位エディション・工房ビジット・称号）
　　　　│
　　　　▼
　ブランドへの愛着と誇り
　　　　│
　　　　▼
　再購入・次の縁の連鎖
　　　　│
　　　　└──────────▶ 循環
```

</div>
<div>

### ランクが「熱量」を高める仕組み

**活動 → ランク反映 → 愛着 の流れ**

- 1230℃ Liveを視聴するたびに「次の窯を待つ」習慣が生まれ、ブランドが日常の一部になる
- オンラインイベントで窯元の声を直接聞いた体験は、プロダクトへの愛着を一段深める
- 縁の連鎖（紹介）がランクに反映されることで、紹介行為が「名誉ある貢献」として根付く
- ランクの深まりが「長くENGINEKOと共にいる理由」を形成し、継続期間を自然に伸ばす

<div class="callout">
コミュニティ内の活動が蓄積されるほど、<em>「ENGINEKOから離れるコスト」が上がる</em>。これが最も静かで最も強いLTV設計である。
</div>

</div>
</div>

---

<!-- ============================================================
     SLIDE 12 — CHAPTER BREAK: 事例・設計
     ============================================================ -->

<!-- _class: chapter -->

<div class="kicker">Chapter III — Research & Design</div>

# 事例と設計

8つの事例から学んだ構造を、<br>ENGINEKOの文脈に翻訳する。

---

<!-- ============================================================
     SLIDE 13 — 事例マップ（8事例の概観）
     ============================================================ -->

## 事例リサーチ — 8事例の概観

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
     SLIDE 14 — 主要事例から得た示唆
     ============================================================ -->

## 主要事例からの示唆

<div class="cols-3">
<div>
<div class="badge">H.O.G.</div>

**記録文化の実装**

所有年数・走行距離を称える仕組みが離脱防止に機能。

→ ENGINEKOでは**ランクシステム**として実装。所有年数と縁の連鎖が自然にランクを深め、継続期間を延ばす。
</div>
<div>
<div class="badge">Peloton</div>

**月次の習慣設計**

「日曜の朝に教会へ行くような体験」まで習慣化。やめる理由が消える。

→ **1230℃ Live** と窯元参加オンラインイベントをオーナー限定の月次行事に。「次の窯を待つ」習慣がランクの深まりと連動する。
</div>
<div>
<div class="badge gold">Astier de Villatte</div>

**コレクター化の設計**

季節限定品・希少品が購入頻度と継続期間を同時に最大化。

→ ENGINEKOの**到達点**として参照。ランク上位の「一点物参加権」がコレクター化のトリガー。
</div>
</div>

<div class="callout" style="margin-top:28px">
<strong>Minimal Collective（国内最直接参照）</strong>：「ポイントなし・世界観への参加型」の設計思想がENGINEKOのランクシステムと一致。非売品・限定品がランクの価値を守る。
</div>

---

<!-- ============================================================
     SLIDE 15 — コミュニティ設計の骨格
     ============================================================ -->

## コミュニティ設計の骨格

<div class="cols">
<div>

### 基本設計

| 項目 | 設計 |
|------|------|
| **名称候補** | 縁の輪（En no Wa）／縁の座 |
| **入会条件** | ENGINEKO購入者のみ（自動入会・ランク縁から開始） |
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
― ランク分布の推移

→ Klaviyo で四半期ごとに比較
```

</div>
</div>

---

<!-- ============================================================
     SLIDE 16 — プラットフォーム推奨構成（更新版）
     ============================================================ -->

## プラットフォーム推奨構成

### Y1（国内立ち上げ）：Klaviyo ＋ ENGINEKO Members Portal

```
購入完了
  │
  ├─▶ Klaviyo ── LTV計測・購入者データ管理・メール自動フロー（基盤）
  │       └─▶ メール配信（先行案内 / 1230℃ Live告知 / JOURNAL）
  │
  └─▶ ENGINEKO Members Portal（招待制プライベートポータル）
           ├─▶ ランクバッジ・所有履歴・入会年の表示
           ├─▶ 1230℃ Liveアーカイブ・JOURNALライブラリ
           └─▶ イベント予約（Atelier Visit・オンラインイベント）
```

### Y2（欧州展開）：Circle.so を追加

```
Circle.so ── 英語コンテンツアーカイブ・欧州オーナー向けイベント管理
               └─▶ Klaviyo と連携してLTV計測を継続
```

| プラットフォーム | 推奨理由 | 月額コスト | タイミング |
|----------------|---------|-----------|-----------|
| Klaviyo | LTV計測の基盤。欧州にも対応 | $0〜$45 | 即時 |
| **Members Portal（自作）** | **ブランド完全制御・招待制・ENGINEKO Design System適用** | **¥15,000〜** | Y1ローンチと同時 |
| Circle.so | 英語コンテンツ蓄積・欧州オーナーの場 | $89/月〜 | Y2フェーズから |

---

<!-- ============================================================
     SLIDE 17 — Members Portal 詳細：なぜLINEではないか
     ============================================================ -->

## ENGINEKO Members Portal — プラットフォーム選定の理由

<div class="cols">
<div>

### なぜ自作ポータルか

**LINEを採用しない理由**

- LINEは「通知が来るもの」という印象が根強く、「押さない」ブランド哲学と構造的に矛盾
- LINE自体のブランドが前面に出るため、ENGINEKOのラグジュアリー感が希薄になる
- コンテンツがチャットに流れ、アーカイブ・ランク表示・履歴管理ができない

**Members Portalが適合する理由**

- オーナーが「訪れたいときに訪れる」設計——通知を送らず、場を用意する
- ENGINEKO Design System（--paper / --gold）をそのままUI/UXに適用できる
- ランクバッジ・所有履歴・イベント予約が一つの場所に集約される

</div>
<div>

### 推奨構成オプション

<div class="card" style="margin-bottom:14px">
<div class="label">Option A — Webflow + MemberStack（推奨）</div>
<div class="desc">デザイン自由度が高く、ENGINEKO Design Systemを完全適用できる招待制ポータルを構築できる。初期構築費30〜60万円、月額¥15,000〜。</div>
</div>

<div class="card" style="margin-bottom:14px">
<div class="label">Option B — Mighty Networks</div>
<div class="desc">完全カスタムブランディングが可能なコミュニティプラットフォーム。欧州でも使われており、Y1〜Y2をまたいで使える。月額$33〜$99（白ラベル対応）。</div>
</div>

<div class="card">
<div class="label">Option C — フルスクラッチ開発</div>
<div class="desc">最も高い完成度。開発費100万円〜。会員数100名超・Y2以降で本格検討。</div>
</div>

</div>
</div>

---

<!-- ============================================================
     SLIDE 18 — 購入後フロー設計 ＆ 次のアクション
     ============================================================ -->

## 購入後フロー設計 ＆ 次のアクション

<div class="cols">
<div>

### Klaviyo 自動フロー（購入後）

```
Day  0  ウェルカムメール
         「縁（En）ランク、ようこそ」
         + Members Portal 招待リンク

Day  3  ブランドコンセプトメール
         「縁（En）について」

Day 14  工房・職人紹介メール
         「富山工房から」

Day 30  1230℃ Live 案内
         「来月の窯入れ、先行でご案内」
         ＋ 窯元参加オンラインイベント告知

Day 60  次エディション先行案内
         「次の縁が、生まれます」

以降：月次で窯・新色・ランク情報
```

</div>
<div>

### 次のアクション

- [ ] **コミュニティの名称を決める**
- [ ] Klaviyo の Shopify 連携を設定する
- [ ] 購入後の自動フロー（〜Day 60）を実装する
- [ ] Members Portalの構成オプション（A/B）を選定する
- [ ] Members PortalのUI設計（ランク表示・イベント予約）を開始する
- [ ] ランクの昇格通知メール文面を制作する
- [ ] Y2フェーズのCircle.so 試用タイミングを計画する

<br>

<div class="callout">
<em>最優先：</em>Klaviyo の Shopify 連携設定。LTV計測の基盤がなければ、ランクシステムの効果検証もコミュニティの改善もできない。
</div>

</div>
</div>

---

<!-- ============================================================
     SLIDE 19 — CHAPTER BREAK: Roadmap
     ============================================================ -->

<!-- _class: chapter -->

<div class="kicker">Chapter IV — Roadmap</div>

# 縁は、どこへ向かうか

コミュニティは完成するものではなく、<br>縁が連鎖するたびに静かに深まっていく。

---

<!-- ============================================================
     SLIDE 20 — Roadmap（将来的な拡張性）
     ============================================================ -->

## Roadmap — ENGINEKOコミュニティの展望

| フェーズ | 時期 | 施策 | 目的 |
|---------|------|------|------|
| **Y1 立ち上げ** | 2026 | Members Portal開設・ランクシステム運用開始・1230℃ Live開始 | コア習慣の形成・LTV計測基盤の確立 |
| **Y1 定着** | 2026後半 | 侘・縁匠ランク到達者への一点物参加・コンセプトブック記名開始 | 上位LTVオーナーの定着・コンテンツ蓄積 |
| **Y2 欧州展開** | 2027 | Circle.so 追加・英語コンテンツアーカイブ・欧州オーナー向けオンラインイベント | 欧州LTV設計の確立 |
| **Y2 地域展開** | 2027後半 | 欧州オーナー主体のローカルギャザリング（草の根）の支援 | Porsche Club型の自律的コミュニティ形成 |
| **Y3 コレクター化** | 2028 | 縁匠ランク限定エディションの独立ライン化（年1〜2点） | LTV最大化・ブランド資産の深化 |
| **Y3 展覧会** | 2028 | コミュニティオーナーの空間写真を集めた展覧会（東京・パリ） | 「百の縁」プロジェクトの集大成・欧州バイヤーへの提案 |

<div class="callout">
<em>将来の判断軸：</em>コミュニティが「縁の連鎖」を実際に生み出しているかを、Klaviyoのデータと四半期ごとに確認する。スケールより純度を優先し、質のある縁だけを積み重ねる。
</div>
