import { NextResponse } from "next/server";
import { loginMechanicService } from "../../../../services/mechanics_service";

export async function POST(request) {
    try {
        const loginData = await request.json();
        const response = await loginMechanicService(loginData);
        return NextResponse.json(response, { status: parseInt(response.statusCode) });
    } catch (error) {
        return NextResponse.json({ message: error.message, statusCode: "500" }, { status: 500 });
    }
}




