import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Chip,
  Collapse,
  Box
} from '@mui/material';
import {
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  FileText
} from 'lucide-react';
import '../Styles/TestList.css';
import axiosInstance from '../Components/axiosintense';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [expandedTests, setExpandedTests] = useState([]);

  const fetchTests = async () => {
    try {
      const res = await axiosInstance.get('/tests');
      const enrichedTests = await Promise.all(
        res.data.map(async (test) => {
          try {
            const qRes = await axiosInstance.get(`/test/${test._id}/questions`);
            return { ...test, questions: qRes.data || [] };
          } catch (e) {
            console.error(`Failed to fetch questions for test ${test._id}`, e);
            return { ...test, questions: [] };
          }
        })
      );
      setTests(enrichedTests);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const toggleTest = (testId) => {
    setExpandedTests(prev =>
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const deleteTest = async (id) => {
    try {
      await axiosInstance.delete(`/tests/${id}`);
      fetchTests();
    } catch (error) {
      console.error('Failed to delete test:', error);
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      await axiosInstance.delete(`/questions/delete/${questionId}`);
      fetchTests();
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  return (
    <div className="test-list-container">
      <Card className="card">
        <CardHeader
          title={
            <div className="card-title">
              <FileText size={20} className="icon-green" />
              <Typography variant="h6" className="title-text">
                All Tests
              </Typography>
            </div>
          }
          subheader={
            <Typography variant="body2" className="subheader">
              View and manage all your tests. Click on a test to expand and see its questions.
            </Typography>
          }
        />
      </Card>

      {tests.map((test) => (
        <Card key={test._id} className="card">
          <div
            className="card-header clickable"
            onClick={() => toggleTest(test._id)}
            role="button"
            aria-expanded={expandedTests.includes(test._id)}
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleTest(test._id)}
          >
            <div className="header-left">
              {expandedTests.includes(test._id) ? (
                <ChevronDown size={20} className="icon-gray" />
              ) : (
                <ChevronRight size={20} className="icon-gray" />
              )}
              <div className="header-text">
                <Typography variant="subtitle1" className="truncate">{test.title}</Typography>
                <Typography variant="body2" className="text-muted truncate">{test.description}</Typography>
              </div>
            </div>

            <div className="header-actions">
              <Chip
                label={`${Array.isArray(test.questions) ? test.questions.length : 0} Q`}
                variant="outlined"
                className="chip-emerald"
              />
              <Typography variant="caption" className="text-muted hide-on-mobile">{test.createdAt}</Typography>
              <IconButton size="small" className="icon-btn delete" onClick={() => deleteTest(test._id)}><Trash2 size={16} /></IconButton>
            </div>
          </div>

          <Collapse in={expandedTests.includes(test._id)}>
            <CardContent>
              <Typography variant="subtitle2" className="section-title">Questions:</Typography>
              <Box className="question-list">
                {Array.isArray(test.questions) && test.questions.map((question, index) => (
                  <Box key={question._id} className="question-box">
                    <div className="question-header">
                      <Typography variant="body1" className="question-text">
                        {index + 1}. {question.questionText}
                      </Typography>
                      <div>
                        <IconButton
                          size="small"
                          className="icon-btn delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteQuestion(question._id);
                          }}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </div>
                    </div>
                    <div className="options-grid">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`option ${option === question.correctAnswer ? 'correct' : ''}`}
                        >
                          <strong>{String.fromCharCode(65 + optIndex)}.</strong> {option}
                        </div>
                      ))}
                    </div>
                    <Typography variant="caption" className="correct-answer">
                      Correct Answer: <strong>{question.correctAnswer}</strong>
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Collapse>
        </Card>
      ))}
    </div>
  );
};

export default TestList;
