import React, { useState } from 'react';
import { WagmiConfig } from 'wagmi';
import { Phone } from 'lucide-react';
import { ZapBalance } from './components/ZapBalance';
import { AddressInput } from './components/AddressInput';
import { VideoCall } from './components/VideoCall';
import { CallReceiver } from './components/CallReceiver';
import { wagmiConfig } from './config/web3';

function ZapCommunicator() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isInCall, setIsInCall] = useState(false);

  const startCall = () => {
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
    setRecipientAddress('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <Phone className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Zap Communicator</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ZapBalance />
            <w3m-button />
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-8">
          {isInCall && recipientAddress ? (
            <VideoCall
              remoteAddress={recipientAddress}
              onEndCall={endCall}
            />
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-6">Start Communication</h2>
              <AddressInput
                value={recipientAddress}
                onChange={setRecipientAddress}
                onSubmit={startCall}
              />
              <button
                onClick={startCall}
                disabled={!recipientAddress}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed transition-colors py-3 rounded-lg font-medium"
              >
                Start Call
              </button>
            </div>
          )}
        </div>
      </div>
      <CallReceiver />
    </div>
  );
}

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ZapCommunicator />
    </WagmiConfig>
  );
}

export default App;