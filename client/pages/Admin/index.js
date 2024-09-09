import React, { useEffect } from 'react';
import { Flex, getGradient, useMantineTheme, Tabs, Card } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context';
import { Navbar } from '../../components/Navbar';
import { AdminUsers } from '../../components/AdminUsers';
import { IconUsers, IconCurrencyDollar, IconGraph } from '@tabler/icons-react';
import { AdminStocks } from '../../components/AdminStocks';
import { AdminPortfolios } from '../../components/AdminPortfolios';

export default function Admin() {
  const user = React.useContext(Context);
  const theme = useMantineTheme();
  const backgroundGradient = getGradient({ deg: 45, from: 'teal.2', to: 'gray.2' }, theme);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
    }
  }, [user]);

  return (
    <Flex flex={1} bg={backgroundGradient}>
      <Navbar />
      <Flex flex={1} p='xl' justify='center'>
        <Tabs defaultValue='users' maw={900} w='100%'>
          <Card flex={1} radius='md' mb='md'>
            <Tabs.List>
              <Tabs.Tab value='users' leftSection={<IconUsers size="1rem" stroke={1.5} />}>Users</Tabs.Tab>
              <Tabs.Tab value='stocks' leftSection={<IconCurrencyDollar size="1rem" stroke={1.5} />}>Stocks</Tabs.Tab>
              <Tabs.Tab value='portfolios' leftSection={<IconGraph size="1rem" stroke={1.5} />}>Portfolios</Tabs.Tab>
            </Tabs.List>
          </Card>
          <Card flex={1} radius='md'>
            <Tabs.Panel value='users'>
              <AdminUsers />
            </Tabs.Panel>
            <Tabs.Panel value='stocks'>
              <AdminStocks />
            </Tabs.Panel>
            <Tabs.Panel value='portfolios'>
            <AdminPortfolios />
            </Tabs.Panel>
          </Card>
        </Tabs>
      </Flex>
    </Flex >
  );
}
