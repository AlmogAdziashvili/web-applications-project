import React from 'react';
import { Flex, Table, ActionIcon, Loader } from '@mantine/core';
import axios from 'axios';
import { IconLink, IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function AdminPortfolios() {
  const [portfolios, setPortfolios] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get('/api/portfolios').then((response) => {
      setPortfolios(response.data);
    });
  }, []);

  const deletePortfolio = (id) => () => {
    axios.delete(`/api/portfolios/${id}`).then(() => {
      setPortfolios(portfolios.filter((portfolio) => portfolio.id !== id));
    });
  };

  const navigateToPortfolio = (id) => () => {
    navigate(`/portfolios/${id}`);
  }

  const rows = React.useMemo(() => {
    return portfolios?.map((portfolio, index) => (
      <Table.Tr key={portfolio._id}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{portfolio.name}</Table.Td>
        <Table.Td>{portfolio.user.username}</Table.Td>
        <Table.Td>{portfolio.stocks.map(s => s.symbol).join(', ')}</Table.Td>
        <Table.Td>
          <ActionIcon variant="subtle" onClick={navigateToPortfolio(portfolio._id)}>
            <IconLink style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
        <Table.Td>
          <ActionIcon variant="subtle" color='red' onClick={deletePortfolio(portfolio._id)}>
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
