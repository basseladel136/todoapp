import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { PublicRoute } from '@/components/routing/PublicRoute';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { TodoPage } from '@/pages/TodoPage';
import { NewTodoPage } from '@/pages/NewTodoPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // Public-only routes (redirect to /todos when logged in).
      {
        element: <PublicRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> },
        ],
      },
      // Protected routes (redirect to /login when logged out).
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/todos', element: <TodoPage /> },
          { path: '/todos/new', element: <NewTodoPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
      { path: '/', element: <Navigate to="/todos" replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
