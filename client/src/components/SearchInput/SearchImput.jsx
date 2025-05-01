import React, { useEffect, useRef } from "react";

export const SearchInput = React.memo(({ value, onChange }) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
  }, [value]);

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={onChange}
      style={{
        padding: "10px",
        fontSize: "16px",
      }}
    />
  );
});
