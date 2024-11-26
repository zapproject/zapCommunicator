import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { Video, VideoOff, PhoneOff, Mic, MicOff } from 'lucide-react';
import { useSignaling } from '../hooks/useSignaling';
import { useAccount } from 'wagmi';

interface VideoCallProps {
  remoteAddress: string;
  onEndCall: () => void;
}

export function VideoCall({ remoteAddress, onEndCall }: VideoCallProps) {
  const { address } = useAccount();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);

  useSignaling(address!, remoteAddress, peerRef.current, (error) => {
    setError('Signaling error: ' + error.message);
  });

  useEffect(() => {
    async function setupMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        initializePeer(stream);
      } catch (err) {
        setError('Failed to access camera/microphone');
      }
    }
    setupMedia();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peerRef.current?.destroy();
    };
  }, []);

  const initializePeer = (stream: MediaStream) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('stream', remoteStream => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    peer.on('error', err => {
      setError('Connection error: ' + err.message);
    });

    peerRef.current = peer;
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const handleEndCall = () => {
    localStream?.getTracks().forEach(track => track.stop());
    peerRef.current?.destroy();
    onEndCall();
  };

  if (!address) return null;

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="relative aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover rounded-lg bg-black/50"
          />
          <div className="absolute bottom-4 left-4">
            <p className="text-white text-sm bg-black/50 px-2 py-1 rounded">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
        </div>
        <div className="relative aspect-video">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg bg-black/50"
          />
          <div className="absolute bottom-4 left-4">
            <p className="text-white text-sm bg-black/50 px-2 py-1 rounded">
              {remoteAddress.slice(0, 6)}...{remoteAddress.slice(-4)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleVideo}
          className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full transition-colors"
        >
          {isVideoEnabled ? (
            <Video className="w-6 h-6" />
          ) : (
            <VideoOff className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={toggleAudio}
          className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full transition-colors"
        >
          {isAudioEnabled ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={handleEndCall}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}