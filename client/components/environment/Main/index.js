import React from 'react';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import HomePage from '../../../components/pages/HomePage';

import styles from './styles.module.css';

export default function Main() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
  ]);

  return (
    <div className={styles.main}>
      <RouterProvider router={router} />
    </div >
  );
}
