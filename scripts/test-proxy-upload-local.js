import { uploadImageToS3 } from '../src/lib/io.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testProxyUpload() {
    const fileName = `test-proxy-${Date.now()}.txt`;
    console.log(`Testing Proxy Upload for file: ${fileName}`);

    // Mock a file object
    const mockFile = {
        name: fileName,
        type: 'text/plain',
        arrayBuffer: async () => Buffer.from('Hello from Proxy Upload Test!')
    };

    try {
        const result = await uploadImageToS3(fileName, mockFile);
        console.log('Result:', result);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testProxyUpload();
