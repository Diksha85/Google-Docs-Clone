import React from "react";

export default function ConnectionStatus({ isConnected }) {
  if (isConnected) return null;
  return (
    <div style={{ color: "orange", marginBottom: "10px" }}>
      Disconnected. Trying to reconnect...
    </div>
  );
}
