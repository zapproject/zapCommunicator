import { useEffect, useRef } from 'react';
import type SimplePeer from 'simple-peer';

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  from: string;
  to: string;
  data: any;
}

const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

export function useSignaling(
  localAddress: string,
  remoteAddress: string,
  peer: SimplePeer.Instance | null,
  onSignalingError: (error: Error) => void
) {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = () => {
    if (!peer || !localAddress || !remoteAddress) return;

    try {
      // Use secure WebSocket with authentication
      const wsUrl = `wss://your-signaling-server.com/ws?address=${encodeURIComponent(localAddress)}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        reconnectAttempts.current = 0;
        console.log('WebSocket connected');
      };

      ws.current.onclose = (event) => {
        if (event.code === 3000) {
          onSignalingError(new Error('Authentication failed. Please check your wallet connection.'));
          return;
        }

        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current++;
          reconnectTimeout.current = setTimeout(connect, RECONNECT_DELAY);
        } else {
          onSignalingError(new Error('Failed to connect to signaling server after multiple attempts.'));
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws.current?.close();
      };

      ws.current.onmessage = (event) => {
        try {
          const message: SignalingMessage = JSON.parse(event.data);
          
          if (message.from === remoteAddress) {
            if (message.type === 'offer' || message.type === 'answer') {
              peer.signal(message.data);
            } else if (message.type === 'ice-candidate') {
              peer.signal(message.data);
            }
          }
        } catch (error) {
          console.error('Failed to process signaling message:', error);
          onSignalingError(new Error('Failed to process signaling message'));
        }
      };

      // Handle peer signaling
      peer.on('signal', (data) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({
            type: peer.initiator ? 'offer' : 'answer',
            from: localAddress,
            to: remoteAddress,
            data
          }));
        }
      });
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      onSignalingError(new Error('Failed to establish signaling connection'));
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      ws.current?.close();
    };
  }, [localAddress, remoteAddress, peer]);

  return ws.current;
}