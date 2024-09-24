import { connection } from "@/utilities/dbUtilities";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { promptType } = await req.json();
        const records = await getPrompt(promptType);

        return new NextResponse(JSON.stringify({ success: true, data: records }), {
            status: 200,
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message }), {
            status: 500,
        });
    }
}

async function getPrompt(promptType: string) {
    const query = 'SELECT * FROM Prompts WHERE PromptType = ?';
    const values = [promptType];
    try {
        const [rows] = await connection.execute(query, [values]);
        return rows;

    } catch (error) {
        console.error('Error retrieving records:', error);
        throw error;
    }
}