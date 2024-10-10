import { useRoutes } from 'react-router-dom';

// project-imports
import LoginRoutes from './LoginRoutes';
import CabProvidorRoutes from './CabProvidorRoutes';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import { lazy } from 'react';

const PagesLanding = Loadable(lazy(() => import('pages/Landing')));
// ==============================|| ROUTES RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <CommonLayout layout="landing" />,
      children: [
        {
          path: '/',
          element: <PagesLanding />
        }
      ]
    },
    LoginRoutes,
    CabProvidorRoutes
  ]);
}
