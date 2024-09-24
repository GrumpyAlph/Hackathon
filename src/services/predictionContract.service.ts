import { GrumpyFortunesInstance, UpdatePrediction } from '../../artifacts/ts';
import { hexToString, ONE_ALPH } from '@alephium/web3';
import { PrivateKeyWallet } from '@alephium/web3-wallet';
import { getRandomSelectionFromPrediction, getRandomSnarkyResponse } from '@/utilities/randomSelectionUtility';
import axios, { AxiosResponse } from 'axios';
import { PredictionData } from './openAI.service';
import { getNode, setNode } from './node.service';
import { getPrompt } from './prompts.service';
import { getDateUTC } from '@/utilities/dateUtilities';

export const fetchGrumpyPrediction = async (): Promise<string> => {
  try {
    const storedPredictions = await axios.get('/api/repositories/grumpyPredictions');
    const predictions = storedPredictions.data.data;

    if (predictions.length > 75) {
      const predictionFromTable  = JSON.parse(JSON.stringify(getRandomSnarkyResponse(predictions))).Prediction;
      return predictionFromTable;
    }

    const oraclePrediction = await fetchGrumpyPredictionFromContract();

    const randomTimeFrameSelected = getRandomSelectionFromPrediction(
      JSON.parse(JSON.stringify(oraclePrediction))
    );
    const prompt = JSON.stringify(randomTimeFrameSelected);

    const prompts = await getPrompt('', 'grumpy_prompt');
    const systemPrompt = prompts[0].SystemPrompt;

    let response: AxiosResponse<any, any>;
    try {
      response = await axios.post('/api/openAI', {
        prompt,
        systemPrompt: systemPrompt
      });
    } catch (error) {
      console.error(`Either the catnip made me high or the spinning finally got to me! I don't know what happened `, error);
      throw new Error(`Either the catnip made me high or the spinning finally got to me! I don't know what happened `);
    }

    try {
      const prediction = response.data.choices[0].message.content;

      await axios.post(`/api/repositories/grumpyPredictions`, {
        predictionDate: getDateUTC(new Date),
        prediction: prediction,
      });

      return prediction;
    } catch (error) {
      console.error('Mushrooms!  Why is the paint singning?', error);
      throw new Error(`Mushrooms!  Why is the paint singning?`);
    }

  } catch (error) {
    console.error('Hack! Hack! Hack! A furball got stuck in the tubes! Please try again later.', error);
    throw new Error(`Hack! Hack! Hack! A furball got stuck in the tubes! Please try again later.`);
  }
};

export const fetchGrumpyPredictionFromContract = async () => {
  setNode();

  try {
    const contractAddress = process.env.NEXT_PUBLIC_GRUMPY_PREDICTION_CONTRACT || process.env.GRUMPY_PREDICTION_CONTRACT || '';
    const grumpyFortuneInstance = new GrumpyFortunesInstance(contractAddress);
    const result = await grumpyFortuneInstance.view.getFortune();

    return {
      Id: result.returns.date,
      PredictionDate: new Date().toISOString(),
      Prediction: hexToString(result.returns.text)
    };

  } catch (error) {
    console.error("Error fetching prediction:", error);
    return null;
  }
};

export const savePricePredictionToOracle = async (predictionData: PredictionData, url: string = '') => {
  try {

    const nodeProvider = getNode();
    const privateKey = process.env.PRIVATE_KEY || process.env.NEXT_PUBLIC_PRIVATE_KEY || '';

    const wallet = new PrivateKeyWallet({ privateKey: privateKey, nodeProvider });

    const prediction = JSON.parse(predictionData.prediction);
    const newDate = BigInt((new Date()).getTime());  // Date as U256
    const newText = Buffer.from(JSON.stringify(prediction), 'utf8').toString('hex');

    const newPrice = BigInt(predictionData.currentPrice * 10 ** 18);

    const oracleId = process.env.NEXT_PUBLIC_ORACLE_ID || process.env.ORACLE_ID || '';
    const updateResult = await UpdatePrediction.execute(wallet, {
      initialFields: {
        oracle: oracleId,
        newDate,
        newText,
        newPrice
      },
      attoAlphAmount: ONE_ALPH
    });

    await axios.post(`${url}/api/repositories/oracleTransactions`, { transactionId: updateResult.txId });

    console.log(`Transaction ID: ${updateResult.txId}`);
  } catch (error) {
    console.error('Something happened!  That really makes me grumpy!', error);
  }
}