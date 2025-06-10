import React, { useState } from 'react';

const FileUploader = ({ onChange, onUpload }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
    onChange(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('http://localhost:3010/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Error al subir archivo');
        }

        const fileData = await res.json();
        setFileData(fileData);
        onUpload(fileData);
      } catch (error) {
        console.error('Error al subir archivo:', error);
      } finally {
        setLoading(false); // Asegura que loading se establezca a false después de la operación
      }
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <input
          type="file"
          onChange={handleFileChange}
          aria-label="File"
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
        <button
          onClick={handleFileUpload}
          className="inline-flex items-center px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {loading ? 'Subiendo...' : 'Subir Archivo'}
        </button>
      </div>
      <p className="mb-0 text-sm text-gray-600">Selected file: {fileName}</p>
      {fileData && (
        <p className="mt-2 text-sm text-green-700">
          Archivo subido con éxito
        </p>
      )}
    </div>
  );
};

export default FileUploader;
