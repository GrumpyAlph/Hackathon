import { connection } from "@/utilities/dbUtilities";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { transactionId } = await req.json();
  
    try {
      const result = await saveOracleTransaction(transactionId);
      return new NextResponse(JSON.stringify({ success: true, result }), {
        status: 200,
      });
    } catch (error) {
      return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message }), {
        status: 500,
      });
    }
  }

  async function saveOracleTransaction(transactionId: string) {
    const query = `
      INSERT INTO OracleTransactions (TransactionDate, TransactionId) 
      VALUES (?, ?)
    `;
    const values = [new Date(), transactionId];
  
    try {
      const [result] = await connection.execute(query, values);
      return result;
    } catch (error) {
      console.error('Error saving record:', error);
      throw error;
    }
  }  