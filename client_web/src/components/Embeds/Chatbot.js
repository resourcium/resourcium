import React from 'react';

import ChatbotEmbed from './ChatbotEmbed';

export default function Chatbot(){
    return(
        <>
            <p>Welcome to the QnAbot V1</p>
            <p>Got questions about university and more, ask here!</p>
            <h5>Note: The QnAbot is currently in beta and has limited features</h5>
            <ChatbotEmbed />
        </>
    );
}
