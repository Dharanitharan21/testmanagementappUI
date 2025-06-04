import React, { useState, useEffect } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  Grid
} from '@mui/material';
import { Plus, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import '../Styles/CreateQuestion.css';
import axiosInstance from '../Components/axiosintense';

const CreateQuestion = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch tests from backend on component mount
useEffect(() => {
  const fetchTests = async () => {
    try {
      const res = await axiosInstance.get('/tests');
      setTests(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error loading tests');
    }
  };
  fetchTests();
}, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (options.some((o) => !o.trim())) throw new Error('All options must be filled');
    if (!correctAnswer) throw new Error('Please select the correct answer');
    if (!questionText.trim()) throw new Error('Question text cannot be empty');
    if (!selectedTest) throw new Error('Please select a test');

    const body = { questionText, options, correctAnswer };

    await axiosInstance.post(`/test/${selectedTest}/question`, body);

    toast.success('The question has been added to the selected test.');
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
    setSelectedTest('');
  } catch (err) {
    toast.error(err.response?.data?.message || err.message || 'Failed to add question.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="create-question-wrapper">
      <Card className="create-question-card">
        <CardHeader
          title={
            <div className="create-question-title">
              <Plus className="icon-plus" />
              <Typography variant="h6">Add New Question</Typography>
            </div>
          }
          subheader={
            <Typography variant="body2" className="create-question-subtitle">
              Add a multiple-choice question to an existing test. Select the test and provide the question with four options.
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit} className="create-question-form">
            <FormControl fullWidth>
              <InputLabel>Select Test *</InputLabel>
              <Select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                label="Select Test *"
                required
              >
                {tests.map((test) => (
                  <MenuItem key={test._id || test.id} value={test._id || test.id}>
                    {test.title || test.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Question Text *"
              placeholder="Enter your question here..."
              multiline
              rows={3}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              margin="normal"
            />

            <div className="options-group">
              <FormLabel>Answer Options *</FormLabel>
              <Grid container spacing={2}>
                {options.map((option, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <TextField
                      label={`Option ${String.fromCharCode(65 + idx)}`}
                      placeholder={`Enter option ${String.fromCharCode(65 + idx)}`}
                      value={option}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                ))}
              </Grid>
            </div>

            <div className="correct-answer-group" style={{ marginTop: 16 }}>
              <FormLabel>Correct Answer *</FormLabel>
              <RadioGroup
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
              >
                <Grid container spacing={2}>
                  {options.map((option, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <FormControlLabel
                        value={option}
                        control={<Radio disabled={!option.trim()} />}
                        label={
                          <span className={!option.trim() ? 'text-disabled' : ''}>
                            <strong>{String.fromCharCode(65 + idx)}.</strong> {option || 'Enter option above'}
                          </span>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </div>

            <div className="form-actions" style={{ marginTop: 24 }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                disabled={
                  loading ||
                  !selectedTest ||
                  !questionText.trim() ||
                  options.some((o) => !o.trim()) ||
                  !correctAnswer
                }
              >
                {loading ? (
                  <span className="loading-spinner" />
                ) : (
                  <HelpCircle className="submit-icon" />
                )}
                {loading ? 'Adding...' : 'Add Question'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                disabled={loading}
                onClick={() => {
                  setQuestionText('');
                  setOptions(['', '', '', '']);
                  setCorrectAnswer('');
                  setSelectedTest('');
                }}
                style={{ marginTop: 8 }}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateQuestion;
