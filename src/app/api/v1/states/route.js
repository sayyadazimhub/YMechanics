import { NextResponse } from "next/server";
import { getStatesService, addStateService } from "../../../services/states_service";

export async function GET() {
    const response = await getStatesService();
    return NextResponse.json(response, { status: parseInt(response.statusCode) });
}

export async function POST(request) {
    const body = await request.json();
    const response = await addStateService(body);
    return NextResponse.json(response, { status: parseInt(response.statusCode) });
}
