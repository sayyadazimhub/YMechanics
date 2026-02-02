import { addUserService, getAllUsersService, getUsersService, updateUserService } from "@/app/services/users_service";
import { NextResponse } from "next/server";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "65fdc8a1b6f7b5d3e1a9a123"
 *         name:
 *           type: string
 *           example: John Doe
 *         username:
 *           type: string
 *           example: johndoe
 *         role:
 *           type: string
 *           enum: [CUSTOMER, MECHANIC, ADMIN]
 *           example: CUSTOMER
 *         is_active:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         username:
 *           type: string
 *           example: johndoe
 *         password:
 *           type: string
 *           example: StrongPass123
 *         role:
 *           type: string
 *           enum: [CUSTOMER, MECHANIC, ADMIN]
 *           example: CUSTOMER
 *
 *     ApiSuccessResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: string
 *           example: "201"
 *         message:
 *           type: string
 *           example: User created successfully
 *         data:
 *           $ref: '#/components/schemas/User'
 *
 *     ApiErrorResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: string
 *           example: "400"
 *         message:
 *           type: string
 *           example: Error message
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

export async function POST(request) {
  try {
    const userData = await request.json();
    const response = await addUserService(userData);

    if (response.statusCode !== "201") {
      return NextResponse.json(
        { statusCode: response.statusCode, message: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        statusCode: "201",
        message: "User created successfully",
        data: response.data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { statusCode: "500", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const skip = url.searchParams.get('skip');
        const take = url.searchParams.get('take');
        const usersResponse = await getUsersService(skip ? parseInt(skip) : 0, take ? parseInt(take) : 10);
        return NextResponse.json({ statusCode: "200", message: "Users fetched successfully", data: usersResponse.data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ statusCode: "500", message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('id');
        const userData = await request.json();
        const response = await updateUserService(userId, userData);
        if (response.statusCode !== "200") {
            return NextResponse.json({ statusCode: response.statusCode.toString(), message: response.message }, { status: 400 });
        }
        return NextResponse.json({ statusCode: "200", message: "User updated successfully", data: response.data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ statusCode: "500", message: error.message }, { status: 500 });
    }
}
