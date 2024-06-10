// SFM3 calculation function
export function calculateDosageForSFM3(weight) {
    const sheetId = '1rx2oDEms28Dpji01TiHoA5EXQpHnKq78ZF5BU6GktWk'; // SFM3のスプレッドシートID
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    const data = sheet.getDataRange().getValues();

    let column;
    if (weight <= 3) {
        column = 1; // Column B
    } else if (weight <= 4) {
        column = 2; // Column C
    } else if (weight <= 5) {
        column = 3; // Column D
    } else if (weight <= 7) {
        column = 4; // Column E
    } else if (weight <= 9) {
        column = 5; // Column F
    } else if (weight <= 11) {
        column = 6; // Column G
    } else if (weight <= 14) {
        column = 7; // Column H
    } else if (weight <= 18) {
        column = 8; // Column I
    } else if (weight <= 22) {
        column = 9; // Column J
    } else if (weight <= 29) {
        column = 10; // Column K
    } else if (weight <= 36) {
        column = 11; // Column L
    } else {
        return ["対応する列が見つかりませんでした。"]; // Error message if no column matches the weight
    }

    const results = [];
    for (let i = 1; i < data.length; i++) { // Skip header row
        const value = data[i][column];
        console.log(value);
        if (value) {
            console.log(data[i][0]);
            results.push(data[i][0] + ': <b>' + value + '</b>'); // Data in column A as label
        }
    }

    console.log(results);

    return results;
}
