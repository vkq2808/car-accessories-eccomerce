import React from 'react';

const ServerClosed = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Server Closed</h1>
      <p className="text-lg mb-2">We apologize for the inconvenience, but our server is currently closed.</p>
      <p className="text-lg">Please try again later.</p>
    </div>
  );
};

export default ServerClosed;