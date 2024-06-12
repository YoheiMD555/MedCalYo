import { roundToSigFigs, fetchSheetData } from './calculate.js';

export async function calculateDosageForSFM7(weight) {
    const spreadsheetId = '16eiIQ1LOAhvm-SOapAU4vVg9ALlTCaWeEiEk_fMYX5Y'; // スプレッドシートID
    const range = 'Sheet1!A2:L1000'; // 適切な範囲を指定してください
    const dosageData = await fetchSheetData(spreadsheetId, range);

    if (!dosageData || dosageData.length < 1 || !dosageData[0] || dosageData[0].length < 3) {
        console.error('No data found or data format is incorrect');
        return {
            initialDose: undefined,
            continuousDose: undefined,
            maxDose: undefined
        };
    }

    const initialDose = parseFloat(dosageData[0][0]) * weight;
    const continuousDose = parseFloat(dosageData[0][1]) * weight;
    const maxDose = parseFloat(dosageData[0][2]) * weight;

    return {
        initialDose: initialDose.toFixed(1),
        continuousDose: continuousDose.toFixed(1),
        maxDose: maxDose.toFixed(1)
    };
}

// テスト関数
export async function testCalculateDosageForSFM7() {
    const testCases = [
        { weight: 5, expectedInitialDose: "1.0", expectedContinuousDose: "0.5", expectedMaxDose: "2.0" }, // 例: 正常系テストケース
        { weight: 10, expectedInitialDose: "2.0", expectedContinuousDose: "1.0", expectedMaxDose: "4.0" }, // 例: 正常系テストケース
        { weight: 15, expectedInitialDose: "3.0", expectedContinuousDose: "1.5", expectedMaxDose: "6.0" }, // 例: 正常系テストケース
        { weight: 20, expectedInitialDose: "4.0", expectedContinuousDose: "2.0", expectedMaxDose: "8.0" }, // 例: 正常系テストケース
        // 境界ケースや異常ケースも追加可能
    ];

    for (const testCase of testCases) {
        const result = await calculateDosageForSFM7(testCase.weight);
        console.log(`体重: ${testCase.weight} kg -> 初回投与量: ${result.initialDose} mL, 継続投与量: ${result.continuousDose} mL, 最大投与量: ${result.maxDose} mL`);
        if (result.initialDose !== testCase.expectedInitialDose || result.continuousDose !== testCase.expectedContinuousDose || result.maxDose !== testCase.expectedMaxDose) {
            console.log(`エラー: 体重 ${testCase.weight}kg で期待される初回投与量 ${testCase.expectedInitialDose}、継続投与量 ${testCase.expectedContinuousDose}、最大投与量 ${testCase.expectedMaxDose} ではなく、計算された初回投与量: ${result.initialDose}、継続投与量: ${result.continuousDose}、最大投与量: ${result.maxDose}`);
        } else {
            console.log(`成功: 体重 ${testCase.weight}kg で期待される初回投与量 ${testCase.expectedInitialDose}、継続投与量 ${testCase.expectedContinuousDose}、最大投与量 ${testCase.expectedMaxDose} が正しく計算されました。`);
        }
    }
}
