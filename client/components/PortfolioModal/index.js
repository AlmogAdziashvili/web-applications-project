import React from 'react';
import axios from 'axios';
import { Button, Flex, TextInput, Modal, Text, ActionIcon, Select } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

export function PortfolioModal(props) {
  const [name, setName] = React.useState(props.portfolio?.name || '');
  const [stocks, setStocks] = React.useState(props.portfolio?.stocks || []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (props.portfolio?._id) {
      return axios.put(`/api/portfolios/${props.portfolio._id}`, { name, stocks: stocks.map(({ stock, quantity }) => ({ quantity, stock: stock._id })) }).then(() => {
        props.onClose();
        location.reload();
      });
    }
    return axios.post('/api/portfolios', { name, stocks: stocks.map(({ stock, quantity }) => ({ quantity, stock: stock._id })) }).then(() => {
      props.onClose();
      location.reload();
    });
  };

  React.useEffect(() => {
    setStocks(props.portfolio?.stocks || []);
    setName(props.portfolio?.name || '');
  }, [props.portfolio])

  const onRemoveStock = (index) => {
    setStocks((current) => current.filter((_, i) => i !== index));
  };

  const onSelectStockToAdd = (symbol) => {
    setStocks((current) => [...current, { stock: props.stocks.find(s => s.symbol === symbol), quantity: 1 }]);
  };

  const onChangeStockQuantity = (index) => (e) => {
    setStocks((current) => current.map((stock, i) => i === index ? { ...stock, quantity: e.target.value } : stock));
  };

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  return (
    <Modal opened={props.portfolio} onClose={props.onClose} title={props.portfolio?._id ? 'Edit Portfolio' : 'Create New Portfolio'}>
      <form>
        <Flex direction='column' gap='lg'>
          <TextInput label="Name" placeholder="Finance Portfolio" onChange={onChangeName} value={name} />
          {stocks.map((stock, i) => (
            <Flex gap='md' align='center' justify='space-between' key={stock.stock._id}>
              <Text weight={500}>{stock.stock.symbol}</Text>
              <TextInput type='number' placeholder="10" value={stock.quantity} onChange={onChangeStockQuantity(i)} />
              <ActionIcon variant="subtle" color='red' onClick={() => onRemoveStock(i)}><IconX /></ActionIcon>
            </Flex>
          ))}
          <Select value='' data={props.stocks?.map(stock => stock.symbol).filter(stock => !stocks.some(s => stock == s.stock.symbol))} label="Add Stock" placeholder="Select stock" onChange={onSelectStockToAdd} />
          <Button type="submit" onClick={onSubmit} fullWidth>Submit</Button>
        </Flex>
      </form>
    </Modal>
  );
}
