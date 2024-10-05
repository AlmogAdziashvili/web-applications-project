import React from 'react';
import { Flex, Table, ActionIcon, Loader } from '@mantine/core';
import axios from 'axios';
import { IconEdit, IconPlus, IconX } from '@tabler/icons-react';
import { StockFormModal } from '../StockFormModal';

export function AdminStocks() {
  const [stocks, setStocks] = React.useState(null);
  const [currentStock, setCurrentStock] = React.useState(null);

  React.useEffect(() => {
    axios.get('/stocks').then((response) => {
      setStocks(response.data);
    });
  }, []);

  const createNewStock = () => {
    setCurrentStock({ name: '', symbol: '', location: '' });
  };

  const clearCurrentStock = () => {
    setCurrentStock(null);
  };

  const editStock = (stock) => () => {
    setCurrentStock(stock);
  };

  const submitStock = async (stock) => {
    return axios.put('/stocks', stock).then(() => {
      clearCurrentStock();
      setStocks(null);
      axios.get('/stocks').then((response) => {
        setStocks(response.data);
      });
    });
  };

  const deleteStock = (stock) => () => {
    return axios.delete(`/stocks/${stock._id}`).then(() => {
      setStocks(stocks.filter((s) => s._id !== stock._id));
    });
  };

  const rows = React.useMemo(() => {
    return stocks?.map((stock, index) => (
      <Table.Tr key={stock.symbol}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{stock.name}</Table.Td>
        <Table.Td>{stock.symbol}</Table.Td>
        <Table.Td>{stock.location}</Table.Td>
        <Table.Td>{stock.sector}</Table.Td>
        <Table.Td>
          <ActionIcon variant="subtle" onClick={editStock(stock)}>
            <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
        <Table.Td>
          <ActionIcon variant="subtle" onClick={deleteStock(stock)} color='red'>
            <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    ));
  }, [stocks]);

  if (!stocks) {
    return (
      <Flex justify='center' align='center' flex={1}>
        <Loader size={48} />
      </Flex>
    );
  }

  return (
    <Flex flex={1} direction='column'>
      <ActionIcon variant="subtle" onClick={createNewStock}>
        <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>Company Name</Table.Th>
            <Table.Th>Symbol</Table.Th>
            <Table.Th>Location</Table.Th>
            <Table.Th>Sector</Table.Th>
            <Table.Th>Edit</Table.Th>
            <Table.Th>Delete</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      {currentStock && <StockFormModal currentStock={currentStock} onSubmit={submitStock} onClose={clearCurrentStock} />}
    </Flex>
  );
}
