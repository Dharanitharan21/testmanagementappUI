
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { Lock, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';
import '../Styles/LoginForm.css';
import axios from 'axios';

function LoginForm() {
    const nav = useNavigate(); 
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const res = await axios.post("https://testmanagementapp.onrender.com/api/login", values); // ✅ Make sure backend URL is correct
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      nav('/dashboard'); // Redirect to dashboard or homepage
    } catch (error) {
      console.error("Login error:", error);
      setStatus("Failed to login. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <Shield size={32} color="#fff" />
          </div>
          <h2 className="login-title">Admin Login</h2>
          <p className="login-description">Access the Test Management Dashboard</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-icon">
                  <Mail size={16} />
                  <Field
                    type="email"
                    name="email"
                    placeholder="admin@test.com"
                    className="form-input"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="form-error" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-icon">
                  <Lock size={16} />
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="form-input"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="form-error" />
              </div>

              {status && <div className="form-status-error">{status}</div>}

              <button
                type="submit"
                className="form-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;