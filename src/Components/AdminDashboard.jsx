import { useState, useEffect } from 'react';
import {
  FileText, Users, BarChart3, Plus, Upload, LogOut, Menu, X,
} from 'lucide-react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import '../Styles/AdminDashboard.css';
import TestList from './TestList';
import CreateTest from './CreateTest';
import CreateQuestion from './CreateQuestion';
import BulkUpload from './BulkUpload';
import axiosInstance from '../Components/axiosintense';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const nav =useNavigate()
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(null);

  // Fetch list of tests on mount
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axiosInstance.get('/tests');
        setTests(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };
  // Fetch questions for selected test
  const fetchQuestionsForTest = async () => {
    try {
      const qRes = await axiosInstance.get(`/questions`);
      setQuestions(qRes.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
    fetchQuestionsForTest()
    fetchTests();

  }, []);


  const stats = [
    { title: 'Total Tests', value: tests.length.toString(), icon: FileText, color: 'blue' },
    { title: 'Total Questions', value: questions.length.toString(), icon: BarChart3, color: 'green' },
  ];

  const navItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'tests', label: 'Tests' },
    { key: 'create', label: 'Create Test' },
    { key: 'questions', label: 'Add Questions' },
    { key: 'upload', label: 'Bulk Upload' },
  ];
 const handleLogout = (e) => {
   e.stopPropagation(); 
    localStorage.clear();
    nav('/');

  };

  const renderContent = () => {
    switch (activeTab) {
      case 'tests':
        return <TestList />;
      case 'create':
        return <CreateTest />;
      case 'questions':
        return <CreateQuestion testId={selectedTestId} />
      case 'upload':
        return <BulkUpload />;
      default:
        return (
          <div className="overview-content">
            <div className="stats-grid">
              {stats.map((stat, idx) => (
                <Card key={idx} className="stat-card">
                  <CardContent className="stat-card-content">
                    <div className="stat-details">
                      <div className="stat-text">
                        <p className="stat-title">{stat.title}</p>
                        <p className="stat-value">{stat.value}</p>
                      </div>
                      <div className={`stat-icon ${stat.color}`}>
                        <stat.icon size={24} color="#fff" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="quick-actions-card">
              <CardHeader title="Quick Actions" />
              <CardContent>
                <div className="quick-actions-grid">
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab('create')}
                    className="quick-action-button create"
                  >
                    <Plus size={20} />
                    <span>Create Test</span>
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveTab('tests')}
                    className="quick-action-button"
                  >
                    <FileText size={20} />
                    <span>View Tests</span>
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveTab('upload')}
                    className="quick-action-button"
                  >
                    <Upload size={20} />
                    <span>Upload CSV</span>
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveTab('questions')}
                    className="quick-action-button"
                  >
                    <BarChart3 size={20} />
                    <span>Add Questions</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-icon">
            <FileText size={18} color="#fff" />
          </div>
          <h1 className="app-title">Test Management</h1>
        </div>
        <div className="header-right">
          <Button variant="outlined" size="small" onClick={handleLogout} className="logout-btn">
            <LogOut size={16} />
            <span className="logout-text" >Logout</span>
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="menu-toggle"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-nav">
          {navItems.map((tab) => (
            <button
              key={tab.key}
              className={`nav-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.key);
                setIsMobileMenuOpen(false);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <nav className="desktop-nav">
        {navItems.map((tab) => (
          <button
            key={tab.key}
            className={`nav-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
