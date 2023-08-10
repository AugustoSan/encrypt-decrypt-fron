// UploadView.tsx

import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { Button } from '@mui/material';

import axiosInstance from '../../services/api/axios';
import useImageHash from '../../hooks/useImageHash';

const UploadView = () => {

  const { hash, generateHashAndSign } = useImageHash();
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Almacenar el archivo seleccionado en el estado
      await generateHashAndSign(file);
    }
  };

  useEffect(() => {
    const uploadFile = async () => {
      if (hash && selectedFile) {
        try {
          const response: AxiosResponse = await axiosInstance.post('/', {
            hash,
            image: selectedFile
          }, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
          // let formData = new FormData();
          // formData.append('hash', hash);
          // formData.append('image', selectedFile, selectedFile.name);
          // const response: AxiosResponse = await axiosInstance.post('/', formData, {
          //   headers: {
          //     'Content-Type': 'multipart/form-data'
          //   }
          // });
          setUploadResult(response.data);
          
        } catch (error) {
          console.error('Failed to upload the image', error);
        }
      }
    };

    uploadFile();
  }, [hash, selectedFile]);  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <input
        accept="image/png, image/jpeg"
        style={{ display: 'none' }}
        id="upload-button"
        type="file"
        onChange={handleUpload}
      />
      <label htmlFor="upload-button" style={{ width: '100%', maxWidth: '300px' }}>
        <Button variant="contained" color="primary" component="span" style={{ width: '100%' }}>
          Upload
        </Button>
      </label>
      {hash && <div>Image Hash: {hash}</div>}
      {uploadResult && <div>Upload Result: {uploadResult}</div>}
    </div>
  );
};

export default UploadView;
