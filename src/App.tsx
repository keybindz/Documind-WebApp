import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Shell from './layouts/Shell';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import Assistant from './pages/Assistant';
import Usage from './pages/Usage';
import Webhooks from './pages/Webhooks';
import Settings from './pages/Settings';

function Protected() {
  const token = useAuthStore((s) => s.token);
  return token ? <Shell /> : <Navigate to='/login' replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route element={<Protected />}>
        <Route index element={<Dashboard />} />
        <Route path='/documents' element={<Documents />} />
        <Route path='/documents/:id' element={<DocumentDetail />} />
        <Route path='/assistant' element={<Assistant />} />
        <Route path='/usage' element={<Usage />} />
        <Route path='/webhooks' element={<Webhooks />} />
        <Route path='/settings' element={<Settings />} />
      </Route>
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}
