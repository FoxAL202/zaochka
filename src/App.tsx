import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { checkAuthThunk } from './store/authSlice';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Catalog from './pages/Catalog/Catalog';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import CreateRequest from './pages/CreateRequest/CreateRequest';
import RequestDetail from './pages/RequestDetail/RequestDetail';
import MyRequests from './pages/MyRequests/MyRequests';
import AdminObjects from './pages/AdminObjects/AdminObjects';
import AdminRequests from './pages/AdminRequests/AdminRequests';

function AuthGate({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuthThunk());
  }, [dispatch]);

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthGate>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Catalog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/request/:id" element={<RequestDetail />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-requests"
              element={
                <ProtectedRoute>
                  <MyRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/objects"
              element={
                <AdminRoute>
                  <AdminObjects />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <AdminRoute>
                  <AdminRequests />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </AuthGate>
    </BrowserRouter>
  );
}
