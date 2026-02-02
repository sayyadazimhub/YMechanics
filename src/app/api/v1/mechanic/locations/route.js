import { NextResponse } from "next/server";
// import { getStatesService, getCitiesService } from "../../../../../services/mechanics_service";
import { getStatesService, getCitiesService } from "../../../../services/mechanics_service";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const stateId = searchParams.get('stateId');

    if (stateId) {
        const response = await getCitiesService(stateId);
        return NextResponse.json(response, { status: parseInt(response.statusCode) });
    }

    const response = await getStatesService();
    return NextResponse.json(response, { status: parseInt(response.statusCode) });
}
