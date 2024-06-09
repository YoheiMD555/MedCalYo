// SFM4計算関数
function calculateDosageForSFM4(weight) {
    const sheetId = '1z0Zb7r-BsrUWuLJLZ-aWHdj8xnIZpLAQcJpV-0lFYm8';  // スプレッドシートID
    const dosageSheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    const dosageData = dosageSheet.getDataRange().getValues();

    // Extract the weights into a separate array for binary search
    const weights = dosageData.slice(1).map(row => parseFloat(row[0])); // Skip header row
    const index = binarySearchClosest(weights, weight);

    const result = {};
    if (index !== -1) {
        result.medication = parseFloat(dosageData[index + 1][1]).toFixed(1);  // +1 to account for header row
        result.diluent = parseFloat(dosageData[index + 1][2]).toFixed(1);
    } else {
        result.medication = undefined;
        result.diluent = undefined;
    }

    return result;
}

// Binary search to find the index of the closest weight
function binarySearchClosest(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    if (target <= arr[left]) {
        return left;
    }
    if (target >= arr[right]) {
        return right;
    }

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        }
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // Return the closest index
    return (arr[left] - target) < (target - arr[right]) ? left : right;
}

// テスト関数
function testCalculateDosageForSFM4() {
    const testCases = [
        { weight: 5, expectedMedication: "2.0", expectedDiluent: "8.0" }, // 例: 正常系テストケース
        { weight: 10, expectedMedication: "4.0", expectedDiluent: "6.0" }, // 例: 正常系テストケース
        { weight: 15, expectedMedication: "6.0", expectedDiluent: "14.0" }, // 例: 正常系テストケース
        { weight: 20, expectedMedication: "8.0", expectedDiluent: "12.0" }, // 例: 正常系テストケース
        // 境界ケースや異常ケースも追加可能
    ];

    testCases.forEach(testCase => {
        const result = calculateDosageForSFM4(testCase.weight);
        Logger.log(`体重: ${testCase.weight} kg -> 薬剤: ${result.medication} mL, 生食: ${result.diluent} mL`);
        if (result.medication !== testCase.expectedMedication || result.diluent !== testCase.expectedDiluent) {
            Logger.log(`エラー: 体重 ${testCase.weight}kg で期待される薬剤量 ${testCase.expectedMedication}、生食量 ${testCase.expectedDiluent} ではなく、計算された薬剤量: ${result.medication}、生食量: ${result.diluent}`);
        } else {
            Logger.log(`成功: 体重 ${testCase.weight}kg で期待される薬剤量 ${testCase.expectedMedication}、生食量 ${testCase.expectedDiluent} が正しく計算されました。`);
        }
    });
}
