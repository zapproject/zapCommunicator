import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { VideoCall } from './VideoCall';

export function CallReceiver() {
  const { address } = useAccount();
  const [incomingCall, setIncomingCall] = useState<{
    from: string;
    accepted: boolean;
  } | null>(null);

  useEffect(() => {
    if (!address) return;

    // Listen for incoming calls via WebSocket
    const ws = new WebSocket(`wss://your-signaling-server.com/ws?address=${address}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'incoming-call') {
        setIncomingCall({ from: message.from, accepted: false });
      }
    };

    return () => ws.close();
  }, [address]);

  const acceptCall = () => {
    if (incomingCall) {
      setIncomingCall({ ...incomingCall, accepted: true });
    }
  };

  const rejectCall = () => {
    setIncomingCall(null);
  };

  if (!incomingCall) return null;

  if (incomingCall.accepted) {
    return (
      <VideoCall
        remoteAddress={incomingCall.from}
        onEndCall={() => setIncomingCall(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">
          Incoming call from {incomingCall.from.slice(0, 6)}...{incomingCall.from.slice(-4)}
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={acceptCall}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
          >
            Accept
          </button>
          <button
            onClick={rejectCall}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}