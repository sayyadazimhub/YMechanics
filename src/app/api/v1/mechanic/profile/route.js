import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
    try {
        const mechanicId = req.headers.get('x-user-id');

        if (!mechanicId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const mechanic = await prisma.mechanic.findUnique({
            where: { id: mechanicId },
            include: {
                state: true,
                city: true
            }
        });

        if (!mechanic) {
            return NextResponse.json(
                { error: 'Mechanic not found' },
                { status: 404 }
            );
        }

        const { password, otp, ...safeData } = mechanic;

        return NextResponse.json({ data: safeData });
    } catch (err) {
        console.error('[Profile API] Error:', err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
