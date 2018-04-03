import React from 'react'
import ConfigContext from './ConfigContext'

export default class ConfigProvider extends React.Component {
  state = { config: null }

  async componentWillMount() {
    const resp = await fetch('/client-config.json');
    const config = await resp.json();
    this.setState({ config });
  }

  render() {
    const { config } = this.state;

    return (
      <ConfigContext.Provider value={config}>
        {this.props.children}
      </ConfigContext.Provider>
    )
  }
}
