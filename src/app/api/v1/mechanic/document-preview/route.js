import { NextResponse } from 'next/server';
import { getSignedUrlGetFunction } from '@/lib/io';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const fileName = searchParams.get('fileName');

        if (!fileName) {
            return NextResponse.json(
                { error: 'fileName is required' },
                { status: 400 }
            );
        }

        console.log(`[Preview API] Request for file: ${fileName}`);

        const url = await getSignedUrlGetFunction(fileName);

        return NextResponse.json({ url });
    } catch (err) {
        console.error('[Preview API] Server error:', err);
        return NextResponse.json(
            { error: 'Internal Server Error', details: err.message },
            { status: 500 }
        );
    }
}
