import React from "react";
import ConfigContext from "./ConfigContext";
import Client from "./Client";

export default function injectClient(WrappedComponent) {
  return function ClientComponent(props) {
    return (
      <ConfigContext.Consumer>
        {config => {
          if (config)
            return (
              <WrappedComponent
                {...props}
                config={config}
                client={new Client(config)}
                ticker={config.ticker}
              />
            );
        }}
      </ConfigContext.Consumer>
    );
  };
}
