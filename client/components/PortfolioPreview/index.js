import React from 'react';
import axios from 'axios';
import { Text, Card, Title, Flex, ActionIcon, Loader } from '@mantine/core';
import * as d3 from 'd3';
import { IconLink } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

export function PortfolioPreview(props) {
  const [values, setValues] = React.useState(null);
  const navigate = useNavigate();
  React.useEffect(() => {
    axios.get('/api/portfolios/' + props.portfolio._id + '/value').then((response) => setValues(response.data));
  }, [props.portfolio._id]);

  const navigateToPortfolio = () => {
    navigate('/portfolios/' + props.portfolio._id);
  };

  const changeFromYesterday = (values?.[0] - values?.[1]).toFixed(2);
  const changeFromYesterdayPercent = ((changeFromYesterday / values?.[1]) * 100).toFixed(2);

  return (
    <Card display='flex' shadow='xs' padding='md' style={{ cursor: 'pointer', gap: '4px' }} miw={300} flex={1}>
      <Title order={4}>{props.portfolio.name}</Title>
      <Text c='gray'>By <Text c='dark' display='inline'>{props.portfolio.user.username}</Text></Text>
      <Text >Number of Stocks: {props.portfolio.stocks.length}</Text>
      {values ? (
        <Flex gap='sm' align='center'>
          <Title order={1}>${values[0].toFixed(2)}</Title>
          <Title order={4} c={changeFromYesterday > 0 ? 'green' : 'red'}>{changeFromYesterday > 0 && '+'}{changeFromYesterday}({changeFromYesterdayPercent}%)</Title>
        </Flex>
      ) : <Loader />}
      <ActionIcon variant="subtle" pos='absolute' right={4} top={4} onClick={navigateToPortfolio}>
        <IconLink style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
    </Card>
  );
}
