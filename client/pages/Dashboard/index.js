import React from 'react';
import { Flex, getGradient, useMantineTheme, Loader, Title, Card } from '@mantine/core';
import { Context } from '../../context';
import { Navbar } from '../../components/Navbar';
import { PortfolioPreview } from '../../components/PortfolioPreview';
import axios from 'axios';
import { PortfolioModal } from '../../components/PortfolioModal';

export default function Dashboard() {
  const user = React.useContext(Context);
  const theme = useMantineTheme();
  const backgroundGradient = getGradient({ deg: 45, from: 'teal.2', to: 'gray.2' }, theme);
  const [portfolios, setPortfolios] = React.useState(null);
  const [stocks, setStocks] = React.useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = React.useState(null);

  React.useEffect(() => {
    axios.get('/api/portfolios/my').then(({ data }) => {
      setPortfolios(data);
    });
    axios.get('/stocks').then(({ data }) => {
      setStocks(data);
    });
  }, []);

  const deletePortfolio = (id) => {
    axios.delete(`/api/portfolios/${id}`).then(() => {
      setPortfolios(portfolios.filter(p => p._id !== id));
    });
  };

  const portfoliosGrid = React.useMemo(() => {
    if (!portfolios) {
      return null;
    }
    return (
      <Flex align='center' flex='1' p='md' direction='column'>
        <Title c='gray.9' display='block'>My Portfolios</Title>
        <Flex wrap='wrap' w='100%' p='md' gap='md'>
          {portfolios.map(portfolio => (
            <PortfolioPreview key={portfolio._id} portfolio={portfolio} onEdit={() => setSelectedPortfolio(portfolio)} onDelete={() => deletePortfolio(portfolio._id)} />
          ))}
          <Card display='flex' shadow='xs' padding='md' style={{ cursor: 'pointer', gap: '4px', justifyContent: 'center' }} miw={350} flex={1} onClick={() => setSelectedPortfolio({ name: '', stocks: [] })} mih={160}>
            <Title order={4} ta='center'>Add Portfolio</Title>
          </Card>
        </Flex>
      </Flex>
    );
  }, [portfolios]);

  return (
    <Flex flex='1' bg={backgroundGradient}>
      <Navbar />
      {portfolios ? portfoliosGrid : <Flex align='center' justify='center' flex='1'><Loader /></Flex>}
      <PortfolioModal portfolio={selectedPortfolio} stocks={stocks} onClose={() => setSelectedPortfolio(null)} />
    </Flex>
  );
}
