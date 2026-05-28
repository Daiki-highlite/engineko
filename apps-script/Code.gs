// ================================================================
// ENGINEKO 商品データ管理 - Google Apps Script
// Google Sheets をデータベースとして使うシンプルな API
//
// ■ シートの構成（シート名:「商品データ」）
//   A列: 商品名
//   B列: 単価（円）
//   C列: 販売数
//   ※1行目はヘッダー（商品名 / 単価 / 販売数）
//
// ■ エンドポイント
//   GET  ?            → 商品一覧を JSON で返す
//   GET  ?action=save&data=<JSON> → 商品一覧を上書き保存
// ================================================================

const SHEET_NAME = '商品データ';

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    // ── 保存リクエスト ───────────────────────────────────────
    if (e.parameter.action === 'save') {
      const products = JSON.parse(decodeURIComponent(e.parameter.data));

      // ヘッダー行(1行目)を残してデータをクリア
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 3).clearContent();
      }

      // 新しいデータを書き込む
      products.forEach((p, i) => {
        sheet.getRange(i + 2, 1).setValue(p.name);
        sheet.getRange(i + 2, 2).setValue(Number(p.price));
        sheet.getRange(i + 2, 3).setValue(Number(p.qty));
      });

      return respond({ status: 'ok', saved: products.length });
    }

    // ── 読み込みリクエスト ───────────────────────────────────
    const rows = sheet.getDataRange().getValues();
    const products = [];
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] !== '') {
        products.push({
          name:  String(rows[i][0]),
          price: Number(rows[i][1]),
          qty:   Number(rows[i][2]),
        });
      }
    }
    return respond(products);

  } catch (err) {
    return respond({ status: 'error', message: err.toString() });
  }
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
