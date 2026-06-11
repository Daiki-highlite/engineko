// ================================================================
// ENGINEKO 収支管理 API - Google Apps Script
//
// ■ シート構成
//   「商品データ」 A:商品名  B:単価  C:販売数
//   「支出」       A:日付  B:カテゴリ  C:項目  D:金額  E:支払者  F:メモ
//                  G:区分  H:費用タイプ  I:対象商品  J:報告元
//   「収入」       A:日付  B:種別  C:項目  D:金額  E:メモ  F:報告元
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
// ■ エンドポイント（POST）= Slack スラッシュコマンド
//   /支出 金額 カテゴリ 項目 区分 [支払者:名前] [日付:6/10] [メモ:自由記述]
//        区分: イニシャル ／ ランニング ／ 商品:商品名
//        例)  /支出 4609 製造原価 型費用追加分 商品:ENGINEKO猫
//             /支出 2415 梱包・資材費 ダンボール代 ランニング メモ:初回出荷分
//             /支出 180000 知財・法務費 EU商標出願 イニシャル 支払者:早川
//   /収入 金額 種別 項目 [日付:6/10] [メモ:自由記述]
//        種別: 売上 ／ 助成金
//        例)  /収入 50000 売上 ENGINEKO猫1体 メモ:〇〇様
//
//   セキュリティ: スクリプトプロパティ SLACK_VERIFICATION_TOKEN を設定すると
//   Slack からのリクエストのみ受け付ける（未設定なら検証スキップ）
// ================================================================

const PRODUCTS_SHEET = '商品データ';
const EXPENSES_SHEET = '支出';
const INCOME_SHEET   = '収入';

const EXPENSE_CATEGORIES = [
  '製造原価', '梱包・資材費', '人件費', '広告宣伝費', '送料・物流費',
  '旅費交通費', '外注費', '知財・法務費', '通信費', '消耗品・雑費',
];

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

// ── /支出 ─────────────────────────────────────────────────────
function handleExpenseCommand(p) {
  const text = String(p.text || '').trim();
  if (!text || text === 'ヘルプ' || text.toLowerCase() === 'help') {
    return slackReply(expenseUsage(), true);
  }

  const parsed = parseTokens(text);
  const errors = [];

  if (parsed.amount == null) errors.push('金額が読み取れません');
  if (parsed.positional.length < 2) errors.push('カテゴリと項目を指定してください');
  if (!parsed.scope) errors.push('区分（イニシャル／ランニング／商品:商品名）を指定してください');

  if (errors.length > 0) {
    return slackReply('⚠️ ' + errors.join('／') + '\n\n' + expenseUsage(), true);
  }

  const category = parsed.positional[0];
  const item     = parsed.positional[1];
  const extraMemo = parsed.positional.slice(2).join(' ');
  const memo      = [parsed.kv['メモ'] || '', extraMemo].filter(Boolean).join(' ');

  const date  = parsed.kv['日付'] ? parseDateInput(parsed.kv['日付']) : todayJST();
  const payer = parsed.kv['支払者'] || String(p.user_name || '');

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
    ? '\n（参考: カテゴリ「' + category + '」は定義済みリスト外です。表記ゆれにご注意ください）'
    : '';

  return slackReply(
    '✅ 支出を記録しました\n' +
    '💸 ¥' + Number(parsed.amount).toLocaleString('ja-JP') + ' ／ ' + category + ' ／ ' + item + '\n' +
    '🏷 ' + scopeLabel + ' ／ 支払者: ' + payer + ' ／ 日付: ' + date +
    (memo ? '\n📝 ' + memo : '') + catWarn,
    false
  );
}

// ── /収入 ─────────────────────────────────────────────────────
function handleIncomeCommand(p) {
  const text = String(p.text || '').trim();
  if (!text || text === 'ヘルプ' || text.toLowerCase() === 'help') {
    return slackReply(incomeUsage(), true);
  }

  const parsed = parseTokens(text);
  const errors = [];

  if (parsed.amount == null) errors.push('金額が読み取れません');
  if (parsed.positional.length < 2) errors.push('種別と項目を指定してください');
  const type = parsed.positional[0];
  if (type && type !== '売上' && type !== '助成金') errors.push('種別は「売上」または「助成金」です');

  if (errors.length > 0) {
    return slackReply('⚠️ ' + errors.join('／') + '\n\n' + incomeUsage(), true);
  }

  const item      = parsed.positional[1];
  const extraMemo = parsed.positional.slice(2).join(' ');
  const memo      = [parsed.kv['メモ'] || '', extraMemo].filter(Boolean).join(' ');
  const date      = parsed.kv['日付'] ? parseDateInput(parsed.kv['日付']) : todayJST();

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
// 全角/半角スペース区切り。「キー:値」「キー：値」はキーワード引数として扱う。
function parseTokens(text) {
  const tokens = text.split(/[\s　]+/).filter(Boolean);
  const result = { amount: null, scope: '', costType: '', product: '', kv: {}, positional: [] };

  tokens.forEach(function (tok) {
    // キー:値 形式
    const m = tok.match(/^(メモ|日付|支払者|商品)[:：](.+)$/);
    if (m) {
      if (m[1] === '商品') {
        result.scope    = '商品個別';
        result.costType = '';
        result.product  = m[2];
      } else {
        result.kv[m[1]] = m[2];
      }
      return;
    }
    // 区分キーワード
    if (tok === 'イニシャル' || tok === 'ランニング') {
      result.scope    = '事業全体';
      result.costType = tok;
      return;
    }
    // 金額（最初に見つかった数値らしきもの）
    if (result.amount == null) {
      const amt = parseAmount(tok);
      if (amt != null) { result.amount = amt; return; }
    }
    result.positional.push(tok);
  });

  return result;
}

// 「4609」「¥4,609」「4609円」「1.5万」などを数値化。数値でなければ null
function parseAmount(tok) {
  let s = tok.replace(/[¥￥,，円]/g, '');
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
  return '📖 使い方: /支出 金額 カテゴリ 項目 区分 [支払者:名前] [日付:6/10] [メモ:自由記述]\n' +
    '・区分は次のいずれか: イニシャル ／ ランニング ／ 商品:商品名\n' +
    '・カテゴリ: ' + EXPENSE_CATEGORIES.join('、') + '\n' +
    '例1) /支出 4609 製造原価 型費用追加分 商品:ENGINEKO猫\n' +
    '例2) /支出 2415 梱包・資材費 ダンボール代 ランニング メモ:初回出荷分\n' +
    '例3) /支出 18万 知財・法務費 EU商標出願 イニシャル 支払者:早川';
}

function incomeUsage() {
  return '📖 使い方: /収入 金額 種別 項目 [日付:6/10] [メモ:自由記述]\n' +
    '・種別は「売上」または「助成金」\n' +
    '例1) /収入 50000 売上 ENGINEKO猫1体 メモ:〇〇様\n' +
    '例2) /収入 300万 助成金 特別創業支援補助金';
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
