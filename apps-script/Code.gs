// ================================================================
// ENGINEKO 収支管理 API - Google Apps Script
//
// ■ シート構成
//   「商品データ」 A:商品名  B:単価  C:販売数
//   「支出」       A:日付    B:カテゴリ  C:項目  D:金額  E:支払者  F:メモ
//   「収入」       A:日付    B:種別      C:項目  D:金額  E:メモ
//
// ■ エンドポイント（すべて GET）
//   ?action=getProducts              → 商品データ一覧
//   ?action=saveProducts&data=<JSON> → 商品データ上書き保存
//   ?action=getExpenses[&fy=FY2026]  → 支出一覧（年度フィルタ任意）
//   ?action=getIncome[&fy=FY2026]    → 収入一覧（年度フィルタ任意）
// ================================================================

const PRODUCTS_SHEET = '商品データ';
const EXPENSES_SHEET = '支出';
const INCOME_SHEET   = '収入';

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
