import { roundToSigFigs, fetchSheetData } from './calculate.js';

export async function calculateDosageForSFM2(weight) {
    const sheetId = '1w9sE_mYE1JkELdV4tQdWIXLQh8N75_3yhBZFeBdsoNQ';  // スプレッドシートID
    const sheetName = 'Sheet1';  // シート名
    const dosageData = await fetchSheetData(sheetId, sheetName);

    if (!dosageData) {
        return { medication: undefined, diluent: undefined };
    }

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
