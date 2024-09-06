// src/components/Stock.js
import React from 'react';
import { Card, Text } from '@mantine/core';

export function Stock({ stock }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text weight={500} size="lg">
        {stock.name} ({stock.symbol})
      </Text>
    </Card>
  );
}
