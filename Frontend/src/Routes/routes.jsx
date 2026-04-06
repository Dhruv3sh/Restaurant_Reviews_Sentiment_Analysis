import { createBrowserRouter } from 'react-router-dom';
import Reviews from "../pages/Reviews";
import App from '../App';
import Home from '../Pages/Home';
import ErrorPage from '../Pages/Error';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage/>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/reviews", element: <Reviews/> },
    ],
  },
]);

export default router