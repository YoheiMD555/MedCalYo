// SFM10の計算関数
export function calculateDosageForSFM10(weight, row) {
    const dosagePerKg = parseFloat(row[7]);  // コラムHから用量を取得 (μg/kg)
    const maxDosage = parseFloat(row[9]);    // コラムJから最大用量を取得 (μg)

    let dosage = dosagePerKg * weight; // μg
    if (dosage > maxDosage) {
        dosage = maxDosage;
    }

    return {
        medication: roundToSigFigs(dosage, 1),
        isMaxDosage: dosage === maxDosage
    };
}
