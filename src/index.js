import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/components/App/App';

if (!String.prototype.format) { String.prototype.format = function() { var args = arguments; return this.replace(/{(\d+)}/g, function(match, number) { return typeof args[number] != 'undefined' ? args[number] : match ; }); }; }

ReactDOM.render(
  <App />,
  document.getElementById(`${process.env.ROOT}`),
);
