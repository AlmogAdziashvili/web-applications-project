import React, { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Dashboard from '../..//pages/Dashboard';
import { createTheme, MantineProvider, Flex } from '@mantine/core';
import axios from 'axios';
import { Context } from '../../context';
import Admin from '../../pages/Admin';
import Search from '../../pages/Search';
import Portfolios from '../../pages/Portfolios';

const theme = createTheme({
  primaryColor: 'teal',
  cursorType: 'pointer',
});

export default function Main() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios.get('/auth/profile')
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);


  const router = createBrowserRouter([{
    path: "/",
    element: <Dashboard />,
  }, {
    path: '/admin',
    element: <Admin />,
  }, {
    path: '/search',
    element: <Search />,
  }, {
    path: 'portfolios',
    element: <Portfolios />,
  }, {
    path: '*',
    element: <Dashboard />,
  }]);

  return (
    <Context.Provider value={user}>
      <MantineProvider theme={theme}>
        <Flex mih='100vh'>
          <RouterProvider router={router} />
        </Flex>
      </MantineProvider>
    </Context.Provider>
  );
}
