import { NextResponse } from 'next/server';
import { getSignedUrlPutFunction } from '@/lib/io';

export async function POST(req) {
    const { fileName, contentType } = await req.json();

    if (!fileName) {
        return NextResponse.json(
            { error: 'fileName is required' },
            { status: 400 }
        );
    }

    try {
        console.log(`[Upload API] Request for file: ${fileName}, ContentType: ${contentType}`);
        const url = await getSignedUrlPutFunction(fileName, contentType);
        console.log(`[Upload API] URL generated successfully`);
        return NextResponse.json({ url });
    } catch (err) {
        console.error('[Upload API] Error:', err);
        return NextResponse.json(
            {
                error: 'Failed to generate URL',
                details: err.message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            },
            { status: 500 }
        );
    }
}
