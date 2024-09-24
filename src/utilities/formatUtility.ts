export const transformCoinData = (data: any) => {
    return {
        p: data.market_data.current_price.usd,
        m: data.market_data.market_cap.usd,
        v:  data.market_data.total_volume.usd
    };
  };

  interface InputData {
    Id: number;
    PriceDate: string;
    Price: string;
  }
  
  export interface ProcessedData {
    d: string;
    p: number;
    m: number;
    v: number;
  }
  
  export const transformHistoricalData = (data: InputData[]): ProcessedData[] => {
    return data.map(item => {
      const { p, m, v } = JSON.parse(item.Price); // Parse the Price field into an object
  
      return {
        d: item.PriceDate.split('T')[0],
        p, 
        m, 
        v,
      };
    });
  };
  
