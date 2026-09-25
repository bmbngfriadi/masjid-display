import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/masjid/api';
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || '/masjid/socket.io';

export default function useDevice() {
  const [deviceToken, setDeviceToken] = useState(localStorage.getItem('masjid_device_token'));
  const [pairingData, setPairingData] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!deviceToken) {
      registerDevice();
    } else {
      connectSocket(deviceToken);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [deviceToken]);

  const registerDevice = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/devices/register`);
      setPairingData(res.data);
      const newDeviceId = res.data.deviceId;
      
      // Temporary socket to listen for pairing event
      const tempSocket = io(window.location.origin, {
        path: SOCKET_PATH,
        query: { deviceId: newDeviceId }
      });

      const handlePaired = (data) => {
        if (data.token) {
          localStorage.setItem('masjid_device_token', data.token);
          window.location.reload();
        }
      };

      tempSocket.on('device:paired', handlePaired);

      // Bulletproof Fallback: Poll the backend every 5 seconds in case WebSocket fails
      const pollInterval = setInterval(async () => {
        try {
          const checkRes = await axios.get(`${API_BASE_URL}/devices/check-pairing/${newDeviceId}`);
          if (checkRes.data.isPaired && checkRes.data.token) {
            clearInterval(pollInterval);
            handlePaired({ token: checkRes.data.token });
          }
        } catch (e) {
          // Ignore errors during polling
        }
      }, 5000);

      // Clean up polling if component unmounts
      return () => {
        clearInterval(pollInterval);
        tempSocket.disconnect();
      };

    } catch (err) {
      console.error('Failed to register device:', err);
    }
  };

  const connectSocket = (token) => {
    const newSocket = io(window.location.origin, {
      path: SOCKET_PATH,
      query: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server via Socket.IO');
      
      // Ping the server every minute to keep online status active
      const pingInterval = setInterval(() => {
        if (newSocket.connected) {
          newSocket.emit('device:ping');
        }
      }, 60000);

      newSocket.on('disconnect', () => {
        clearInterval(pingInterval);
      });
      
      newSocket.on('device:unpaired', () => {
        console.log('Device was unpaired from admin panel!');
        localStorage.removeItem('masjid_device_token');
        window.location.reload();
      });
      
      newSocket.on('device:hard_refresh', () => {
        console.log('Remote hard refresh triggered from admin panel');
        window.location.reload();
      });
    });

    setSocket(newSocket);
  };

  return { deviceToken, pairingData, socket };
}
