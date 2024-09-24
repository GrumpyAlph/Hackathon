  interface TimeFrameData {
    predicted_price: number;
    percentage_change: number;
  }

  interface PredictionObject {
    "24h": TimeFrameData;
    "7d": TimeFrameData;
    "1mo": TimeFrameData;
  }

  interface DataObject {
    Id: number;
    PredictionDate: string; 
    Prediction: string; 
  }

 export const getRandomSelectionFromPrediction = (obj: DataObject): { key: string, value: TimeFrameData } => {
    const prediction: PredictionObject = JSON.parse(obj.Prediction);
    
    const keys = Object.keys(prediction) as Array<keyof PredictionObject>;
    
    const randomIndex = Math.floor(Math.random() * keys.length);
    const randomKey = keys[randomIndex];
    
    return { key: randomKey, value: prediction[randomKey] };
  };

  export const getRandomSnarkyResponse = (responses: string[]): string => {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  };
  