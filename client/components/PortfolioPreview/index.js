import React from 'react';
import axios from 'axios';
import { Text, Card, Title, Flex, ActionIcon, Loader, Tooltip } from '@mantine/core';
import { IconLink, IconEdit, IconX } from '@tabler/icons-react';
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

  const editActionButton = React.useMemo(() => {
    if (props.onEdit) {
      return (
        <Tooltip label="Edit Portfolio">
          <ActionIcon variant="subtle" pos='absolute' right={28} top={4} onClick={props.onEdit}>
            <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      );
    }
  }, [props.onEdit]);

  const deleteActionButton = React.useMemo(() => {
    if (props.onDelete) {
      return (
        <Tooltip label="Delete Portfolio">
          <ActionIcon c='red' variant="subtle" pos='absolute' right={4} bottom={4} onClick={props.onDelete}>
            <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      );
    }
  }, [props.onDelete]);

  return (
    <Card display='flex' shadow='xs' padding='md' style={{ cursor: 'pointer', gap: '4px' }} miw={350} flex={1}>
      <Title order={4}>{props.portfolio.name}</Title>
      {!props.onEdit && <Text c='gray'>By <Text c='dark' display='inline'>{props.portfolio.user.username}</Text></Text>}
      <Text >Number of Stocks: {props.portfolio.stocks.length}</Text>
      {values ? (
        <Flex gap='sm' align='center'>
          <Title order={1}>${values[0].toFixed(2)}</Title>
          <Title order={4} c={changeFromYesterday > 0 ? 'green' : 'red'}>{changeFromYesterday > 0 && '+'}{changeFromYesterday}({changeFromYesterdayPercent}%)</Title>
        </Flex>
      ) : <Loader />}
      <Tooltip label="Go To Portfolio">
        <ActionIcon variant="subtle" pos='absolute' right={4} top={4} onClick={navigateToPortfolio}>
          <IconLink style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
      {editActionButton}
      {deleteActionButton}
    </Card>
  );
}
