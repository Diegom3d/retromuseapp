import { BrowserRouter, Routes, Route } from 'react-router-dom';import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './hooks/useAuthStore';
import './styles/global.css';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';
import CustomizePage from './pages/CustomizePage';
import NotFoundPage from './pages/NotFoundPage';

// Layout
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <div className="scanlines">
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '2px solid var(--color-border)',
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
            },
          }}
        />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/"        element={<HomePage />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas con layout */}
          <Route element={<Layout />}>
            <Route path="/feed"         element={<FeedPage />} />
            <Route path="/artista/:id"  element={<ProfilePage />} />
            <Route path="/post/:id"     element={<PostPage />} />

            {/* Rutas privadas (requieren login) */}
            <Route element={<PrivateRoute />}>
              <Route path="/crear"      element={<CreatePostPage />} />
              <Route path="/personalizar" element={<CustomizePage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
