import { NextResponse } from 'next/server';
import { verifyResetOtpService } from '@/app/services/mechanics_service';

export async function POST(request) {

  try {

    const body = await request.json();

    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    await verifyResetOtpService(email, otp);

    return NextResponse.json(
      { message: 'OTP verified successfully' },
      { status: 200 }
    );

  } catch (error) {

    console.error('Verify OTP Error:', error);

    return NextResponse.json(
      { message: error.message || 'Server Error' },
      { status: 400 }
    );
  }
}
