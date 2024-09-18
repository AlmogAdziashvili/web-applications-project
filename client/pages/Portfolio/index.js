import React from 'react';
import axios from 'axios';
import { Flex, getGradient, useMantineTheme, Loader } from '@mantine/core';
import { Context } from '../../context';
import { Navbar } from '../../components/Navbar';
import { useParams } from 'react-router';
import { PortfolioPage } from '../../components/PortfolioPage';

export default function Portfolio() {
  const user = React.useContext(Context);
  const theme = useMantineTheme();
  const backgroundGradient = getGradient({ deg: 45, from: 'teal.2', to: 'gray.2' }, theme);
  const { id } = useParams();
  const [portfolio, setPortfolio] = React.useState(null);

  React.useEffect(() => {
    axios.get('/api/portfolios/' + id).then((response) => setPortfolio(response.data));
  }, []);

  return (
    <Flex flex='1' bg={backgroundGradient}>
      <Navbar />
      {portfolio ? <PortfolioPage portfolio={portfolio} /> : <Flex align='center' justify='center' flex='1'><Loader /></Flex>}
    </Flex >
  );
}
