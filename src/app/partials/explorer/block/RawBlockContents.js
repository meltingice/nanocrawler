import React, { memo } from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";

export default memo(function RawBlockContents({ block, ...props }) {
  return (
    <div {...props}>
      <h3 className="mb-0">
        <TranslatedMessage id="block.original.title" />
      </h3>
      <p className="text-muted">
        <TranslatedMessage
          id="block.original.desc"
          values={{
            rpcCmd: <span className="text-monospace">blocks_info</span>
          }}
        />
      </p>
      <pre className="text-monospace bg-light rounded p-3">
        <code>{JSON.stringify(block, null, "  ")}</code>
      </pre>
    </div>
  );
});
