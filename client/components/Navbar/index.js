import React, { useContext } from 'react';
import { Flex, NavLink, Title } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconChevronRight, IconHome, IconCoin, IconSearch, IconUserShield, IconLogout } from '@tabler/icons-react';

import { Context } from '../../context';
import css from './index.module.css';

const navbarLinks = [
  { label: 'Dashboard', path: '/', icon: <IconHome size="1rem" stroke={1.5} /> },
  { label: 'Search Stock', path: '/search', icon: <IconSearch size="1rem" stroke={1.5} /> },
  { label: 'My Portfolios', path: '/portfolios', icon: <IconCoin size="1rem" stroke={1.5} /> },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useContext(Context);
  const signOut = () => {
    window.location.href = '/auth/signout';
  };
  return (
    <Flex className={css.toolbarWrapper} bg='white' direction='column' pt='xl' pb='xl' gap='xl' justify='space-between' miw={200}>
      <Flex direction='column' align='center' gap='xl'>
        <Title order={3}>Bashi</Title>
        <Flex direction='column' w='100%'>
          {navbarLinks.map(({ label, path, icon }) => (
            <NavLink key={label} active={location.pathname === path} onClick={() => navigate(path)} label={label} leftSection={icon} rightSection={<IconChevronRight size="1rem" stroke={1.5} />} />
          ))}
        </Flex>
      </Flex>
      <Flex direction='column'>
        {user?.isAdmin && <NavLink active={location.pathname === '/admin'} onClick={() => navigate('/admin')} label='Admin Page' leftSection={<IconUserShield size='1rem' stroke={1.5} />} rightSection={<IconChevronRight size="1rem" stroke={1.5} />} />}
        <NavLink active variant='subtle' color='red' onClick={signOut} label='Sign Out' leftSection={<IconLogout size='1rem' stroke={1.5} />} rightSection={<IconChevronRight size="1rem" stroke={1.5} />} />
      </Flex>
    </Flex >
  );
}
