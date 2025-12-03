

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Screen, SupportMessage } from '../types';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import GlowingButton from '../components/GlowingButton';

const ContactUsScreen: React.FC = () => {
    const { setScreen, user, supportMessages, sendSupportMessage } = useApp();
    const [view, setView] = useState<'list' | 'new' | 'conversation'>('list');
    const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);

    // Form state for new message
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const userMessages = useMemo(() => {
        return supportMessages
            .filter(m => m.userId === user?.id)
            .sort((a, b) => new Date(b.replies[0].date).getTime() - new Date(a.replies[0].date).getTime());
    }, [supportMessages, user]);

    const handleSendMessage = async () => {
        if (subject.trim() && message.trim()) {
            await sendSupportMessage(subject, message);
            setSubject('');
            setMessage('');
            setView('list');
        }
    };

    const handleViewConversation = (msg: SupportMessage) => {
        setSelectedMessage(msg);
        setView('conversation');
    };

    const renderList = () => (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-orbitron">My Messages</h2>
                <GlowingButton onClick={() => setView('new')} className="w-auto py-2 px-4 text-sm">New Message</GlowingButton>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
                {userMessages.length > 0 ? userMessages.map(msg => (
                    <button key={msg.id} onClick={() => handleViewConversation(msg)} className="w-full text-left bg-black/30 p-4 rounded-xl hover:bg-black/40 transition">
                        <div className="flex justify-between items-start">
                             <p className="font-bold text-white truncate pr-4">{msg.subject}</p>
                             <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${msg.status === 'OPEN' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>{msg.status}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Last update: {new Date(msg.replies[msg.replies.length - 1].date).toLocaleString()}</p>
                    </button>
                )) : <p className="text-center text-gray-500 py-8">No messages yet. Create one to get started!</p>}
            </div>
        </>
    );

    const renderNewMessageForm = () => (
        <>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold font-orbitron">New Message</h2>
                 <button onClick={() => setView('list')} className="text-sm text-gray-300 hover:text-white">Cancel</button>
            </div>
            <div className="space-y-4">
                 <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500 transition" />
                 <textarea placeholder="Your message..." value={message} onChange={e => setMessage(e.target.value)} rows={6} className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500 transition"></textarea>
                 <GlowingButton onClick={handleSendMessage} Icon={Send}>Send Message</GlowingButton>
            </div>
        </>
    );

    const renderConversation = () => {
        if (!selectedMessage) return null;
        return (
             <>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold font-orbitron truncate pr-4">{selectedMessage.subject}</h2>
                    <button onClick={() => setView('list')} className="text-sm text-gray-300 hover:text-white">Back to list</button>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto bg-black/20 p-3 rounded-xl">
                    {selectedMessage.replies.map(reply => (
                        <div key={reply.id} className={`flex flex-col ${reply.author === 'USER' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-xs p-3 rounded-2xl ${reply.author === 'USER' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                                <p className="text-sm">{reply.text}</p>
                            </div>
                             <p className="text-xs text-gray-500 mt-1">{new Date(reply.date).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
             </>
        )
    };


    return (
        <div className="pb-10">
            <button onClick={() => setScreen(Screen.HOME)} className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors">
                <ArrowLeft size={20} /> Back to Home
            </button>
            <div className="flex items-center justify-center text-center mb-6">
                 <MessageSquare className="w-10 h-10 mr-4 text-blue-400"/>
                 <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-orbitron">Contact Us</h1>
                    <p className="text-gray-300 text-sm mt-1">We'll get back to you as soon as possible.</p>
                </div>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl">
                {view === 'list' && renderList()}
                {view === 'new' && renderNewMessageForm()}
                {view === 'conversation' && renderConversation()}
            </div>
        </div>
    );
};

export default ContactUsScreen;