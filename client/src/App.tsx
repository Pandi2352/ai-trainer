import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import 'antd/dist/reset.css';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#10b981', // emerald-500
          borderRadius: 8,
          colorBgContainer: '#ffffff',
          fontFamily: "'Inter', sans-serif",
        },
        components: {
          Button: {
            colorPrimary: '#10b981',
            algorithm: true,
          },
          Input: {
            colorPrimary: '#10b981',
            algorithm: true,
          },
        },
      }}
    >
      <Router>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
