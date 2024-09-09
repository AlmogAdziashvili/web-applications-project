import React from 'react';
import { Flex, Table, ActionIcon, Loader } from '@mantine/core';
import axios from 'axios';
import { IconEdit, IconPlus, IconX } from '@tabler/icons-react';
import { StockFormModal } from '../StockFormModal';

export function AdminPortfolios() {
  const [portfolios, setPortfolios] = React.useState(null);

  React.useEffect(() => {
    axios.get('/portfolios').then((response) => {
      setPortfolios(response.data);
    });
  }, []);

  const rows = React.useMemo(() => {
    return portfolios?.map((portfolio, index) => (
      <Table.Tr key={portfolio.id}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{portfolio.name}</Table.Td>
        <Table.Td>{portfolio.username}</Table.Td>
        <Table.Td>{portfolio.stock}</Table.Td>
        <Table.Td>
          <ActionIcon variant="subtle">
            <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
        <Table.Td>
          <ActionIcon variant="subtle" color='red'>
            <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    ));
  }, [portfolios]);

  if (!portfolios) {
    return (
      <Flex justify='center' align='center' flex={1}>
        <Loader size={48} />
      </Flex>
    );
  }

  return (
    <Flex flex={1} direction='column'>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>Portfolio Name</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Stocks</Table.Th>
            <Table.Th>Link</Table.Th>
            <Table.Th>Delete</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Flex>
  );
}
