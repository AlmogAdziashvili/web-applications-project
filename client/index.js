import React from 'react';

import { createRoot } from 'react-dom/client';

import Main from './environment/Main';
import '@mantine/core/styles.css';

createRoot(document.getElementById('app'))
  .render(<Main />);
