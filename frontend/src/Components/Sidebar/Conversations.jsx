import React from 'react'
import Conversation from './Conversation'
import useGetConversations from '../../hooks/useGetConversations'

function Conversations() {
  const { loading, conversations } = useGetConversations();
  console.log("CONVERSATIONS:", conversations);

  return (
    <div className='py-2 flex flex-col overflow-hidden'>
      {conversations.map((conversation, index) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={index === conversations.length - 1}
        />
      ))}

      {loading && <span className='loading loading-spinner mx-auto'></span>}
    </div>
  );
}

export default Conversations;
