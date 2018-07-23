import React from 'react';
import Prediction from '@/pages/Prediction/Prediction';
import NavigationBar from '@/modules/NavigationBar/NavigationBar';

export default function Exchange() {
  return (
    <div className="Exchange">
      <NavigationBar />
      <Prediction />
    </div>
  );
}
