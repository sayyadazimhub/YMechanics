import { NextResponse } from "next/server";
import { getStateByIdService, updateStateService, deleteStateService } from "../../../../services/states_service";

export async function GET(request, { params }) {
    const { id } = await params;
    const response = await getStateByIdService(id);
    return NextResponse.json(response, { status: parseInt(response.statusCode) });
}

export async function PUT(request, { params }) {
    const { id } = await params;
    const body = await request.json();
    const response = await updateStateService(id, body);
    return NextResponse.json(response, { status: parseInt(response.statusCode) });
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    const response = await deleteStateService(id);
    return NextResponse.json(response, { status: parseInt(response.statusCode) });
}
