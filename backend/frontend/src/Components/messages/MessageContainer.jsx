import React, { useEffect } from 'react';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { TiMessages } from 'react-icons/ti';
import useConversation from '../../zustand/useConversation';
import { useAuthContext } from '../../Context/AuthContext';

function MessageContainer() {
    const { selectedConversation, setSelectedConversation } = useConversation();

    useEffect(() => {
        return () => {
            if (setSelectedConversation) setSelectedConversation(null);
        };
    }, [setSelectedConversation]);

    return (
        <div className='md:min-w-[450px] flex flex-col'>
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    <div className='bg-red-950 px-4 py-2 mb-2 flex gap-2'>
                        <span className='label-text'>To</span>
                        <span className='text-red-700 font-bold'>{selectedConversation?.fullname}</span>
                    </div>
                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    );
}

export default MessageContainer;

const NoChatSelected = () => {
    const { authUser } = useAuthContext();

    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 👏 {authUser?.fullname || "User"} </p>
                <p>Select a chat to start messaging</p>
                <TiMessages className='text-3xl md:text-6xl text-center' />
            </div>
        </div>
    );
};
