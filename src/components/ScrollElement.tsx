import React from "react";

class ScrollElement extends React.Component<{ height: number }> {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    window.addEventListener('scroll', () => {
      // this.props.height = Number(document.body.scrollHeight) - Number(window.innerHeight);
    })
  }

  render() {
    return (
      <div className={'scroll__element'}></div>
    )
  }
}

export default ScrollElement;
