import React, { useState } from 'react';
import { toast } from 'react-toastify';

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [fileUri, setFileUri] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const selectedFileUris = selectedFiles.map(file => URL.createObjectURL(file));
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        setFileUri(prevFileUri => [...prevFileUri, ...selectedFileUris]);
    };

    const handleUpload = async () => {
        const uploadedUrls = [];

        for (let file of files) {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
            data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, {
                    method: "post",
                    body: data
                });

                if (res.status !== 200) {
                    console.error("Unable to upload image");
                    const error = await res.text();
                    console.error(error);
                    return;
                }

                const imgLink = await res.json();
                uploadedUrls.push(imgLink.secure_url);
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Error uploading image");
                return;
            }
        }

        setUploadedUrls(uploadedUrls);
        toast.success("Files uploaded successfully");
    };

    return (
        <div className="flex flex-col items-center p-4">
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="mb-4"
            />
            <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            >
                Upload Files
            </button>
            {files.length > 0 && (
                <div className="mt-4 w-full max-w-md">
                    <h2 className="text-lg font-semibold mb-2">Selected Files:</h2>
                    <ul className="list-disc pl-5">
                        {fileUri.map((img, index) => (
                            <li key={index} className="text-sm">
                                <img
                                    src={img}
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded mb-4 ml-4"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {uploadedUrls.length > 0 && (
                <div className="mt-4 w-full max-w-md">
                    <h2 className="text-lg font-semibold mb-2">Uploaded Files:</h2>
                    <ul className="list-disc pl-5">
                        {uploadedUrls.map((url, index) => (
                            <li key={index} className="text-sm break-all">
                                {index+1} {url}
                                <img src={url} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FileUpload;