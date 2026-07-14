import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../stores/useAuthStore';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

let socketInstance = null;

export const useSocket = () => {
  const { accessToken, user } = useAuthStore();
  const [socket, setSocket] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (accessToken && user) {
      if (!socketInstance) {
        socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
          auth: {
            token: accessToken
          },
          transports: ['websocket']
        });

        socketInstance.on('connect', () => {
          console.log('Connected to real-time server');
        });

        socketInstance.on('notification', (data) => {
          toast.success(`${data.title}: ${data.message}`, { duration: 5000 });
          // If it's an order update, invalidate orders query globally to keep it fresh
          if (data.orderId) {
            queryClient.invalidateQueries(['my-orders']);
          }
        });

        socketInstance.on('disconnect', () => {
          console.log('Disconnected from real-time server');
        });
      }
      setSocket(socketInstance);
    } else {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        setSocket(null);
      }
    }

    return () => {
      // Optional cleanup on unmount if we wanted to fully disconnect on page close, 
      // but usually we keep it alive as long as user is logged in.
    };
  }, [accessToken, user, queryClient]);

  return socket;
};
