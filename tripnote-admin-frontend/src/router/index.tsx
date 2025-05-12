import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/LoginPage';
import Home from '../pages/HomePage'
import NoteDetail from '../pages/NoteDetail';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/home" />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/home',
        element: <Home/>,
    },
    {
        path: '/detail/:id',
        element: <NoteDetail />, // 创建该组件
    }
]);

export default router;
