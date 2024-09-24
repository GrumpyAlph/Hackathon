import axios from "axios";

export async function getPrompt(url: string = '', filterType: string) {
    try {
        const response = await axios.get(`${url}/api/repositories`, {
            params: {
                table: 'Prompts', 
                promptType: filterType,
            },
        });

        return response.data || [];

    } catch (error) {
        console.error('Error fetching Listed Token:', error);
    }
}