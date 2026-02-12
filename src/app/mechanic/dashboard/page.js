'use client';

import { useState, useRef, useEffect } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

export default function DashboardPage() {

    const [uploaded, setUploaded] = useState(false);
    const [documentUrl, setDocumentUrl] = useState('');
    const [documentFileName, setDocumentFileName] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const toast = useRef(null);

    // Fetch profile and check upload status
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await fetch('/api/v1/mechanic/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await res.json();

                if (res.ok && result.data) {
                    const mechanic = result.data;
                    if (mechanic.documentUrl) {
                        setUploaded(true);
                        setDocumentUrl(mechanic.documentUrl);
                        setDocumentFileName(mechanic.documentFileName || '');

                        // Sync with localStorage just in case other parts use it
                        localStorage.setItem('docUploaded', 'true');
                        localStorage.setItem('docUrl', mechanic.documentUrl);
                        localStorage.setItem('docFileName', mechanic.documentFileName || '');
                    } else {
                        setUploaded(false);
                    }
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        fetchProfile();
    }, []);

    // Custom upload handler
    const uploadHandler = async (e) => {
        const file = e.files[0];

        try {
            // Get token for authentication
            const token = localStorage.getItem('token');

            // Create FormData
            const formData = new FormData();
            formData.append('file', file);

            // POST to Proxy Upload API
            const res = await fetch('/api/v1/mechanic/upload', {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: formData
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                const errMsg = data?.details || data?.error || data?.message || `Server returned ${res.status}`;
                throw new Error(errMsg);
            }

            // 3. Save status
            localStorage.setItem('docUploaded', 'true');
            localStorage.setItem('docUrl', data.url);
            localStorage.setItem('docFileName', data.fileName);
            setUploaded(true);
            setDocumentUrl(data.url);
            setDocumentFileName(data.fileName);

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Document uploaded successfully',
                life: 3000
            });

        } catch (err) {
            console.error('Upload error:', err);
            toast.current.show({
                severity: 'error',
                summary: 'Upload Failed',
                detail: err.message || 'Upload failed. Check console for details.',
                life: 5000
            });
        }
    };

    // Fetch signed preview URL
    const handleViewDocument = async () => {
        if (!documentFileName) {
            setShowDialog(true);
            return;
        }

        setPreviewLoading(true);
        setShowDialog(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/v1/mechanic/document-preview?fileName=${documentFileName}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setDocumentUrl(data.url);
            }
        } catch (err) {
            console.error('Preview error:', err);
        } finally {
            setPreviewLoading(false);
        }
    };

    return (
        <div className="p-8">

            <Toast ref={toast} />

            <h1 className="text-3xl font-bold mb-4">
                Mechanic Dashboard
            </h1>

            {/* If NOT uploaded → Show Upload */}
            {!uploaded && (
                <div className="mb-6 border p-4 rounded shadow">

                    <h2 className="text-xl mb-3 font-semibold">
                        Upload Your Document
                    </h2>

                    <FileUpload
                        mode="basic"
                        name="file"
                        accept="image/*,application/pdf"
                        maxFileSize={5000000}
                        customUpload
                        uploadHandler={uploadHandler}
                        chooseLabel="Upload Document"
                    />

                    <p className="text-sm mt-2 text-gray-500">
                        Please upload your ID/Certificate to access dashboard.
                    </p>

                </div>
            )}

            {/* If uploaded → Show Dashboard */}
            {uploaded && (
                <div className="mt-6">

                    <h2 className="text-2xl font-bold mb-3">
                        Welcome to Dashboard
                    </h2>

                    <p>
                        Here you can manage your jobs, profile, and reports.
                    </p>

                    {/* Your actual dashboard content here */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="p-4 bg-white shadow rounded">
                            Jobs: 12
                        </div>

                        <div className="p-4 bg-white shadow rounded">
                            Earnings: ₹15,000
                        </div>

                        <div className="p-4 bg-white shadow rounded">
                            Rating: ⭐ 4.8
                        </div>

                    </div>

                    <div className="mt-8 border-t pt-6">
                        <Button
                            label="View Uploaded Document"
                            icon="pi pi-file"
                            className="p-button-info"
                            onClick={handleViewDocument}
                        />
                    </div>

                    <Dialog
                        header="Uploaded Document"
                        visible={showDialog}
                        style={{ width: '50vw' }}
                        onHide={() => setShowDialog(false)}
                    >
                        <div className="flex flex-column align-items-center gap-4">
                            {previewLoading ? (
                                <div className="p-5 text-center">
                                    <i className="pi pi-spin pi-spinner text-4xl mb-2" />
                                    <p>Loading secure preview...</p>
                                </div>
                            ) : documentUrl ? (
                                <>
                                    <div className="border p-2 border-round surface-100 w-full overflow-hidden text-center">
                                        {/* Show image if likely an image - more robust check for signed URLs */}
                                        {(documentUrl.split('?')[0].match(/\.(jpg|jpeg|png|gif|webp)$/i) || documentUrl.includes('image')) ? (
                                            <img
                                                src={documentUrl}
                                                alt="Document"
                                                className="max-w-full h-auto border-round shadow-2"
                                                onError={(e) => {
                                                    console.log("Image load failed, might be private or invalid type:", documentUrl);
                                                }}
                                            />
                                        ) : (
                                            <div className="p-5">
                                                <i className="pi pi-file-pdf text-6xl text-red-500 mb-3" />
                                                <p>Document preview not available for this file type.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-full">
                                        <p className="font-bold mb-2 text-black">Document URL:</p>
                                        <div className="p-3 bg-gray-100 border-round font-mono text-sm break-all text-blue-600">
                                            <a href={documentUrl} target="_blank" rel="noopener noreferrer">
                                                {documentUrl}
                                            </a>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p>No document URL found.</p>
                            )}
                        </div>
                    </Dialog>
                </div>
            )}

        </div>
    );
}
