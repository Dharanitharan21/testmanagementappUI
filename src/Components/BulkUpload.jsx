import { useState, useEffect, useRef } from 'react';
import '../Styles/BulkUpload.css';
import { Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { Button, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import axiosInstance from '../Components/axiosintense';
import { toast } from 'sonner';
const BulkUpload = () => {
  const [selectedTest, setSelectedTest] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState({ success: 0, errors: [] });
  const fileInputRef = useRef(null);

  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axiosInstance.get('/tests');
        setTests(response.data);  // assuming response.data is an array of tests

      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load tests');
      }
    };
    fetchTests();
  }, []);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setUploadResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedTest) {
      toast.error('Please select both a test and a CSV file');
      return;
    }

    setIsUploading(true);
    setUploadResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post(`/test/${selectedTest}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming your backend returns success count and errors array in response.data
      setUploadResults(response.data);

      toast.success(`Upload completed `);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      console.log(error);
      
    } finally {
      setIsUploading(false);
    }
  };


  const downloadTemplate = () => {
    const csvContent = `questionText,option1,option2,option3,option4,correctAnswer\n"What is 2+2?","1","2","3","4","4"\n"Capital of Germany?","Berlin","Paris","Madrid","Rome","Berlin"\n"Which is a programming language?","HTML","CSS","JavaScript","XML","JavaScript"`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bulk-upload-container">
      <div className="card">
        <div className="card-header">
          <h2>Bulk Upload Questions</h2>
          <p>Upload multiple questions at once using a CSV file</p>
        </div>
        <div className="card-content">
          <div className="form-group">
            <InputLabel id="test-select-label">Select Test *</InputLabel>
            <Select
              labelId="test-select-label"
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>
                -- Select a Test --
              </MenuItem>
              {tests.map((test) => (
                <MenuItem key={test._id} value={test._id}>
                  {test.title}
                </MenuItem>
              ))}
            </Select>

          </div>

          <div className="form-group">
            <InputLabel>CSV File *</InputLabel>
            <div className="file-drop" onClick={() => fileInputRef.current.click()}>
              <Upload size={32} />
              {file ? (
                <div className="file-info">
                  <p>{file.name}</p>
                  <span>{(file.size / 1024).toFixed(1)} KB • Click to change</span>
                </div>
              ) : (
                <div>
                  <p>Click to upload CSV file</p>
                  <span>or drag and drop your file here</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden-input" />
          </div>

          <div className="action-buttons">
            <Button variant="contained" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Questions'}
            </Button>
            <Button variant="outlined" onClick={downloadTemplate} startIcon={<Download size={16} />}>
              Download Template
            </Button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3><FileText size={20} /> CSV Format Instructions</h3>
        </div>
        <div className="card-content">
          <p>Your CSV file should contain the following columns in this exact order:</p>
          <code className="code-block">questionText,option1,option2,option3,option4,correctAnswer</code>
          <ul>
            <li><strong>questionText:</strong> The question text (wrap in quotes if contains commas)</li>
            <li><strong>option1-4:</strong> The four answer options</li>
            <li><strong>correctAnswer:</strong> The correct option text (must match one of the options exactly)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;