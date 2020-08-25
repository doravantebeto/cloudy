import React, {useEffect, useState} from 'react';
import {Container, Title} from './styles';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {Alert} from 'react-native';

import api from '../../services/api';

import Today from '../../components/Today';
import DayReport from '../../components/DayReport';
import key from '../../config/api';

import IWeatherResponse from '../../models/IOneCallApiResponse';

const Home: React.FC | any = () => {
  const [weather, setWeather] = useState<IWeatherResponse | null>();
  const [location, setLocation] = useState<GeolocationResponse>();

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);

        api
          .get<IWeatherResponse | null>(
            `/onecall?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&appid=${key}`,
          )
          .then((response) => {
            setWeather(response.data);
          });
      },
      (error) => {
        Alert.alert('Location error', `${(error.code, error.message)}`);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [location]);

  return (
    !!weather && (
      <Container>
        <Title>Cloudy</Title>
        <Today weather={weather} />
        <DayReport weather={weather} />
      </Container>
    )
  );
};

export default Home;
