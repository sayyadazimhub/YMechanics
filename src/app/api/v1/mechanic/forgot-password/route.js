// import { NextResponse } from 'next/server';
// import { forgotPasswordService } from '@/app/services/mechanics_service';

// export async function POST(req) {

//   const { email } = await req.json();

//   const res = await forgotPasswordService(email);

//   return NextResponse.json(res, {
//     status: res.statusCode
//   });
// }

import { NextResponse } from 'next/server';
import { forgotPasswordService } from "@/app/services/mechanics_service";
import { getMechanicByUsernameDal } from "@/app/dal/mechanics_dal";

export async function POST(req) {

  const { email } = await req.json();

  const mechanic = await getMechanicByUsernameDal(email);

  if (!mechanic) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  await forgotPasswordService(mechanic);

  return NextResponse.json({
    message: "OTP sent to email",
  });

}