// src/components/Portfolio.js
import React from 'react';
import { Flex, Card, Text } from '@mantine/core';
import { Stock } from '../Stock';

export function Portfolio({ stocks }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text weight={700} size="xl" mb="md">
        Portfolio
      </Text>
      <Flex direction="column" gap="md">
        {stocks.map((stock, index) => (
          <Stock key={index} stock={stock} />
        ))}
      </Flex>
    </Card>
  );
}
