// SFM7 calculation function
function calculateDosageForSFM7(weight) {
    const sheetId = '16eiIQ1LOAhvm-SOapAU4vVg9ALlTCaWeEiEk_fMYX5Y'; // Spreadsheet ID
    const dosageSheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    const dosageData = dosageSheet.getRange("A2:C3").getValues();

    let initialDose = parseFloat(dosageData[0][0]) * weight;
    let continuousDose = parseFloat(dosageData[0][1]) * weight;
    let maxDose = parseFloat(dosageData[0][2]) * weight;

    return {
        initialDose: initialDose.toFixed(1),
        continuousDose: continuousDose.toFixed(1),
        maxDose: maxDose.toFixed(1)
    };
}
