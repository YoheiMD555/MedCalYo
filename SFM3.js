export async function calculateDosageForSFM3(weight) {
    const spreadsheetId = '1rx2oDEms28Dpji01TiHoA5EXQpHnKq78ZF5BU6GktWk'; // SFM3のスプレッドシートID
    const range = 'Sheet1!A1:L1000'; // 適切なシート名と範囲を指定してください
    const apiKey = 'AIzaSyCu9ekb7iQWvmGi3TpOndM_ry7GjAFn9no'; // Google Sheets APIキーをここに入力

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const sheetData = data.values;

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
        for (let i = 1; i < sheetData.length; i++) { // Skip header row
            const value = sheetData[i][column];
            if (value) {
                results.push(sheetData[i][0] + ': <b>' + value + '</b>'); // Data in column A as label
            }
        }

        return results;
    } catch (error) {
        console.error('Error fetching data:', error);
        return ["データ取得エラー"];
    }
}
