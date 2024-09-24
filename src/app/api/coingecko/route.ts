import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');    
  const date = searchParams.get('date');

  if (!id || !date) {
    return NextResponse.json(
      { error: 'Both "id" and "date" query parameters are required.' },
      { status: 400 }
    );
  }

  try {
    const options = {
        method: 'GET',
        url: `https://api.coingecko.com/api/v3/coins/${id}/history`,
        params: { date },
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': process.env.COINGECKO, 
        },
      };
  
      // Make the request to CoinGecko
      const response = await axios.request(options);

    // Return the API response as JSON
    return NextResponse.json(response.data);
  } catch  {
    return NextResponse.json(
      { error: 'An error occurred while fetching data from CoinGecko. ' },
      { status: 500 }
    );
  }
}
