import React from 'react';
import axios from 'axios';
import { Text, Card, Title, Flex, ActionIcon, Loader, Table } from '@mantine/core';
import * as d3 from 'd3';

export function PortfolioPage(props) {
  const [values, setValues] = React.useState(null);
  React.useEffect(() => {
    axios.get('/api/portfolios/' + props.portfolio._id + '/value').then((response) => setValues(response.data));
  }, [props.portfolio._id]);

  const [timeSeries, setTimeSeries] = React.useState(null);
  const [stocksValues, setStocksValues] = React.useState(null);
  React.useEffect(() => {
    axios.get('/api/portfolios/' + props.portfolio._id + '/timeSeries').then(({ data }) => {
      const portfolioTimeSeries = (new Array(7).fill(0)).map((_, i) => {
        return props.portfolio.stocks.map((holding) => {
          return data[holding.stock.symbol][i].close * holding.quantity;
        }).reduce((acc, value) => acc + value, 0);
      });
      const stocksValues = props.portfolio.stocks.map((holding) => [holding.stock.symbol, data[holding.stock.symbol][0].close]);
      setStocksValues(Object.fromEntries(stocksValues));
      setTimeSeries(portfolioTimeSeries.map((v, i) => ({ close: v, date: new Date(data[props.portfolio.stocks[0].stock.symbol][i].datetime) })));
    });
  }, [props.portfolio._id]);

  const chart = React.useRef(null);
  const pieChart = React.useRef(null);

  const drawChart = (timeSeries) => {
    const width = 500;
    const height = 300;
    const marginTop = 10;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    const values = Float64Array.from(timeSeries, d => d.close);

    const x = d3.scaleTime()
      .domain(d3.extent(timeSeries, (d, i) => d.date))
      .rangeRound([marginLeft, width - marginRight]);

    const y = d3.scaleLog()
      .domain(d3.extent(values))
      .rangeRound([height - marginBottom - 20, marginTop]);

    const line = d3.line()
      .defined((y, i) => !isNaN(timeSeries[i].date) && !isNaN(y))
      .x((_, i) => x(timeSeries[i].date))
      .y(y);

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height);

    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call(g => g.select(".domain").remove());

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickValues(d3.ticks(...y.domain(), 10)).tickFormat(d => d))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1))
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold"));

    svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .selectAll()
      .data([values])
      .join("path")
      .attr("stroke", "green")
      .attr("d", line);

    return svg.node();
  };

  const drawPieChart = (stocks) => {
    const width = 500;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
      .domain(stocks.map(s => s.stock.symbol))
      .range(d3.schemeCategory10);

    const pie = d3.pie()
      .value(d => d.quantity * stocksValues[d.stock.symbol])
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height);

    const g = svg.selectAll(".arc")
      .data(pie(stocks))
      .join("g")
      .attr("class", "arc")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    g.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.stock.symbol));

    g.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .text(d => d.data.stock.symbol);

    return svg.node();
  }

  React.useEffect(() => {
    if (chart.current && timeSeries && values) {
      chart.current.appendChild(drawChart(timeSeries));
      pieChart.current.appendChild(drawPieChart(props.portfolio.stocks));
    }
  }, [timeSeries, values]);

  const changeFromYesterday = (values?.[0] - values?.[1]).toFixed(2);
  const changeFromYesterdayPercent = ((changeFromYesterday / values?.[1]) * 100).toFixed(2);

  if (!values || !timeSeries) {
    return <Flex align='center' justify='center' flex='1'><Loader /></Flex>;
  }

  return (
    <Flex align='center' flex='1' p='md' direction='column' gap='md'>
      <Title c='gray.9' display='block'>{props.portfolio.name}</Title>
      <Flex wrap='wrap' w='100%' p='md' gap='md'>
        <Card shadow='xs' padding='md' miw='500px' flex={3}>
          <div ref={chart} style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}></div>
        </Card>
        <Card shadow='xs' padding='md' miw='500px' flex={1} display='flex' style={{ alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <Title order={1}>${values?.[0].toFixed(2)}</Title>
          <Title order={4} c={changeFromYesterday > 0 ? 'green' : 'red'}>{changeFromYesterday > 0 && '+'}{changeFromYesterday}({changeFromYesterdayPercent}%)</Title>
          <Text size='xs'>*Relative to the previous trading day</Text>
        </Card>
        <Card shadow='xs' padding='md' miw='500px' flex={1} display='flex'>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Stock</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Value</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {props.portfolio.stocks.map((holding) => (
                <Table.Tr key={holding.stock.symbol}>
                  <Table.Td>{holding.stock.symbol}</Table.Td>
                  <Table.Td>{holding.quantity}</Table.Td>
                  <Table.Td>${(+stocksValues[holding.stock.symbol]).toFixed(2)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
        <Card shadow='xs' padding='md' miw='500px' flex={3}>
          <div ref={pieChart} style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}></div>
        </Card>
      </Flex>
    </Flex>
  );
}
