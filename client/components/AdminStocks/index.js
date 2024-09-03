import React from 'react';
import { Flex, Loader, Table, ActionIcon, Button } from '@mantine/core';
import axios from 'axios';
import { IconEdit, IconPlus } from '@tabler/icons-react';

export function AdminStocks() {
  const [stocks, setStocks] = React.useState([{ name: 'Apple Inc.', symbol: 'AAPL', location: 'California' }]);

  React.useEffect(() => {
    axios.get('/stocks').then((response) => {
      setStocks(response.data);
    });
  }, []);

  const rows = React.useMemo(() => {
    return stocks.map((stock, index) => (
      <Table.Tr key={stock.symbol}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{stock.name}</Table.Td>
        <Table.Td>{stock.symbol}</Table.Td>
        <Table.Td>{stock.location}</Table.Td>
        <Table.Td>
          <ActionIcon variant="subtle">
            <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    ));
  }, [stocks]);

  return (
    <Flex flex={1} direction='column'>
      <ActionIcon variant="subtle">
        <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>Company Name</Table.Th>
            <Table.Th>Symbol</Table.Th>
            <Table.Th>Location</Table.Th>
            <Table.Th>Edit</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Flex>
  );
}
