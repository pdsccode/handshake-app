import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Prediction from '@/pages/Prediction/Prediction';
import NavigationBar from '@/modules/NavigationBar/NavigationBar';

export default function Exchange(props) {
  return (
    <div className="Exchange">
      <NavigationBar />
      <Prediction />
    </div>
  );
}
