import { getSignedUrlPutFunction } from '../src/lib/io.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { URL } from 'url';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testSignedUrl() {
    const fileName = `test-upload-${Date.now()}.txt`;
    console.log(`Testing signed URL generation for file: ${fileName}`);

    try {
        const url = await getSignedUrlPutFunction(fileName);
        console.log('Successfully generated signed URL:');
        console.log(url);

        // Try uploading a dummy file
        console.log('Attempting to upload a dummy file...');
        const parsedUrl = new URL(url);
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': Buffer.byteLength('Hello DigitalOcean Spaces!'),
            },
        };

        const req = https.request(url, options, (res) => {
            console.log(`Upload response status: ${res.statusCode}`);
            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });

        req.on('error', (e) => {
            console.error('Upload failed:', e);
        });

        req.write('Hello DigitalOcean Spaces!');
        req.end();

    } catch (error) {
        console.error('Failed to generate or use signed URL:', error);
    }
}

testSignedUrl();
