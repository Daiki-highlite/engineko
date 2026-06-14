// ================================================================
// ENGINEKO 収支管理 API - Google Apps Script
//
// ■ シート構成
//   「商品データ」 A:商品名  B:単価  C:販売数
//   「支出」       A:日付  B:費用科目  C:内容  D:金額  E:支払者  F:メモ
//                  G:区分  H:費用タイプ  I:対象商品  J:報告元
//   「収入」       A:日付  B:種別  C:内容  D:金額  E:メモ  F:報告元
//
//   ※ G〜J 列は後付け。既存データは空欄のままでOK（「未分類」扱い）
//      区分       … 「事業全体」or「商品個別」
//      費用タイプ … 区分が事業全体のとき「イニシャル」or「ランニング」
//      対象商品   … 区分が商品個別のとき、商品データの商品名と一致させる
//
// ■ エンドポイント（GET）
//   ?action=getProducts              → 商品データ一覧
//   ?action=saveProducts&data=<JSON> → 商品データ上書き保存
//   ?action=getExpenses[&fy=FY2026]  → 支出一覧（年度フィルタ任意）
//   ?action=getIncome[&fy=FY2026]    → 収入一覧（年度フィルタ任意）
//
// ■ エンドポイント（POST）= Slack スラッシュコマンド（ラベル付き・順不同）
//   /expense 金額:◯ 費用科目:◯ 内容:◯ 商品:◯ [支払者:◯] [日付:6/10] [メモ:◯]
//        商品: モデル名（例 ENGINEKO猫）／ 共通イニシャル ／ 共通ランニング
//        例)  /expense 金額:4609 費用科目:製造原価 内容:型費用追加分 商品:ENGINEKO猫
//             /expense 金額:2415 費用科目:梱包・資材費 内容:ダンボール代 商品:共通ランニング
//             /expense 金額:18万 費用科目:知財・法務費 内容:EU商標出願 商品:共通イニシャル 支払者:早川
//   /income  金額:◯ 種別:◯ 内容:◯ [日付:6/10] [メモ:◯]
//        種別: 売上 ／ 助成金
//        例)  /income 金額:50000 種別:売上 内容:ENGINEKO猫1体 メモ:〇〇様
//
//   ※ 旧スタイル（位置指定）も後方互換で受け付けます:
//        /expense 4609 製造原価 型費用追加分 商品:ENGINEKO猫
//
//   セキュリティ: スクリプトプロパティ SLACK_VERIFICATION_TOKEN を設定すると
//   Slack からのリクエストのみ受け付ける（未設定なら検証スキップ）
// ================================================================

const PRODUCTS_SHEET = '商品データ';
const EXPENSES_SHEET = '支出';
const INCOME_SHEET   = '収入';

const EXPENSE_CATEGORIES = [
  '製造原価', '梱包・資材費', '人件費', '広告宣伝費', '外部イベント出展費',
  '送料・物流費', '旅費交通費', '外注費', '知財・法務費', '通信費', '消耗品・雑費',
];

const INCOME_TYPES = ['売上', '助成金'];

function doGet(e) {
  try {
    const action = e.parameter.action || 'getProducts';
    const ss     = SpreadsheetApp.getActiveSpreadsheet();

    switch (action) {
      case 'getProducts':  return getProducts(ss);
      case 'saveProducts': return saveProducts(ss, e.parameter.data);
      case 'getExpenses':  return getExpenses(ss, e.parameter.fy || null);
      case 'getIncome':    return getIncome(ss, e.parameter.fy || null);
      default:             return respond({ status: 'error', message: 'Unknown action: ' + action });
    }
  } catch (err) {
    return respond({ status: 'error', message: err.toString() });
  }
}

// ================================================================
// Slack スラッシュコマンド受付（POST）
// ================================================================
function doPost(e) {
  try {
    const p = e.parameter || {};

    // Slack からのリクエストか軽く検証（トークン設定時のみ）
    const expected = PropertiesService.getScriptProperties().getProperty('SLACK_VERIFICATION_TOKEN');
    if (expected && p.token !== expected) {
      return slackReply('⚠️ 認証エラー：Verification Token が一致しません', true);
    }

    const cmd = String(p.command || '');
    if (cmd === '/支出' || cmd === '/expense' || cmd === '/shishutsu') {
      return handleExpenseCommand(p);
    }
    if (cmd === '/収入' || cmd === '/income' || cmd === '/shunyu') {
      return handleIncomeCommand(p);
    }
    return slackReply('未対応のコマンドです: ' + cmd, true);
  } catch (err) {
    return slackReply('⚠️ エラーが発生しました: ' + err.toString(), true);
  }
}

// ── /expense ──────────────────────────────────────────────────
function handleExpenseCommand(p) {
  const text = String(p.text || '').trim();
  if (!text || text === 'ヘルプ' || text.toLowerCase() === 'help') {
    return slackReply(expenseUsage(), true);
  }

  const parsed = parseTokens(text);

  // 位置指定（旧スタイル）の後方互換: ラベル未指定分を leftovers から補完
  let category = parsed.category;
  let item     = parsed.item;
  const left   = parsed.leftovers.slice();
  if (!category && left.length) category = left.shift();
  if (!item && left.length)     item     = left.shift();
  const memo = [parsed.memo, left.join(' ')].filter(Boolean).join(' ');

  const errors = [];
  if (parsed.amount == null) errors.push('金額が読み取れません');
  if (!category)             errors.push('費用科目を指定してください');
  if (!item)                 errors.push('内容を指定してください');
  if (!parsed.scope)         errors.push('商品（モデル名／共通イニシャル／共通ランニング）を指定してください');

  if (errors.length > 0) {
    return slackReply('⚠️ ' + errors.join('／') + '\n\n' + expenseUsage(), true);
  }

  const date  = parsed.date ? parseDateInput(parsed.date) : todayJST();
  const payer = parsed.payer || String(p.user_name || '');

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(EXPENSES_SHEET);
  if (!sheet) return slackReply('⚠️ シート「' + EXPENSES_SHEET + '」が見つかりません', true);
  ensureExpenseHeaders(sheet);

  sheet.appendRow([
    date, category, item, parsed.amount, payer, memo,
    parsed.scope, parsed.costType, parsed.product,
    'Slack (' + String(p.user_name || '') + ')',
  ]);

  const scopeLabel = parsed.scope === '商品個別'
    ? '商品個別（' + parsed.product + '）'
    : '事業全体・' + parsed.costType;
  const catWarn = EXPENSE_CATEGORIES.indexOf(category) === -1
    ? '\n（参考: 費用科目「' + category + '」は定義済みリスト外です。表記ゆれにご注意ください）'
    : '';

  return slackReply(
    '✅ 支出を記録しました\n' +
    '💸 ¥' + Number(parsed.amount).toLocaleString('ja-JP') + ' ／ ' + category + ' ／ ' + item + '\n' +
    '🏷 ' + scopeLabel + ' ／ 支払者: ' + payer + ' ／ 日付: ' + date +
    (memo ? '\n📝 ' + memo : '') + catWarn,
    false
  );
}

// ── /income ───────────────────────────────────────────────────
function handleIncomeCommand(p) {
  const text = String(p.text || '').trim();
  if (!text || text === 'ヘルプ' || text.toLowerCase() === 'help') {
    return slackReply(incomeUsage(), true);
  }

  const parsed = parseTokens(text);

  // 位置指定（旧スタイル）の後方互換
  let type = parsed.type;
  let item = parsed.item;
  const left = parsed.leftovers.slice();
  if (!type && left.length) type = left.shift();
  if (!item && left.length) item = left.shift();
  const memo = [parsed.memo, left.join(' ')].filter(Boolean).join(' ');

  const errors = [];
  if (parsed.amount == null) errors.push('金額が読み取れません');
  if (!type)                 errors.push('種別（売上／助成金）を指定してください');
  if (!item)                 errors.push('内容を指定してください');
  if (type && INCOME_TYPES.indexOf(type) === -1) errors.push('種別は「売上」または「助成金」です');

  if (errors.length > 0) {
    return slackReply('⚠️ ' + errors.join('／') + '\n\n' + incomeUsage(), true);
  }

  const date = parsed.date ? parseDateInput(parsed.date) : todayJST();

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(INCOME_SHEET);
  if (!sheet) return slackReply('⚠️ シート「' + INCOME_SHEET + '」が見つかりません', true);

  sheet.appendRow([date, type, item, parsed.amount, memo, 'Slack (' + String(p.user_name || '') + ')']);

  return slackReply(
    '✅ 収入を記録しました\n' +
    '💹 ¥' + Number(parsed.amount).toLocaleString('ja-JP') + ' ／ ' + type + ' ／ ' + item + ' ／ 日付: ' + date +
    (memo ? '\n📝 ' + memo : ''),
    false
  );
}

// ── コマンド文字列のパース ────────────────────────────────────
// ラベル付き（金額:◯ 費用科目:◯ …）を順不同で解釈する。
// ラベルの値はスペースを含んでも次のラベルまでをまとめて拾う。
// ラベルなしのトークンは leftovers / amount / 区分キーワードとして後方互換処理。
function parseTokens(text) {
  const tokens = text.split(/[\s　]+/).filter(Boolean);
  const result = {
    amount: null, category: '', item: '', type: '',
    payer: '', date: '', memo: '',
    scope: '', costType: '', product: '',
    leftovers: [],
  };

  // ラベル別名 → 内部キー
  const LABELS = {
    '金額': 'amount',
    '費用科目': 'category', 'カテゴリ': 'category', '科目': 'category',
    '内容': 'item', '項目': 'item',
    '商品': 'product', '対象': 'product',
    '種別': 'type',
    '支払者': 'payer', '支払': 'payer',
    '日付': 'date',
    'メモ': 'memo', '備考': 'memo',
  };

  let curKey  = null;  // 現在収集中のラベル
  let curVals = [];

  function flush() {
    if (curKey) {
      assignField(result, curKey, curVals.join(' '));
      curKey = null;
      curVals = [];
    }
  }

  tokens.forEach(function (tok) {
    // 「ラベル:値」「ラベル：値」を検出（先頭のコロンまでをラベル候補に）
    const m = tok.match(/^([^:：]+)[:：](.*)$/);
    if (m && LABELS.hasOwnProperty(m[1])) {
      flush();
      curKey  = LABELS[m[1]];
      curVals = [];
      if (m[2] !== '') curVals.push(m[2]);
      return;
    }

    // ラベル収集中なら値の続きとして取り込む（スペース込みの値に対応）
    if (curKey) { curVals.push(tok); return; }

    // ── ラベル外（旧スタイル後方互換）──
    if (tok === 'イニシャル' || tok === 'ランニング') {
      result.scope    = '事業全体';
      result.costType = tok;
      return;
    }
    if (result.amount == null) {
      const amt = parseAmount(tok);
      if (amt != null) { result.amount = amt; return; }
    }
    result.leftovers.push(tok);
  });
  flush();

  // 「商品」ラベルの値を区分（scope/costType/product）に変換
  resolveProduct(result);

  return result;
}

// ラベル値を result に格納
function assignField(result, key, val) {
  val = String(val).trim();
  if (key === 'amount') {
    const amt = parseAmount(val);
    if (amt != null) result.amount = amt;
  } else if (key === 'product') {
    result.product = val; // resolveProduct で後処理
  } else {
    result[key] = val;
  }
}

// 「商品」欄の値から 区分・費用タイプ・対象商品 を決める
//   共通イニシャル / イニシャル → 事業全体・イニシャル
//   共通ランニング / ランニング → 事業全体・ランニング
//   それ以外（モデル名）        → 商品個別
function resolveProduct(result) {
  const v = String(result.product || '').trim();
  if (!v) return; // 商品ラベル未指定。旧スタイルのキーワードで既に決まっている場合あり
  if (v === '共通イニシャル' || v === 'イニシャル') {
    result.scope = '事業全体'; result.costType = 'イニシャル'; result.product = '';
  } else if (v === '共通ランニング' || v === 'ランニング') {
    result.scope = '事業全体'; result.costType = 'ランニング'; result.product = '';
  } else {
    result.scope = '商品個別'; result.costType = ''; result.product = v;
  }
}

// 「4609」「¥4,609」「4609円」「1.5万」などを数値化。数値でなければ null
function parseAmount(tok) {
  let s = String(tok).replace(/[¥￥,，円]/g, '');
  let mult = 1;
  if (/万$/.test(s)) { mult = 10000; s = s.replace(/万$/, ''); }
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  return Math.round(parseFloat(s) * mult);
}

// 「6/10」「2026/6/10」「6-10」→ yyyy-MM-dd（年省略時は今年）
function parseDateInput(s) {
  const m = String(s).match(/^(?:(\d{4})[\/\-])?(\d{1,2})[\/\-](\d{1,2})$/);
  if (!m) return todayJST();
  const now  = new Date();
  const year = m[1] ? Number(m[1]) : Number(Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy'));
  return year + '-' + String(m[2]).padStart(2, '0') + '-' + String(m[3]).padStart(2, '0');
}

function todayJST() {
  return Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd');
}

// 支出シートに G〜J 列のヘッダがなければ書き込む
function ensureExpenseHeaders(sheet) {
  const headers = ['区分', '費用タイプ', '対象商品', '報告元'];
  const range   = sheet.getRange(1, 7, 1, 4);
  const current = range.getValues()[0];
  if (current.every(function (v) { return v === ''; })) {
    range.setValues([headers]);
  }
}

function expenseUsage() {
  return '📖 支出の記録方法（コピペして値を埋めてください）\n' +
    '/expense 金額: 費用科目: 内容: 商品: 支払者: 日付: メモ:\n' +
    '─────────────\n' +
    '・金額：必須（例 4609 / ¥4,609 / 18万）\n' +
    '・費用科目：必須（' + EXPENSE_CATEGORIES.join('、') + '）\n' +
    '・内容：必須（具体的に何の費用か）\n' +
    '・商品：必須（モデル名／共通イニシャル／共通ランニング）\n' +
    '・支払者：任意（省略時は投稿者）\n' +
    '・日付：任意（省略時は今日。例 6/10）\n' +
    '・メモ：任意（証憑番号・取引先など）\n' +
    '─────────────\n' +
    '例) /expense 金額:4609 費用科目:製造原価 内容:型費用追加分 商品:ENGINEKO猫\n' +
    '例) /expense 金額:18万 費用科目:知財・法務費 内容:EU商標出願 商品:共通イニシャル 支払者:早川';
}

function incomeUsage() {
  return '📖 収入の記録方法（コピペして値を埋めてください）\n' +
    '/income 金額: 種別: 内容: 日付: メモ:\n' +
    '─────────────\n' +
    '・金額：必須（例 50000 / 300万）\n' +
    '・種別：必須（売上／助成金）\n' +
    '・内容：必須（具体的に何の収入か）\n' +
    '・日付：任意（省略時は今日。例 6/10）\n' +
    '・メモ：任意\n' +
    '─────────────\n' +
    '例) /income 金額:50000 種別:売上 内容:ENGINEKO猫1体 メモ:〇〇様\n' +
    '例) /income 金額:300万 種別:助成金 内容:特別創業支援補助金';
}

// Slack への返信（ephemeral=true なら本人にだけ見える）
function slackReply(text, ephemeral) {
  return ContentService
    .createTextOutput(JSON.stringify({
      response_type: ephemeral ? 'ephemeral' : 'in_channel',
      text: text,
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── 商品データ ────────────────────────────────────────────────
function getProducts(ss) {
  const sheet = ss.getSheetByName(PRODUCTS_SHEET);
  if (!sheet) return respond([]);
  const rows = sheet.getDataRange().getValues();
  const products = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === '') continue;
    products.push({
      name:  String(rows[i][0]),
      price: Number(rows[i][1]),
      qty:   Number(rows[i][2]),
    });
  }
  return respond(products);
}

function saveProducts(ss, dataParam) {
  const sheet = ss.getSheetByName(PRODUCTS_SHEET);
  if (!sheet) return respond({ status: 'error', message: PRODUCTS_SHEET + ' シートが見つかりません' });
  const products = JSON.parse(decodeURIComponent(dataParam));
  const lastRow  = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, 3).clearContent();
  products.forEach((p, i) => {
    sheet.getRange(i + 2, 1).setValue(p.name);
    sheet.getRange(i + 2, 2).setValue(Number(p.price));
    sheet.getRange(i + 2, 3).setValue(Number(p.qty));
  });
  return respond({ status: 'ok', saved: products.length });
}

// ── 支出 ──────────────────────────────────────────────────────
function getExpenses(ss, fy) {
  const sheet = ss.getSheetByName(EXPENSES_SHEET);
  if (!sheet) return respond([]);
  const rows   = sheet.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === '') continue;
    const dateStr = formatDate(rows[i][0]);
    const rowFY   = calcFY(dateStr);
    if (fy && rowFY !== fy) continue;
    result.push({
      date:     dateStr,
      fy:       rowFY,
      category: String(rows[i][1] || ''),
      item:     String(rows[i][2] || ''),
      amount:   Number(rows[i][3] || 0),
      payer:    String(rows[i][4] || ''),
      memo:     String(rows[i][5] || ''),
      scope:    String(rows[i][6] || ''),   // 事業全体 / 商品個別 /（空=未分類）
      costType: String(rows[i][7] || ''),   // イニシャル / ランニング
      product:  String(rows[i][8] || ''),   // 対象商品名
    });
  }
  return respond(result);
}

// ── 収入 ──────────────────────────────────────────────────────
function getIncome(ss, fy) {
  const sheet = ss.getSheetByName(INCOME_SHEET);
  if (!sheet) return respond([]);
  const rows   = sheet.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === '') continue;
    const dateStr = formatDate(rows[i][0]);
    const rowFY   = calcFY(dateStr);
    if (fy && rowFY !== fy) continue;
    result.push({
      date:   dateStr,
      fy:     rowFY,
      type:   String(rows[i][1] || ''),   // 売上 / 助成金
      item:   String(rows[i][2] || ''),
      amount: Number(rows[i][3] || 0),
      memo:   String(rows[i][4] || ''),
    });
  }
  return respond(result);
}

// ── ユーティリティ ────────────────────────────────────────────
function calcFY(dateStr) {
  if (!dateStr) return 'FY2026';
  const d     = new Date(dateStr);
  const year  = d.getFullYear();
  const month = d.getMonth() + 1; // 1-12
  return 'FY' + (month >= 4 ? year : year - 1);
}

function formatDate(val) {
  if (!val) return '';
  if (val instanceof Date) {
    return val.getFullYear() + '-'
      + String(val.getMonth() + 1).padStart(2, '0') + '-'
      + String(val.getDate()).padStart(2, '0');
  }
  return String(val).substring(0, 10);
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
