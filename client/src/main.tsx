import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Pages from './pages';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Pages.App/>}>
      <Route path="" element={<Pages.Home />} />
      <Route path="post" element={<Pages.Post />} />
      <Route path="detail/:id" element={<Pages.Detail />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
