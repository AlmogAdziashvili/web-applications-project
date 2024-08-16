import React from 'react';
import { Flex, getGradient, useMantineTheme, Title, TextInput, Button, Card, Text } from '@mantine/core';
import { Context } from '../../../components/context';

export default function HomePage() {
  const user = React.useContext(Context);
  const theme = useMantineTheme();
  const backgroundGradient = getGradient({ deg: 45, from: 'teal.2', to: 'gray.2' }, theme);

  return (
    <Flex align='center' justify='center' flex='1' bg={backgroundGradient}>
      <Title>Hello {user?.name}</Title>
      {user?.isAdmin && <Text>You are an admin</Text>}
    </Flex >
  );
}
