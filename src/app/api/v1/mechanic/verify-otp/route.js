import { NextResponse } from "next/server";
import { verifyMechanicService } from "@/app/services/mechanics_service";

export async function POST(req) {
  try {
    const { username, otp } = await req.json();

    const result = await verifyMechanicService(username, otp);

    return NextResponse.json(
      { message: result.message },
      { status: Number(result.statusCode) }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json({
      message: "Verification failed"
    }, { status: 500 });
  }
}
