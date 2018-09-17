import React from "react";
import { FormattedMessage } from "react-intl";
import defaults from "../translations/en.json";

function TranslatedMessage(props) {
  return <FormattedMessage {...props} defaultMessage={defaults[props.id]} />;
}

export { TranslatedMessage };
