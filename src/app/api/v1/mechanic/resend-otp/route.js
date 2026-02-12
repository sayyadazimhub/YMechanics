import { NextResponse } from "next/server";
import { resendMechanicOtpService } from "@/app/services/mechanics_service";

export async function POST(req) {
    try {
        const { username } = await req.json();

        const result = await resendMechanicOtpService(username);

        return NextResponse.json(
            { message: result.message },
            { status: Number(result.statusCode) }
        );

    } catch (err) {
        console.error(err);
        return NextResponse.json({
            message: "Resend failed"
        }, { status: 500 });
    }
}
