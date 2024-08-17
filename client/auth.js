import React from 'react';

import { createRoot } from 'react-dom/client';

import Auth from './environment/Auth';
import '@mantine/core/styles.css';

createRoot(document.getElementById('app'))
  .render(<Auth />);
