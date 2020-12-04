import React from "react";

class Filter extends React.Component {
  render() {

    setTimeout(() => {
      const splash = document.querySelector('.splash__wrap') as HTMLElement;
      const splashHello = document.querySelector('.splash__hello') as HTMLElement;
      splash.style.top = '-100%';
      splashHello.style.top = '-100%';
    }, 3000)

    return (
      <div className={'splash__wrap'}>
        <div className={'splash__hello'}>
          <p>Hello!</p>
        </div>
        <div className={'splash__circle--00'}></div>
        <svg id="spinner" data-name="layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 446 446">
          <path className="cls-1" d="M445,223A221.83,221.83,0,0,0,223,1V223Z"/>
          <path
            style={{ fill: '#C7E7EB' }}
            d="M309.41,18.45A221.83,221.83,0,0,1,445,223h1C446,99.84,346.16,0,223,0V1A220.54,220.54,0,0,1,309.41,18.45Z"/>
        </svg>
        <div className={'splash__circle--01'}></div>
        <div className={'splash__circle--02'}></div>
      </div>
    )
  }
}

export default Filter;
