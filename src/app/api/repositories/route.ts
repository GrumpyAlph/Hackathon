import { buildQuery, connection } from "@/utilities/dbUtilities";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = req.nextUrl;
  
      const table = searchParams.get('table');
      if (!table) {
        return NextResponse.json(
          { error: 'Missing required query parameter: table' },
          { status: 400 }
        );
      }
  
      const conditions = Object.fromEntries(
        Array.from(searchParams.entries()).filter(([key]) => key !== 'table')
      );
  
      const { query, values } = buildQuery({
        table,
        operation: 'SELECT',
        conditions,
      });
  
      const [rows] = await connection.execute(query, values);
      return NextResponse.json(rows, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }