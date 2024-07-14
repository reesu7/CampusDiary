import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import {
    CornerDownLeft,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const socket = io('http://localhost:4500'); 

const UserCommunity = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const roomId = 'your-room-id'; 
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/community/getMessages/${roomId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
        socket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off('message');
        };
    }, [roomId]);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/community/sendMessage', { content: message,roomid: roomId });
            console.log('Message submitted:', response.data);
            setMessage(''); 
        } catch (error) {
            console.error('Error submitting message:', error);
        }
    };

    return (
        <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge variant="outline" className="absolute right-3 top-3">
                Public Chat
            </Badge>
            <div className="flex-1 overflow-y-auto">
                {/*messages && messages.map((msg, index) => (
                    <div key={index} className="p-2">
                        <strong>{msg.senderId}</strong>: {msg.content}
                    </div>
                ))*/}
            </div>
            <form
                onSubmit={handleSubmit}
                className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            >
                <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                    value={message}
                    onChange={handleMessageChange}
                />
                <div className="flex items-center p-3 pt-0">
                    <Button type="submit" size="sm" className="ml-auto gap-1.5">
                        Send Message
                        <CornerDownLeft className="size-3.5" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default UserCommunity;
