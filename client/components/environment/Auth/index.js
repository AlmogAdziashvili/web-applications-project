import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignIn from '../../../components/pages/SignIn';
import SignUp from '../../../components/pages/SignUp';
import { createTheme, MantineProvider, Flex } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'teal'
});

export default function Auth() {

  const router = createBrowserRouter([
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: '/signup',
      element: <SignUp />,
    }
  ]);

  return (
    <MantineProvider theme={theme}>
      <Flex mih='100vh'>
        <RouterProvider router={router} />
      </Flex>
    </MantineProvider>
  );
}
