import React from 'react';
import axios from 'axios';
import { Flex, getGradient, useMantineTheme } from '@mantine/core';
import { Context } from '../../context';
import { useParams } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { APIProvider, Map, } from '@vis.gl/react-google-maps';

export default function Stock() {
  const user = React.useContext(Context);
  const theme = useMantineTheme();
  const backgroundGradient = getGradient({ deg: 45, from: 'teal.2', to: 'gray.2' }, theme);
  const { symbol } = useParams();
  const [stock, setStock] = React.useState(null);
  const [location, setLocation] = React.useState(null);

  React.useEffect(() => {
    axios.get('/stocks/' + symbol).then((response) => setStock(response.data));
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

  return (
    <Flex flex='1' bg={backgroundGradient}>
      <Navbar />
      <APIProvider apiKey='AIzaSyBI9yK2C9yKYYHR_qiCsi2dSDrNi1pxaRE'>
        {location && <Map
          style={{ width: '400px', height: '300px' }}
          defaultCenter={location}
          defaultZoom={10}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        />}
      </APIProvider>
    </Flex >
  );
}
