import React from 'react';
import { Flex, getGradient, useMantineTheme } from '@mantine/core';
import { Context } from '../../context';
import { Navbar } from '../../components/Navbar';

export default function Portfolios() {
  const user = React.useContext(Context);
  const theme = useMantineTheme();
  const backgroundGradient = getGradient({ deg: 45, from: 'teal.2', to: 'gray.2' }, theme);

  return (
    <Flex flex='1' bg={backgroundGradient}>
      <Navbar />
    </Flex >
  );
}
