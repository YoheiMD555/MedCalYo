import { roundToSigFigs } from './calculate.js';

export function calculateDosageForSFM9(weight, row) {
    const dosagePerKg = parseFloat(row[7]);  // コラムHから用量を取得 (mg/kg)
    const maxDosage = parseFloat(row[9]);    // コラムJから最大用量を取得 (mg)
    const volumeMultiplier = parseFloat(row[11]);  // コラムLの値を取得

    let dosage = dosagePerKg * weight; // mg
    if (dosage > maxDosage) {
        dosage = maxDosage;
    }

    let finalVolume = dosage * volumeMultiplier; // 最終投与量を計算

    return {
        medication: roundToSigFigs(dosage, 1),
        finalVolume: roundToSigFigs(finalVolume, 1),
        isMaxDosage: dosage === maxDosage
    };
}

export function testCalculateDosageForSFM9() {
    const row = [null, null, null, null, null, null, null, 0.01, null, 1];  // ダミーデータ: [,,, H (mg/kg), , , , J (mg)]

    const testCases = [
        { weight: 5, expected: '5.0 mg' },
        { weight: 120, expected: '1.0 mg' }  // 最大用量のテストケース
    ];

    testCases.forEach(testCase => {
        try {
            const result = calculateDosageForSFM9(testCase.weight, row);
            const output = `${result.medication} mg`;
            if (output !== testCase.expected) {
                Logger.log(`エラー: 体重 ${testCase.weight}kg の場合に期待される出力: "${testCase.expected}", 実際の出力: "${output}"`);
            } else {
                Logger.log(`成功: 体重 ${testCase.weight}kg の場合に期待される出力が得られました。`);
            }
        } catch (error) {
            Logger.log(`エラー: ${error.message}`);
        }
    });
}
