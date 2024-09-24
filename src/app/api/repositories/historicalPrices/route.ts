import { connection } from "@/utilities/dbUtilities";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const records = await getAllRecords();
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
    const { priceDate, price } = await req.json();
  
    try {
      const result = await saveHistorical(priceDate, price);
      return new NextResponse(JSON.stringify({ success: true, result }), {
        status: 200,
      });
    } catch (error) {
      return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message }), {
        status: 500,
      });
    }
  }

  async function getAllRecords() {
    const query = 'SELECT * FROM Historical ORDER BY PriceDate DESC LIMIT 200';
  
    try {
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      console.error('Error retrieving records:', error);
      throw error;
    }
  }

  async function saveHistorical(priceDate: Date, price: string) {
    const selectQuery = `
      SELECT * FROM Historical WHERE PriceDate = ?`;
    const insertQuery = `
      INSERT INTO Historical (PriceDate, Price) VALUES (?, ?)`;
    const insertValues = [priceDate, price];

    const updateQuery = `
      UPDATE Historical SET Price = ? WHERE PriceDate = ?`;
      const updateValues = [price, priceDate];

    try {
      const [rows] = await connection.execute(selectQuery, [priceDate]);
      if (rows && Array.isArray(rows) && rows.length > 0) {
        await connection.execute(updateQuery, updateValues);
        return 'Record updated successfully';
      } else {
        await connection.execute(insertQuery, insertValues);
        return 'Record inserted successfully';
      }
    } catch (error) {
      console.error('Error saving record:', error);
      throw error;
    }
  }