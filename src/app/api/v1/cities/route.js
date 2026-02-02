import { NextResponse } from "next/server";
import { getCitiesService, addCityService } from "../../../services/cities_service";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const stateId = searchParams.get('stateId');

    const response = await getCitiesService(stateId);
    return NextResponse.json(response, { status: parseInt(response.statusCode) });
}

export async function POST(request) {
    const body = await request.json();
    const response = await addCityService(body);
    return NextResponse.json(response, { status: parseInt(response.statusCode) });
}
