import React from "react";

export default React.memo(function MonKey({ account, ...props }) {
  return (
    <img
      {...props}
      src={`https://bananomonkeys.herokuapp.com/image?address=${account}`}
    />
  );
});
