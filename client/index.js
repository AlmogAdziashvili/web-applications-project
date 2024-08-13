import React from 'react';

import { createRoot } from 'react-dom/client';

import Main from './components/environment/Main';

createRoot(document.getElementById('app'))
  .render(<Main />);
