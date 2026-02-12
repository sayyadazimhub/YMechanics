import { loginService } from "@/app/services/users_service";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
export async function POST(request) {
    try {
        const body = await request.json();

        const result = await loginService(body);

        if (result.statusCode !== "200") {
            return NextResponse.json(result, { status: parseInt(result.statusCode) });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                statusCode: 500,
                message: error.message,
            },
            { status: 500 }
        );
    }
}
