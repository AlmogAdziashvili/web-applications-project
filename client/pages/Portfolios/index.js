import React from 'react';
import axios from 'axios';
import { Flex, getGradient, Loader, useMantineTheme, Title } from '@mantine/core';
import { Context } from '../../context';
import { Navbar } from '../../components/Navbar';
import { PortfolioPreview } from '../../components/PortfolioPreview';

export default function Portfolios() {
  const user = React.useContext(Context);
  const theme = useMantineTheme();
  const backgroundGradient = getGradient({ deg: 45, from: 'teal.2', to: 'gray.2' }, theme);
  const [portfolios, setPortfolios] = React.useState(null);

  React.useEffect(() => {
    axios.get('/api/portfolios').then(res => setPortfolios(res.data));
  }, []);

  const portfoliosGrid = React.useMemo(() => {
    if (!portfolios) {
      return null;
    }
    return (
      <Flex align='center' flex='1' p='md' direction='column'>
        <Title c='gray.9' display='block'>Community Portfolios</Title>
        <Flex wrap='wrap' w='100%' p='md' gap='md'>
          {portfolios.map(portfolio => (
            <PortfolioPreview key={portfolio._id} portfolio={portfolio} />
          ))}
        </Flex>
      </Flex>
    );
  }, [portfolios]);

  return (
    <Flex flex='1' bg={backgroundGradient}>
      <Navbar />
      {portfolios ? portfoliosGrid : <Flex align='center' justify='center' flex='1'><Loader /></Flex>}
    </Flex >
  );
}
