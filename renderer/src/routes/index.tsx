import { AboutPage } from '@/pages/AboutPage';
import { CandidatesPage } from '@/pages/CandidatesPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RootLayout } from '@/layouts/RootLayout';
import {
    RouterProvider,
    createBrowserRouter,
    createHashRouter
} from 'react-router-dom';

export { mainNavItems } from './nav';

// Electron em produção carrega file:// — hash router evita 404 no file protocol.
const isElectron =
    typeof window !== 'undefined' &&
    (window.location.protocol === 'file:' ||
        navigator.userAgent.toLowerCase().includes('electron'));

const routes = [
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'candidatos', element: <CandidatesPage /> },
            { path: 'sobre', element: <AboutPage /> },
            { path: '*', element: <NotFoundPage /> }
        ]
    }
];

const router = isElectron ? createHashRouter(routes) : createBrowserRouter(routes);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
