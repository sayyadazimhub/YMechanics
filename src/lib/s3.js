import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Initialize S3Client with environment variables
 */
function getS3Client() {
    const accessKeyId = process.env.AWS_S3_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_S3_SECRET_KEY;
    const region = process.env.AWS_S3_REGION;
    const bucketUrl = process.env.AWS_S3_BUCKET_URL;

    if (!accessKeyId || !secretAccessKey || !region || !bucketUrl) {
        throw new Error('Missing required S3/DigitalOcean Spaces environment variables');
    }

    return new S3Client({
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
        region,
        endpoint: bucketUrl,
        forcePathStyle: true,
    });
}

/**
 * Generate a signed URL for uploading a file to S3/DigitalOcean Spaces
 * @param {string} fileName - The name of the file to upload
 * @returns {Promise<string>} - The signed URL for PUT request
 */
export async function getSignedUrlPutFunction(fileName) {
    try {
        const s3Client = getS3Client();
        const bucketName = process.env.AWS_S3_BUCKET_NAME;

        if (!bucketName) {
            throw new Error('AWS_S3_BUCKET_NAME environment variable is not set');
        }

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            ContentType: 'application/octet-stream',
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return url;
    } catch (error) {
        console.error('Error generating signed URL:', error.message);
        throw error;
    }
}
