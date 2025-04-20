
export const formatDateToMMDDYYYY = (date) =>{ 
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    console.log(mm)
    return `${yyyy}-${mm}-${dd}`;
}

