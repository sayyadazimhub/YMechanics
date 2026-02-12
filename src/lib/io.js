import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function createS3Client() {
    const region = process.env.AWS_S3_REGION || 'blr1';
    // For DigitalOcean Spaces, the endpoint should be the regional one: https://region.digitaloceanspaces.com
    // The bucket name will be prepended by the SDK as long as forcePathStyle is false.
    const endpoint = `https://${region}.digitaloceanspaces.com`;

    return new S3Client({
        region,
        credentials: {
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        },
        endpoint,
        forcePathStyle: false, // Standard for Spaces
    });
}

export async function getSignedUrlPutFunction(fileName, contentType = 'application/octet-stream') {
    console.log("Generating signed URL for", fileName, "with Content-Type:", contentType);

    try {
        const s3 = createS3Client();
        const bucketName = process.env.AWS_S3_BUCKET_NAME || 'sdhub';

        const params = {
            Bucket: bucketName,
            Key: fileName,
            ContentType: contentType
        };

        console.log("S3 Client initialized, generating signed URL...");
        console.log("Params:", params);

        const command = new PutObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes
        return url;
    } catch (error) {
        console.error("Error generating signed URL:", error);
        throw new Error(`Could not generate signed URL: ${error.message}`);
    }
}

export async function uploadImageToS3(fileName, file) {
    try {
        const s3 = createS3Client();
        const bucketName = process.env.AWS_S3_BUCKET_NAME || 'sdhub';

        console.log(`[S3 Upload] Sending to Bucket: ${bucketName}, Key: ${fileName}`);

        const params = {
            Bucket: bucketName,
            Key: fileName, // Unique key for the object
            Body: Buffer.from(await file.arrayBuffer()), // Convert File to Buffer for Node.js
            ContentType: file.type,
        };

        const command = new PutObjectCommand(params);

        const response = await s3.send(command);
        console.log("Image uploaded successfully!", response);
        return { success: true };
    } catch (error) {
        console.error("Error uploading image to S3:", error);
        return { success: false, error: error.message || "Failed to upload image" };
    }
}

export async function getSignedUrlGetFunction(fileName) {
    console.log("Generating signed GET URL for", fileName);
    try {
        const s3 = createS3Client();
        const bucketName = process.env.AWS_S3_BUCKET_NAME || 'sdhub';

        const params = {
            Bucket: bucketName,
            Key: fileName
        };

        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes
        return url;
    } catch (error) {
        console.error("Error generating signed URL:", error);
        throw new Error("Could not generate signed URL");
    }
}