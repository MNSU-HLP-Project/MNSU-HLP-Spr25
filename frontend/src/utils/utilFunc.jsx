
export const formatDateToMMDDYYYY = (date) => {
    // Added line 3 to fix error that happens when date is entered as a string
    const d = new Date(date); // Ensure it's a Date object
    const mm = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
};

/**
 * Parse a date string (YYYY-MM-DD) as a local date, not UTC
 * This prevents timezone shifts when displaying dates
 */
export const parseLocalDateString = (dateString) => {
    if (!dateString) return null;
    // Parse YYYY-MM-DD format as local date (not UTC)
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed in Date constructor
};

/**
 * Format a date string (YYYY-MM-DD) to locale date string
 * This ensures dates are displayed correctly regardless of timezone
 */
export const formatDateStringToLocale = (dateString) => {
    if (!dateString) return '';
    const date = parseLocalDateString(dateString);
    if (!date) return '';
    return date.toLocaleDateString();
};

