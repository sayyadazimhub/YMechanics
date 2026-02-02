import { updatePasswordService } from "@/app/services/users_service";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/users/password:
 *   patch:
 *     summary: Update user password
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: NewStrongPass123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

export async function PATCH(request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('id');
        const { newPassword } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { statusCode: "400", message: "User ID is required" },
                { status: 400 }
            );
        }

        if (!newPassword) {
            return NextResponse.json(
                { statusCode: "400", message: "New password is required" },
                { status: 400 }
            );
        }

        const response = await updatePasswordService(userId, newPassword);

        if (response.statusCode !== "200") {
            return NextResponse.json(
                { statusCode: response.statusCode, message: response.message },
                { status: parseInt(response.statusCode) }
            );
        }

        return NextResponse.json(
            {
                statusCode: "200",
                message: "Password updated successfully",
                data: response.data
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { statusCode: "500", message: error.message },
            { status: 500 }
        );
    }
}
