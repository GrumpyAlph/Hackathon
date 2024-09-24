import { getOraclePricePrediction } from '@/services/openAI.service';
import { savePricePredictionToOracle } from '@/services/predictionContract.service';
import { formattedDateForCoinGecko } from '@/utilities/dateUtilities';
import { transformCoinData } from '@/utilities/formatUtility';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers.get('x-secret-token');

  let message = '';
  if (token !== process.env.CRON_TOKEN) {
    message += 'Unauthorized';
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {

    message += await runCronJob();

    return NextResponse.json({ message: message });
  } catch (error) {
    console.error('Error performing tasks:', error);
    return NextResponse.json({ message: 'Error performing tasks' }, { status: 500 });
  }
}

const runCronJob = async () => {
  let message = '';

  try {
    const url = process.env.SITE_URL;

    const date = new Date();

    message += `Running cron job for ${date} `;

    message += `Fetching price data from CoinGecko `;
    const priceDataFromGecko = await axios.get(`${url}/api/coingecko`, {
      params: {
        id: 'alephium',
        date: formattedDateForCoinGecko(date),
      },
    });

    message += `Price data fetched from CoinGecko `;

    if (!priceDataFromGecko) return message += 'No price data returned from CoinGecko ';

    const coinData = transformCoinData(priceDataFromGecko.data);

    const formattedDate = date.toISOString().split('T')[0];
    message += `Updating historical prices in the database ${formattedDate}`;
    await axios.post(`${url}/api/repositories/historicalPrices`, {
      priceDate: formattedDate,
      price: coinData,
    });

    message += 'Getting prediction from OpenAI ';
    const openAIResponse = await getOraclePricePrediction(url);

    try {

      message += `Saving prediction to the oracle contract ${JSON.stringify(openAIResponse)}`;
      await savePricePredictionToOracle(openAIResponse, url);

    } catch (error) {
      console.error('Fur Balls!:', error);
    }

    return message;

  } catch (error) {
    console.error('Error performing tasks:', error);
    return `Error performing tasks ${error}, ${message}`;
  }
}