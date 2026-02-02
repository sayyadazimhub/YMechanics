import { NextResponse } from "next/server";
import { getCityByIdService, updateCityService, deleteCityService } from "../../../../services/cities_service";

export async function GET(request, { params }) {
    const { id } = await params;
    const response = await getCityByIdService(id);
    return NextResponse.json(response, { status: parseInt(response.statusCode) });
}

export async function PUT(request, { params }) {
    const { id } = await params;
    const body = await request.json();
    const response = await updateCityService(id, body);
    return NextResponse.json(response, { status: parseInt(response.statusCode) });
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    const response = await deleteCityService(id);
    return NextResponse.json(response, { status: parseInt(response.statusCode) });
}
