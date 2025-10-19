// socketContext.tsx
import { BASE_URL } from '@/api';
import { createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const socket = io(BASE_URL); // Replace with actual URL

// Socket Provider Component
export const SocketProvider: React.FC = ({ children }: any) => {

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
