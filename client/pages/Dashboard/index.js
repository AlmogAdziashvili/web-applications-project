// src/pages/Dashboard.js
import React, { useContext } from 'react';
import { Flex, getGradient, useMantineTheme } from '@mantine/core';
import { Context } from '../../context';
import { Navbar } from '../../components/Navbar';
import { Portfolio } from '../../components/Portfolio';

export default function Dashboard() {
  const user = useContext(Context);
  const theme = useMantineTheme();
  const backgroundGradient = getGradient({ deg: 45, from: 'teal.2', to: 'gray.2' }, theme);
  // Example stocks data
  const stocks = [
    { name: 'Apple', symbol: 'AAPL' },
    { name: 'Tesla', symbol: 'TSLA' },
    // Add more stocks as needed
  ];

  return (
    <Flex style={{ height: '100vh' }} bg={backgroundGradient}>
      {/* Navbar on the left side */}
      <Navbar />

      {/* Portfolio container takes the remaining space */}
      <Flex 
        style={{ 
          flex: 1,              // Take up the remaining space
          padding: '2rem',      // Padding from the screen edges
          overflowY: 'auto'     // Ensure content is scrollable if it overflows
        }}
      >
        <Portfolio stocks={stocks} />
      </Flex>
    </Flex>
  );
}
