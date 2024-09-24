import axios from 'axios';

export async function fetchGrumpyFees(url: string = '') {
    return fetchGrumpySettings(url, 'fee'); 
}

export async function fetchGrumpyNode(url: string = '') {
    return fetchGrumpySettings(url, 'node');  
}
 
export async function fetchGrumpySettings(url: string = '', filterType: string) {
    try {
        const response = await axios.get(`${url}/api/repositories`, {
            params: {
                table: 'Settings', 
                settingType: filterType,
            },
        });

        return response.data || [];

    } catch (error) {
        console.error('Error fetching Listed Token:', error);
    }
}