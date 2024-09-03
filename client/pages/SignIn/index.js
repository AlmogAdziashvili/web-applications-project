import React from 'react';
import { Flex, getGradient, useMantineTheme, Title, TextInput, Button, Card, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignIn() {
  const [errorMessage, setErrorMessage] = React.useState('');
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },

    validate: {
      username: (value) => (value.includes('@') ? null : 'Please enter a valid email'),
      password: (value) => (value.length >= 6 ? null : 'Password is too short'),
    },
  });

  const onSubmit = (values) => {
    axios.post('/auth/signin', values)
      .then((response) => {
        const message = response.data.message;
        if (message === 'Successful') {
          window.location.href = '/';
          return;
        }
        setErrorMessage(message);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setErrorMessage('Invalid email or password');
        } else {
          setErrorMessage('An error occurred');
        }
      });
  };

  const backgroundGradient = getGradient({ deg: 45, from: 'teal.2', to: 'gray.2' }, theme);
  const navigateToSignUp = () => navigate('/signup');

  return (
    <Flex align='center' justify='center' flex='1' bg={backgroundGradient}>
      <Card shadow="md" radius='md'>
        <Card.Section p='xl'>
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Flex direction='column' gap='lg'>
              <Title order={1} c='gray.9'>Sign In</Title>
              <TextInput w='300' label="Email" placeholder="your@email.com" key={form.key('username')} {...form.getInputProps('username')} />
              <TextInput type='password' w='300' label="Password" placeholder="********" key={form.key('password')} {...form.getInputProps('password')} />
              {errorMessage && <Text w='300' size='xs' c='red'>{errorMessage}</Text>}
              <Button type="submit" fullWidth>Submit</Button>
            </Flex>
          </form>
          <Button variant='transparent' onClick={navigateToSignUp}>Don't have an account? Sign up here.</Button>
        </Card.Section>
      </Card>
    </Flex>
  );
}
