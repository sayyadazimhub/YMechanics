import { NextResponse } from 'next/server';
import { uploadImageToS3 } from '@/lib/io';
import prisma from '@/lib/prisma';

export async function POST(req) {
    try {
        const mechanicId = req.headers.get('x-user-id');

        if (!mechanicId) {
            return NextResponse.json(
                { error: 'Unauthorized: Missing User ID' },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        console.log(`[Proxy Upload] User ID: ${mechanicId}, Received file: ${file.name}`);

        // We can optionally use file.name or generate a unique one
        const folderPath = 'mechanics/documents';
        const fileName = `${folderPath}/${file.name.replace(/\s+/g, '-')}`;

        const result = await uploadImageToS3(fileName, file);

        if (result.success) {
            // Construct base URL: either bucket.region.digitaloceanspaces.com or region.digitaloceanspaces.com
            const bucketName = process.env.AWS_S3_BUCKET_NAME || 'sdhub';
            const region = process.env.AWS_S3_REGION || 'blr1';
            const baseUrl = process.env.AWS_S3_BUCKET_URL || `https://${bucketName}.${region}.digitaloceanspaces.com`;

            // If the URL already contains the bucket name, don't append it again
            const finalUrl = baseUrl.includes(bucketName)
                ? `${baseUrl.replace(/\/$/, '')}/${fileName}`
                : `${baseUrl.replace(/\/$/, '')}/${bucketName}/${fileName}`;

            // Update Mechanic in DB
            await prisma.mechanic.update({
                where: { id: mechanicId },
                data: {
                    documentUrl: finalUrl,
                    documentFileName: fileName
                }
            });

            console.log(`[Proxy Upload] Successfully updated DB and uploaded ${fileName} to Spaces`);

            return NextResponse.json({
                success: true,
                fileName,
                url: finalUrl
            });
        } else {
            console.error(`[Proxy Upload] Failed to upload to Spaces:`, result.error);
            return NextResponse.json(
                { error: 'Failed to upload to storage', details: result.error },
                { status: 500 }
            );
        }
    } catch (err) {
        console.error('[Proxy Upload] Server error:', err);
        return NextResponse.json(
            { error: 'Internal Server Error', details: err.message },
            { status: 500 }
        );
    }
}
