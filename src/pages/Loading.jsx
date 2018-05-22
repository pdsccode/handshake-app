import React from 'react';

class Loading extends React.PureComponent {
  render() {
    return (
      <div className="content-loading">
        <div className="content-header-container">
          <h1 className="content-header"><span></span></h1>
        </div>
        {/* <p></p>
        <p></p> */}
        <p></p>
        <p className="last"></p>
      </div>
    );
  }
}

export default Loading;
