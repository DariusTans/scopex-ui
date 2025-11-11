import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import './UploadModal.css';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (files: File[]) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onFileUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onFileUpload(files);
      onClose();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFileUpload(files);
      onClose();
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Upload Files</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
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
            <p className="upload-text">
              {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="upload-subtext">or</p>
            <button className="browse-button" onClick={handleBrowseClick}>
              Browse Files
            </button>
          </div>
        </div>

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

export default UploadModal;