import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Master Your Interviews with <span className="text-blue-600">OmniTrain AI</span>
        </h1>
        <p className="text-xl text-gray-600">
          Upload your study materials, generate custom questions, and practice with our AI-powered trainer. 
          Get real-time feedback and track your progress.
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
            <Button type="primary" size="large" onClick={() => navigate('/login')} className="px-8 h-12 text-lg">
                Get Started
            </Button>
            <Button size="large" onClick={() => navigate('/login')} className="px-8 h-12 text-lg">
                Login
            </Button>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">Upload Content</h3>
              <p className="text-gray-500">Support for PDF and DOCX files. Our AI extracts key concepts automatically.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">AI Question Engine</h3>
              <p className="text-gray-500">Generate MCQs, detailed questions, and coding challenges tailored to your material.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-gray-500">Analyze your performance and identify areas for improvement.</p>
          </div>
      </div>
    </div>
  );
};

export default LandingPage;
