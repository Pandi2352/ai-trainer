import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import 'antd/dist/reset.css'; // Ensure AntD styles are reset if needed (v5 handles this automatically usually)

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
