export const formatDateForApi = (dateString: string) => {
        return dateString.split('-').reverse().join('/');
};

export const getDateUTC = (date: Date) => {
        return date.getUTCFullYear() + '-' +
                String(date.getUTCMonth() + 1).padStart(2, '0') + '-' +
                String(date.getUTCDate()).padStart(2, '0');
};

export const getDateTimeUTC = (date: Date) => {
        const utcDate = date.getUTCFullYear() + '-' +
                String(date.getUTCMonth() + 1).padStart(2, '0') + '-' +
                String(date.getUTCDate()).padStart(2, '0');

        return utcDate + ' ' +
                String(date.getUTCHours()).padStart(2, '0') + ':' +
                String(date.getUTCMinutes()).padStart(2, '0') + ':' +
                String(date.getUTCSeconds()).padStart(2, '0');
};

export const formattedDateForCoinGecko = (date: Date) => {
        return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
        }).split('/').join('-');
}