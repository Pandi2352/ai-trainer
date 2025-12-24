import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { Bot, CheckCircle, FileText, BarChart, ArrowRight, Brain } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50 to-surface-100 overflow-x-hidden">
      
      {/* Navbar Placeholder / Logo */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                O
            </div>
            <span className="font-bold text-2xl text-gray-800">OmniTrain</span>
        </div>
        <div className="space-x-4">
             <Button type="link" onClick={() => navigate('/login')} className="text-gray-600 hover:text-primary-600 font-medium">Log In</Button>
             <Button type="primary" onClick={() => navigate('/login')} className="rounded-full shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40">Register</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 space-y-8 text-center md:text-left z-10"
            >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/50 border border-primary-200 text-primary-700 font-medium text-sm">
                    <Brain className="w-4 h-4" /> AI-Powered Learning Assistant
                </motion.div>
                
                <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
                    Master Interviews with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">Intelligent AI</span>
                </motion.h1>
                
                <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-xl mx-auto md:mx-0 leading-relaxed">
                    Upload your study materials, generate custom questions, and practice with our AI-powered trainer. 
                    Get real-time feedback and track your progress to perfection.
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Button type="primary" size="large" onClick={() => navigate('/login')} className="h-14 px-8 text-lg rounded-full flex items-center gap-2 shadow-xl shadow-primary-500/20 hover:scale-105 transition-transform">
                        Start Learning Now <ArrowRight className="w-5 h-5" />
                    </Button>
                    <Button size="large" className="h-14 px-8 text-lg rounded-full border-2 border-gray-200 hover:border-primary-400 hover:text-primary-600 hover:bg-white transition-colors">
                        View Demo
                    </Button>
                </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="flex-1 relative"
            >
                <div className="relative z-10 bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-2xl glass-card">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

                    {/* Mock Interface Code */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/80 p-4 rounded-xl shadow-sm">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">React_Basics.pdf</h3>
                                <p className="text-xs text-gray-500">Processing • 85% Complete</p>
                            </div>
                            <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                        </div>

                        <div className="bg-white/80 p-4 rounded-xl shadow-sm space-y-3">
                            <div className="w-full h-8 bg-gray-100 rounded-lg animate-pulse"></div>
                            <div className="w-3/4 h-8 bg-gray-100 rounded-lg animate-pulse delay-100"></div>
                            <div className="flex gap-2 mt-2">
                                <div className="w-20 h-8 bg-primary-100 rounded-lg opacity-50"></div>
                                <div className="w-20 h-8 bg-gray-100 rounded-lg opacity-50"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose OmniTrain?</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">Our platform bridges the gap between study material and interview readiness with advanced AI analysis.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        icon: <UploadCloudIcon />, 
                        title: "Smart Content Analysis", 
                        desc: "Support for PDF and DOCX files. Our AI extracts key concepts automatically and structures them for learning."
                    },
                    {
                        icon: <BotIcon />, 
                        title: "AI Question Engine", 
                        desc: "Generate MCQs, detailed questions, and coding challenges specifically tailored to your uploaded material."
                    },
                    {
                        icon: <ChartIcon />, 
                        title: "Performance Tracking", 
                        desc: "Analyze your performance over time. Identify weak spots and get personalized recommendations."
                    }
                ].map((feature, idx) => (
                    <motion.div 
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-primary-100 group"
                    >
                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-primary-600">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
              <p>© 2025 OmniTrain AI. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
};

// Helper Icons
const UploadCloudIcon = () => <FileText size={28} />;
const BotIcon = () => <Bot size={28} />;
const ChartIcon = () => <BarChart size={28} />;

export default LandingPage;
