// SFMファイルから関数をインポート
import { calculateDosageForSFM2 } from './SFM2.gs';
import { calculateDosageForSFM3 } from './SFM3.gs';
import { calculateDosageForSFM4 } from './SFM4.gs';
import { calculateDosageForSFM5 } from './SFM5.gs';
import { calculateDosageForSFM6 } from './SFM6.gs';
import { calculateDosageForSFM7 } from './SFM7.gs';
import { calculateDosageForSFM8 } from './SFM8.gs';
import { calculateDosageForSFM9 } from './SFM9.gs';
import { calculateDosageForSFM10 } from './SFM10.gs';

function roundToSigFigs(num, sigFigs) {
    if (num === 0) return 0;
    const mult = Math.pow(10, sigFigs - Math.floor(Math.log10(Math.abs(num))) - 1);
    return Math.round(num * mult) / mult;
}

function getDosage(row, weight, age) {
    if (row[1] === 'weight') {
        return roundToSigFigs(row[7] * weight, 3); // Adjusting to 3 significant figures
    } else if (row[1] === 'age') {
        return calculateAgeDependentDosage(age);
    } else {
        return '0';
    }
}

function calculateAgeDependentDosage(age) {
    // 年齢に基づいて用量を決定
    if (age < 1) {
        return 2.5;  // 1歳未満
    } else if (age >= 1 && age < 5) {
        return 5;    // 1歳から5歳未満
    } else if (age >= 5 && age < 10) {
        return 7.5;  // 5歳から10歳未満
    } else if (age >= 10 && age < 18) {
        return 10;   // 10歳から18歳未満
    } else {
        return '対応する用量が見つかりませんでした。';  // 18歳以上は対象外
    }
}

function calculateDosage(diseaseType, weight, age, data) {
    return data.map(row => {
        let dosage = getDosage(row, weight, age);
        let volume, description;
        let isSFM3 = false;

        // Check if the dosage is a valid number
        if (typeof dosage === 'string') {
            return {
                drugName: row[0],
                dosage: dosage,
                description: '計算できませんでした',
                memo: row[14] || '',
                imageUrl: row[15] || ''
            };
        }

        switch (row[2]) {
            case 'concentrated':
                volume = roundToSigFigs(dosage * row[11], 1);
                description = `<span style="color: red;">原液まま ${volume} mL</span>投与`;
                break;
            case 'diluted':
                volume = roundToSigFigs(dosage * row[11], 1);
                let diluentVolume = parseFloat(row[10]);
                description = `<span style="color: red;">生食${diluentVolume}mL</span>に混ぜて、<span style="color: red;">${volume} mL</span>投与`;
                break;
            case 'special':
                if (row[3] === 'SFM2') {
                    let sfmResults = calculateDosageForSFM2(weight);
                    if (sfmResults.medication !== undefined && sfmResults.diluent !== undefined) {
                        description = `<span style="color: red;">薬剤${sfmResults.medication}mL</span>と<span style="color: red;">生食${sfmResults.diluent}mL</span>を混ぜて投与`;
                    } else {
                        description = "計算できませんでした";
                    }
                } else if (row[3] === 'SFM3') {
                    let sfm3Results = calculateDosageForSFM3(weight);
                    if (Array.isArray(sfm3Results)) {
                        description = sfm3Results.join(', ');
                    } else {
                        description = sfm3Results;  // エラーメッセージを表示
                    }
                    isSFM3 = true;
                } else if (row[3] === 'SFM4') {
                    let sfm4Results = calculateDosageForSFM4(weight);
                    description = `1バイアルを<span style="color: red;">5mL</span>で希釈。その<span style="color: red;">希釈液${sfm4Results.medication}mL</span>と<span style="color: red;">生食${sfm4Results.diluent}mL</span>を混ぜて全量投与`;
                    return {
                        drugName: row[0],
                        dosage: `${dosage} mg`,
                        description: description,
                        memo: row[14] || '',
                        imageUrl: row[15] || '',
                        isSFM3: false
                    };
                } else if (row[3] === 'SFM5') {
                    volume = roundToSigFigs(dosage * row[11], 1);
                    let diluentVolume = parseFloat(row[10]);
                    description = `<span style="color: red;">注射用水${diluentVolume}mL</span>に混ぜて、<span style="color: red;">${volume} mL</span>投与`;
                } else if (row[3] === 'SFM6') {
                    let sfm6Results = calculateDosageForSFM6(weight);
                    description = `1バイアルを<span style="color: red;">5mLで希釈</span>。その<span style="color: red;">希釈液${sfm6Results.medication}mL</span>と<span style="color: red;">生食${sfm6Results.diluent}mL</span>を混ぜて全量投与`;
                    return {
                        drugName: row[0],
                        dosage: `${dosage} mg` , // SFM6の場合に単位を追加
                        description: description,
                        memo: row[14] || '',
                        imageUrl: row[15] || '',
                        isSFM3: false
                    };
                } else if (row[3] === 'SFM7') {
                    let sfm7Results = calculateDosageForSFM7(weight);
                    description = `<span style="color: red;">原液${sfm7Results.initialDose}mL</span>を投与。その後、<span style="color: red;">${sfm7Results.continuousDose}mL/hr</span>で持続投与。以降、<span style="color: red;">${sfm7Results.maxDose}mL/hr</span>まで増量可能`;
                    return {
                        drugName: row[0],
                        dosage: `${dosage} mg`, // SFM7の場合に単位を追加
                        description: description,
                        memo: row[14] || '',
                        imageUrl: row[15] || '',
                        isSFM3: false
                    };
                     } else if (row[3] === 'SFM8') {
                    let sfm8Results = calculateDosageForSFM8(weight, row);
                    description = `バイアル1 mLと生食9 mLを混ぜたあと、<span style="color: red;">${sfm8Results.finalVolume} mL</span>を静脈投与`;
                    return {
                        drugName: row[0],
                        dosage: `${sfm8Results.medication} mg`, // SFM8の場合に単位を追加
                        description: description,
                        memo: row[14] || '',
                        imageUrl: row[15] || '',
                        isSFM3: false
                    };
                      } else if (row[3] === 'SFM9') {
                    let sfm9Results = calculateDosageForSFM9(weight, row);
                    description = `<span style="color: red;">原液まま${sfm9Results.finalVolume} mL</span>を静脈投与`;
                    return {
                        drugName: row[0],
                        dosage: `${sfm9Results.medication} mg`, // SFM9の場合に単位を追加
                        description: description,
                        memo: row[14] || '',
                        imageUrl: row[15] || '',
                        isSFM3: false
                    };
                   } else if (row[3] === 'SFM10') {
                    let sfm10Results = calculateDosageForSFM10(weight, row);
                    description = `原液まま<span style="color: red;">${sfm10Results.medication} mL</span>を静脈投与`;
                    return {
                        drugName: row[0],
                        dosage: `${sfm10Results.medication} μg`, // SFM10の場合に単位を追加
                        description: description,
                        memo: row[14] || '',
                        imageUrl: row[15] || '',
                        isSFM3: false
                    };
                } else {
                    description = "未定義の投与形態です";
                }
                break;
            default:
                description = "未定義の投与形態です";
                break;
        }

        return {
            drugName: row[0],
            dosage: `${dosage} mg`, // すべてのケースで単位を追加
            description: description,
            memo: row[14] || '',
            imageUrl: row[15] || '',
            isSFM3: isSFM3
        };
    });
}

export { calculateDosage };
