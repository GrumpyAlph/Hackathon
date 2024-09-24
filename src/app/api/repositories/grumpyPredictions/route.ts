import { connection } from "@/utilities/dbUtilities";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const records = await getTodaysPredictions();
    return new NextResponse(JSON.stringify({ success: true, data: records }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
    const { predictionDate, prediction } = await req.json();
  
    try {
      const result = await savePrediction(predictionDate, prediction);
      return new NextResponse(JSON.stringify({ success: true, result }), {
        status: 200,
      });
    } catch (error) {
      return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message }), {
        status: 500,
      });
    }
  }

  async function getTodaysPredictions() {
    const query = 'SELECT * FROM GrumpyPredictions WHERE DATE(PredictionDate) = UTC_DATE()';
  
    try {
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      console.error('Error retrieving records:', error);
      throw error;
    }
  }

  async function savePrediction(predictionDate: Date, prediction: string) {
    const query = `
      INSERT INTO GrumpyPredictions (PredictionDate, Prediction) 
      VALUES (?, ?)
    `;
    const values = [predictionDate, prediction];
  
    try {
      const [result] = await connection.execute(query, values);
      return result;
    } catch (error) {
      console.error('Error saving record:', error);
      throw error;
    }
  }