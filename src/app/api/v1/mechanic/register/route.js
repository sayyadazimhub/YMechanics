import { NextResponse } from "next/server";
import { registerMechanicService } from "../../../../services/mechanics_service";

export async function POST(request) {
    try {
        const registrationData = await request.json();
        const response = await registerMechanicService(registrationData);
        return NextResponse.json(response, { status: parseInt(response.statusCode) });
    } catch (error) {
        return NextResponse.json({ message: error.message, statusCode: "500" }, { status: 500 });
    }
}
