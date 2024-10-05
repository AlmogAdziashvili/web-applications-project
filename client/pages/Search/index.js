import React, { useEffect } from 'react';
import { Flex, getGradient, useMantineTheme, Select, Card, TextInput, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context';
import { Navbar } from '../../components/Navbar';
import axios from 'axios';
import { StockPreview } from '../../components/StockPreview';

export default function Search() {
  const user = React.useContext(Context);
  const theme = useMantineTheme();
  const backgroundGradient = getGradient({ deg: 45, from: 'teal.2', to: 'gray.2' }, theme);
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');
  const [sector, setSector] = React.useState('');
  const [results, setResults] = React.useState(null);

  const search = () => {
    axios.get(`/stocks/search?query=${query}&sector=${sector || ''}`).then((response) => {
      setResults(response.data);
    });
  };

  return (
    <Flex flex={1} bg={backgroundGradient}>
      <Navbar />
      <Flex flex={1} p='xl' direction='column'>
        <Card radius='md' mb='md' display='flex' style={{ flexDirection: 'row', gap: '16px' }}>
          <TextInput flex={1} placeholder='Search' value={query} onChange={e => setQuery(e.target.value)} />
          <Select placeholder='Sector' data={['Technology', 'Finance', 'Retail']} value={sector} onChange={setSector} />
          <Button onClick={search}>Search</Button>
        </Card>
        <Flex wrap='wrap' w='100%' gap='md'>
          {results?.map((stock) => (
            <StockPreview key={stock.symbol} stock={stock} />
          ))}
        </Flex>
      </Flex>
    </Flex >
  );
}
