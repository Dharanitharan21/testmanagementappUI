import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button
} from '@mui/material';
import { toast } from 'sonner';
import '../Styles/CreateTest.css';
import axiosInstance from '../Components/axiosintense';

const CreateTest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axiosInstance.post('/test', {
        title,
        description
      });

      toast.success(`Test "${res.data.title}" created successfully`);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating test:', error);
      toast.error('Failed to create test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="create-test-card">
      <CardHeader
        className="create-test-header"
        title={
          <>
            <Typography variant="h6" className="create-test-title">
              Create New Test
            </Typography>
            <Typography variant="body2" className="create-test-subtitle">
              Add a new test to your test management system
            </Typography>
          </>
        }
      />

      <CardContent className="create-test-content">
        <form onSubmit={handleSubmit} className="create-test-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Test Title *</label>
            <TextField
              id="title"
              fullWidth
              required
              variant="outlined"
              size="small"
              placeholder="Enter test title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description (Optional)</label>
            <TextField
              id="description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              size="small"
              placeholder="Enter test description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="form-actions">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? 'Creating...' : 'Create Test'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => {
                setTitle('');
                setDescription('');
              }}
              className="reset-btn"
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTest;
