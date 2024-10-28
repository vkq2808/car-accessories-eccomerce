export function formatNumberWithCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function maximizeString(string, maxLength) {
    return string.length > maxLength ? string.substring(0, maxLength) + "..." : string;
}