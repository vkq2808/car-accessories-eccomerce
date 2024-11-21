export function formatNumberWithCommas(value) {
    return value ? (value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) : "";
}
export function maximizeString(string, length) {
    return string?.length > length ? `${string.substring(0, length)}...` : string;
}