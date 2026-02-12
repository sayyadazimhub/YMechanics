import { NextResponse } from 'next/server';
import { resetPasswordService } from '@/app/services/mechanics_service';

// export async function POST(req) {

//   const { token, password } = await req.json();

//   const res = await resetPasswordService(token, password);

//   return NextResponse.json(res, {
//     status: res.statusCode
//   });
// }

export async function POST(req) {

  const { otp, password } = await req.json();

  await resetPasswordService(otp, password);

  return NextResponse.json({
    message: "Password reset successful",
  });
}