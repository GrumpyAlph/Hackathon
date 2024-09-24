import axios from "axios";
import { getPrompt } from "./prompts.service";
import { transformHistoricalData } from "@/utilities/formatUtility";
import { getDateUTC } from "@/utilities/dateUtilities";

export interface PredictionData {
    currentPrice: number;
    prediction: string;
}

export const getOraclePricePrediction = async (url: string = '') => {
    try {

        const res = await axios.get(`${url}/api/repositories/historicalPrices`);
        const fetchedData = res.data;

        const data = transformHistoricalData(fetchedData.data);
        const prompt = await getPrompt(url, 'oracle_price_prompt');
        const systemPrompt = prompt[0].SystemPrompt;

        const openAIResponse = await axios.post(`${url}/api/openAI`, {
            prompt: `${JSON.stringify(data)}`,
            systemPrompt: systemPrompt
        });


        await axios.post(`${url}/api/repositories/predictions`, {
            predictionDate: getDateUTC(new Date),
            prediction: openAIResponse.data.choices[0].message.content,
        });

        return { currentPrice: data[0].p, prediction: openAIResponse.data.choices[0].message.content };

    } catch (error) {
        console.error(`Error fetching OpenAI response: ${url}`, error);
        throw new Error(`Error fetching the prediction or OpenAI response ${error}`);
    }
}