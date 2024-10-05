import React from 'react';
import axios from 'axios';
import { Flex, getGradient, useMantineTheme, Loader, Title, Card, Text } from '@mantine/core';
import { Context } from '../../context';
import { useParams } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { APIProvider, Map, } from '@vis.gl/react-google-maps';
import * as d3 from 'd3';

export default function Stock() {
  const user = React.useContext(Context);
  const theme = useMantineTheme();
  const backgroundGradient = getGradient({ deg: 45, from: 'teal.2', to: 'gray.2' }, theme);
  const { symbol } = useParams();
  const [stock, setStock] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const [values, setValues] = React.useState(null);
  const [timeSeries, setTimeSeries] = React.useState(null);

  React.useEffect(() => {
    axios.get('/stocks/' + symbol).then((response) => setStock(response.data));
    axios.get(`/stocks/${symbol}/timeSeries`).then(({ data: { timeSeries } }) => {
      setValues([timeSeries[0].close, timeSeries[1].close].map(Number));
      setTimeSeries(timeSeries.map(({ datetime, close }) => ({ date: new Date(datetime), close: Number(close) })));
      
    });
  }, [symbol]);

  React.useEffect(() => {
    if (stock && stock.location) {
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: stock.location,
          key: 'AIzaSyBI9yK2C9yKYYHR_qiCsi2dSDrNi1pxaRE',
        },
      }).then((response) => {
        if (response.data.results.length > 0) {
          const location = response.data.results[0].geometry.location;
          setLocation(location);
        }
      });
    }
  }, [stock]);

  const chart = React.useRef(null);

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

  React.useEffect(() => {
    if (chart.current && timeSeries && values) {
      chart.current.appendChild(drawChart(timeSeries));
    }
  }, [timeSeries, values]);
  const changeFromYesterday = (values?.[0] - values?.[1]).toFixed(2);
  const changeFromYesterdayPercent = ((changeFromYesterday / values?.[1]) * 100).toFixed(2);

  if (!values || !timeSeries) {
    return <Flex align='center' justify='center' flex='1'><Loader /></Flex>;
  }

  return (
    <Flex flex='1' bg={backgroundGradient}>
      <Navbar />
      <Flex align='center' flex='1' p='md' direction='column' gap='md'>
        <Title c='gray.9' display='block'>{stock?.name}</Title>
        <Flex wrap='wrap' w='100%' p='md' gap='md'>
          <Card shadow='xs' padding='md' miw='500px' flex={3}>
            <div ref={chart} style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}></div>
          </Card>
          <Card shadow='xs' padding='md' miw='500px' flex={1} display='flex' style={{ alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Title order={1}>${values?.[0].toFixed(2)}</Title>
            <Title order={4} c={changeFromYesterday > 0 ? 'green' : 'red'}>{changeFromYesterday > 0 && '+'}{changeFromYesterday}({changeFromYesterdayPercent}%)</Title>
            <Text size='xs'>*Relative to the previous trading day</Text>
          </Card>
          <Card shadow='xs' miw='500px' flex={3}>
            <APIProvider apiKey='AIzaSyBI9yK2C9yKYYHR_qiCsi2dSDrNi1pxaRE'>
              {location && <Map
                style={{ width: '100%', height: '400px' }}
                defaultCenter={location}
                defaultZoom={10}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
              />}
            </APIProvider>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  );
}
