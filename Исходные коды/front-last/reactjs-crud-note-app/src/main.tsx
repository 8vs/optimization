import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import SingleProject from './components/projects/single.project';
import SingleForm from './components/form';
import App from './App';
import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
    },
    {
        path: '/projects/:id',
        element: <SingleProject/>
    },
    {
        path: '/form',
        element: <SingleForm/>
    }
]);

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
