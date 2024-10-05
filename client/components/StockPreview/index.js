import React from 'react';
import axios from 'axios';
import { Text, Card, Title, Flex, ActionIcon, Loader, Tooltip } from '@mantine/core';
import { IconLink, IconEdit, IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

export function StockPreview(props) {
  const [timeSeries, setTimeSeries] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get(`/stocks/${props.stock.symbol}/timeSeries`).then(({ data: { timeSeries } }) => {
      setTimeSeries([timeSeries[0].close, timeSeries[1].close].map(Number));
    });
  }, [props.stock.symbol]);

  const navigateToStock = () => {
    navigate(`/search/${props.stock.symbol}`);
  };
  const changeFromYesterday = (timeSeries?.[0] - timeSeries?.[1]).toFixed(2);
  const changeFromYesterdayPercent = ((changeFromYesterday / timeSeries?.[1]) * 100).toFixed(2);
  return (
    <Card display='flex' shadow='xs' padding='md' style={{ cursor: 'pointer', gap: '4px' }} miw={350} flex={1}>
      <Title order={4}>{props.stock.name} ({props.stock.symbol})</Title>
      <Text>{props.stock.location}</Text>
      {timeSeries ? (
        <Flex gap='sm' align='center'>
          <Title order={1}>${timeSeries[0].toFixed(2)}</Title>
          <Title order={4} c={changeFromYesterday > 0 ? 'green' : 'red'}>{changeFromYesterday > 0 && '+'}{changeFromYesterday}({changeFromYesterdayPercent}%)</Title>
        </Flex>
      ) : <Loader />}
      <Tooltip label="Go To Stock Page">
        <ActionIcon variant="subtle" pos='absolute' right={4} top={4} onClick={navigateToStock}>
          <IconLink style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
    </Card>
  );
}
