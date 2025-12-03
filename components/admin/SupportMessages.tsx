import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportMessage } from '../../types';
import { Send } from 'lucide-react';

const SupportMessages: React.FC = () => {
    const { supportMessages, sendAdminReply } = useApp();
    const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
    const [replyText, setReplyText] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');

    const filteredMessages = useMemo(() => {
        let messages = [...supportMessages].sort((a, b) => new Date(b.replies[0].date).getTime() - new Date(a.replies[0].date).getTime());
        if (statusFilter === 'ALL') {
            return messages;
        }
        return messages.filter(m => m.status === statusFilter);
    }, [supportMessages, statusFilter]);

    const handleSendReply = async () => {
        if (selectedMessage && replyText.trim()) {
            await sendAdminReply(selectedMessage.id, replyText);
            setReplyText('');
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 h-[75vh]">
            {/* Message List */}
            <div className="w-full md:w-1/3 flex flex-col bg-black/20 p-3 rounded-xl">
                <div className="flex gap-2 mb-2">
                    <button onClick={() => setStatusFilter('ALL')} className={`flex-1 text-sm py-2 rounded-lg ${statusFilter === 'ALL' ? 'bg-blue-600' : 'bg-black/30'}`}>All</button>
                    <button onClick={() => setStatusFilter('OPEN')} className={`flex-1 text-sm py-2 rounded-lg ${statusFilter === 'OPEN' ? 'bg-blue-600' : 'bg-black/30'}`}>Open</button>
                    <button onClick={() => setStatusFilter('CLOSED')} className={`flex-1 text-sm py-2 rounded-lg ${statusFilter === 'CLOSED' ? 'bg-blue-600' : 'bg-black/30'}`}>Closed</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {filteredMessages.map(msg => (
                        <button 
                            key={msg.id} 
                            onClick={() => setSelectedMessage(msg)}
                            className={`w-full text-left p-3 rounded-lg transition ${selectedMessage?.id === msg.id ? 'bg-blue-800/50' : 'bg-black/30 hover:bg-black/50'}`}
                        >
                            <div className="flex justify-between items-start">
                                <p className="font-bold text-white truncate pr-2">{msg.subject}</p>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${msg.status === 'OPEN' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {msg.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">From: {msg.userName}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Conversation View */}
            <div className="w-full md:w-2/3 flex flex-col bg-black/20 p-3 rounded-xl">
                {selectedMessage ? (
                    <>
                        <div className="p-2 border-b border-gray-700 mb-2">
                            <h3 className="font-bold text-lg">{selectedMessage.subject}</h3>
                            <p className="text-sm text-gray-400">User: {selectedMessage.userName} ({selectedMessage.userId})</p>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 p-2">
                            {selectedMessage.replies.map(reply => (
                                <div key={reply.id} className={`flex flex-col ${reply.author === 'ADMIN' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-md p-3 rounded-2xl ${reply.author === 'ADMIN' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                                        <p className="text-sm">{reply.text}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(reply.date).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 p-2 border-t border-gray-700 flex gap-2">
                            <textarea 
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Type your reply..."
                                rows={2}
                                className="flex-1 bg-black/40 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button onClick={handleSendReply} className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg">
                                <Send size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Select a message to view the conversation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportMessages;
