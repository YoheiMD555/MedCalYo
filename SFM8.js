import { roundToSigFigs } from './calculate.js';

export function calculateDosageForSFM8(weight, row) {
    const dosagePerKg = parseFloat(row[7]);  // コラムHから用量を取得 (mg/kg)
    const maxDosage = parseFloat(row[9]);    // コラムJから最大用量を取得 (mg)

    let dosage = dosagePerKg * weight; // mg
    if (dosage > maxDosage) {
        dosage = maxDosage;
    }

    // 投与量をmLに変換 (薬剤を10倍に希釈するため)
    let finalVolume = dosage / 0.1;

    return {
        finalVolume: roundToSigFigs(finalVolume, 1),
        medication: roundToSigFigs(dosage, 1),
        isMaxDosage: dosage === maxDosage
    };
}

export function testCalculateDosageForSFM8() {
    const row = [null, null, null, null, null, null, null, 0.01, null, 1];  // ダミーデータ: [,,, H (mg/kg), , , , J (mg)]

    const testCases = [
        { weight: 5, expected: 'バイアル1 mLと生食9 mLを混ぜたあと、0.5 mLを静脈投与' },
        { weight: 120, expected: 'バイアル1 mLと生食9 mLを混ぜたあと、10 mLを静脈投与' }  // 最大用量のテストケース
    ];

    testCases.forEach(testCase => {
        try {
            const result = calculateDosageForSFM8(testCase.weight, row);
            const output = `バイアル1 mLと生食9 mLを混ぜたあと、${result.finalVolume} mLを静脈投与`;
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
