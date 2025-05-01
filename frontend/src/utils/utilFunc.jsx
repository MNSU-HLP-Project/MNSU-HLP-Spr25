
export const formatDateToMMDDYYYY = (date) => {
    // Added line 3 to fix error that happens when date is entered as a string
    const d = new Date(date); // Ensure it's a Date object
    const mm = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
};

