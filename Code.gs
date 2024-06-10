// Serves the HTML file as a web app
function doGet() {
    return HtmlService.createHtmlOutputFromFile('index')
        .setTitle('用量計算機')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Fetches names of all tabs in the spreadsheet
function getDiseaseTypes() {
    var spreadsheetId = '1qAYSdC0hQHgNAtIoboxUKOxNDpIaojCymfSsZ-V1dLc'; // 指定されたスプレッドシートID
    var sheets = SpreadsheetApp.openById(spreadsheetId).getSheets();
    return sheets.map(sheet => sheet.getName());
}
