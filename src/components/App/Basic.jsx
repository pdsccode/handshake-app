import React from 'react';
import { hot } from 'react-hot-loader';
import App from '@/components/App/App';

class Basic extends React.Component {
  render() {
    return <App />;
  }
}

export default process.env.NINJA_isProduction ? Basic : hot(module)(Basic);
