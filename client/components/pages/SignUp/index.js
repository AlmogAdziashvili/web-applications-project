import React from 'react';
import { Flex, getGradient, useMantineTheme, Title, TextInput, Button, Card, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
  const [errorMessage, setErrorMessage] = React.useState('');
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      username: '',
      password: '',
    },

    validate: {
      name: (value) => (value.length >= 2 ? null : 'Name is too short'),
      username: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password is too short'),
    },
  });

  const backgroundGradient = getGradient({ deg: 45, from: 'teal.2', to: 'gray.2' }, theme);
  const navigateToSignIn = () => navigate('/signin');

  const onSubmit = (values) => {
    axios.post('/auth/signup', values)
      .then((response) => {
        const message = response.data.message;
        if (message === 'Successful') {
          window.location.href = '/';
          return;
        }
        setErrorMessage(message);
      })
      .catch(() => {
        setErrorMessage('An error occurred');
      });
  };

  return (
    <Flex align='center' justify='center' flex='1' bg={backgroundGradient}>
      <Card shadow="md" radius='md'>
        <Card.Section p='xl'>
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Flex direction='column' gap='lg'>
              <Title order={1} c='gray.9'>Sign Up</Title>
              <TextInput w='300' label="Name" placeholder="John Doe" key={form.key('name')} {...form.getInputProps('name')} />
              <TextInput w='300' label="Email" placeholder="your@email.com" key={form.key('username')} {...form.getInputProps('username')} />
              <TextInput w='300' label="Password" placeholder="********" key={form.key('password')} {...form.getInputProps('password')} />
              {errorMessage && <Text w='300' size='xs' c='red'>{errorMessage}</Text>}
              <Button fullWidth type="submit">Submit</Button>
            </Flex>
          </form>
          <Button variant='transparent' onClick={navigateToSignIn}>Already have an account? Sign in here.</Button>
        </Card.Section>
      </Card>
    </Flex>
  );
}
