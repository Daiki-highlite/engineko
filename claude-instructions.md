# Claudeへの指示ログ

Slackで `to Claude` と書かれたコメントをここに蓄積し、ダッシュボードへ都度反映する。

本ファイルは `anthropic-skills:engineko-update` スキルが週次更新するたびに、
`#05-engineko-コアメンバー` / `#06-engineko-all` から `to Claude` を含む投稿を吸い上げて追記する。

対応する `index.html` の表示セクション: 「📝 Claudeへの指示ログ」

---

## 運用ルール

- Slack投稿本文に `to Claude` が含まれるコメントは、Claudeへの仕様指示として扱う
- 指示は以下の項目で管理する:
  - **日時**: 投稿日時（JST）
  - **発信者**: 投稿者名
  - **指示内容**: 本文
  - **ステータス**: 🆕 未着手 / ⚙️ 実装中 / ✅ 実装済み
  - **実装メモ**: 何をしたか、どのファイルに影響したか
- ダッシュボードには直近3件＋履歴リンクを表示する
- 完了した指示も削除せず、履歴として残す

---

## 指示履歴（新しい順）

### #002 — 2026-04-24 14:50 JST / 早川 大貴
**指示内容**:
> to Claude　ダッシュボードに仕様が都度描かれる仕様にして

**解釈**:
Slackで `to Claude` と書かれた指示（仕様）を、ダッシュボード上に都度反映・表示する仕組みを作る。
指示の履歴と実装状況が一目でわかるようにする。

**ステータス**: ✅ 実装済み（2026-04-24）

**実装メモ**:
- `claude-instructions.md`（本ファイル）を新規作成し、指示ログの蓄積先とした
- `index.html` に「📝 Claudeへの指示ログ」セクションを追加
- `engineko-update` スキル実行時に `to Claude` を含む投稿を検索し、本ファイルへ追記する運用とする
- ダッシュボード上では直近の指示と実装状況を表示

**影響ファイル**:
- `/Users/daikihayakawa/Documents/Claude/Projects/ENGINEKO/claude-instructions.md`（新規）
- `/Users/daikihayakawa/Documents/Claude/Projects/ENGINEKO/index.html`（セクション追加）

---

### #001 — 2026-04-17 10:58 JST / 早川 大貴
**指示内容**:
> 進捗共有new
> ・諸々やることが増えてきてるので、Trello運用とこのSlackへの投稿を統一できないかなと思って
>     ◦ AIがSlack読み取って各種進捗勝手に出してくれる設計してみた
>         ▪︎ https://daiki-highlite.github.io/engineko/
>     ◦ どうかな
>     ◦ みんなのSlack記載フォーマットさえチューニングできたらもう少し精度高いものもできそう

**解釈**:
Slackの週次投稿を入力としてダッシュボードへ自動反映する仕組みを構築する。Trello運用からSlack投稿ベースに統一する方向性。

**ステータス**: ✅ 実装済み（継続運用中）

**実装メモ**:
- `anthropic-skills:engineko-update` スキルで毎週金曜の定例前にSlackから吸い上げ→`index.html`更新
- GitHub Pages (`daiki-highlite.github.io/engineko`) で公開

---

## スキル運用時のチェックリスト

毎回 `engineko-update` スキルを動かす際に以下を実施すること：

1. `#05-engineko-コアメンバー` を `to Claude` で検索（直近1週間）
2. `#06-engineko-all` も同様に検索
3. 新規の `to Claude` 投稿があれば本ファイルの「指示履歴」先頭に追記
4. 指示内容をもとに `index.html` を更新
5. ダッシュボード内「📝 Claudeへの指示ログ」セクションの最新3件を差し替え
