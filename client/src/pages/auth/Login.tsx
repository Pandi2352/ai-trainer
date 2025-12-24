import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Form, Input, Alert } from 'antd';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    setError('');
    try {
      await login({ email: values.email, password: values.password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* Left Side - Visual & Branding (Hidden on mobile) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-900"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2727&auto=format&fit=crop")',
          }}
        >
             <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-teal-900/80 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
             <div>
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-2xl mb-8">
                    O
                </div>
                <h1 className="text-5xl font-bold leading-tight mb-6">
                    Master Your <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Interviews</span>
                </h1>
                <p className="text-primary-100 text-lg max-w-md leading-relaxed">
                    Join thousands of candidates using OmniTrain AI to practice with real-time feedback and curated questions.
                </p>
             </div>
             
             <div className="space-y-4">
                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                        <ArrowRight size={20} />
                    </div>
                    <div>
                        <p className="font-medium">AI-Powered Analysis</p>
                        <p className="text-xs text-primary-200">Instant feedback on your answers</p>
                    </div>
                 </div>
             </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md space-y-8"
        >
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
            </div>

            {error && (
                <Alert message={error} type="error" showIcon className="bg-red-50 border-red-100 text-red-600 rounded-lg" />
            )}

            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                requiredMark={false}
                className="space-y-4"
            >
                <Form.Item
                    label={<span className="font-medium text-gray-700">Email Address</span>}
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input 
                        prefix={<Mail className="text-gray-400 w-4 h-4" />} 
                        placeholder="Enter your email" 
                        size="large"
                        className="h-12 bg-gray-50 border-gray-200 hover:bg-white focus:bg-white transition-all text-base"
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="font-medium text-gray-700">Password</span>}
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password 
                        prefix={<Lock className="text-gray-400 w-4 h-4" />} 
                        placeholder="••••••••" 
                        size="large"
                        className="h-12 bg-gray-50 border-gray-200 hover:bg-white focus:bg-white transition-all text-base"
                    />
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-between items-center mb-2">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            {/* Checkbox could go here */}
                        </Form.Item>
                        <a className="text-sm font-medium text-primary-600 hover:text-primary-700" href="">
                            Forgot password?
                        </a>
                    </div>
                </Form.Item>

                <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading} 
                    block 
                    size="large"
                    className="h-12 text-lg font-medium shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 transition-all rounded-xl"
                >
                    Sign In
                </Button>
            </Form>

            <p className="text-center text-gray-500 text-sm">
                Don't have an account? <span className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer">Contact Support</span>
            </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
