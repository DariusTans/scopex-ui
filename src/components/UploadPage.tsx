import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadPage.css';

interface UploadStatus {
  isUploading: boolean;
  progress: number;
  isComplete: boolean;
}

const UploadPage: React.FC = () => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    progress: 0,
    isComplete: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  };

  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...files]);
      console.log('Files uploaded:', files);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
      console.log('Files uploaded:', files);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
    setUploadStatus({ isUploading: false, progress: 0, isComplete: false });
  };

  const uploadFiles = async () => {
    setUploadStatus({ isUploading: true, progress: 0, isComplete: false });
    
    try {
      const formData = new FormData();
      uploadedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const totalDuration = 60000;
      const updateInterval = 100;
      const progressIncrement = 100 / (totalDuration / updateInterval);
      let currentProgress = 0;

      const progressInterval = setInterval(() => {
        currentProgress += progressIncrement;
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          currentProgress = 100;
        }
        setUploadStatus(prev => ({ ...prev, progress: Math.round(currentProgress) }));
      }, updateInterval);

      const response = await fetch('https://g.allyx.tech/webhook-test/80dea11b-7576-4332-b40c-08d8cb33c216', {
        method: 'GET',
      });

      await new Promise(resolve => setTimeout(resolve, totalDuration));

      if (response.ok) {
        setUploadStatus({ isUploading: false, progress: 100, isComplete: true });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ isUploading: false, progress: 0, isComplete: false });
    }
  };

  const handleUploadSubmit = () => {
    if (uploadedFiles.length > 0) {
      uploadFiles();
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <header className="upload-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h1>Upload Files</h1>
          <p>Upload your files to get started with ScopeX</p>
        </header>

        <div 
          className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
          onDrag={handleDrag}
          onDragStart={handleDrag}
          onDragEnd={handleDrag}
          onDragOver={handleDrag}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <div className="upload-icon">📁</div>
            <h3 className="upload-title">
              {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
            </h3>
            <p className="upload-subtext">or</p>
            <button className="browse-button" onClick={handleBrowseClick}>
              Browse Files
            </button>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="uploaded-files">
            <div className="files-header">
              <h3>Uploaded Files ({uploadedFiles.length})</h3>
              <button className="clear-all-button" onClick={clearAllFiles}>
                Clear All
              </button>
            </div>
            <div className="files-list">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <button 
                    className="remove-file-button"
                    onClick={() => removeFile(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {!uploadStatus.isUploading && !uploadStatus.isComplete && (
              <button className="upload-submit-button" onClick={handleUploadSubmit}>
                Upload Files
              </button>
            )}
            
            {uploadStatus.isUploading && (
              <div className="upload-progress">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${uploadStatus.progress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  Uploading... {uploadStatus.progress}%
                </div>
              </div>
            )}
            
            {uploadStatus.isComplete && (
              <div className="upload-complete">
                <div className="complete-icon">✓</div>
                <div className="complete-text">Finish</div>
                <div className="excel-file-link" onClick={() => window.open('https://docs.google.com/spreadsheets/d/1pfbx3hRCwpLFMTnW7NmgNRH4GyQ0dsLmmi15MVdrtVE/edit?usp=sharing', '_blank')}>
                  <div className="excel-icon">📊</div>
                  <div className="excel-text">scopeX Data.xlsx</div>
                </div>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default UploadPage;