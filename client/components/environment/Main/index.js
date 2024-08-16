import React, { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from '../../../components/pages/HomePage';
import { createTheme, MantineProvider, Flex } from '@mantine/core';
import axios from 'axios';
import { Context } from '../../../components/context';

const theme = createTheme({
  primaryColor: 'teal'
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


  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
  ]);

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
