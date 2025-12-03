
import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Megaphone } from 'lucide-react';

const AnnouncementsModal: React.FC = () => {
    const { announcements, setAnnouncementsModalOpen } = useApp();

    const sortedAnnouncements = [...announcements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setAnnouncementsModalOpen(false)}
        >
            <div 
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-blue-500/30 rounded-2xl w-full max-w-md h-[80vh] flex flex-col shadow-2xl shadow-blue-500/20 animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-blue-500/20">
                    <div className="flex items-center gap-3">
                        <Megaphone className="text-blue-400" size={24} />
                        <h2 className="text-xl font-bold font-orbitron text-white">Announcements</h2>
                    </div>
                    <button onClick={() => setAnnouncementsModalOpen(false)} className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors">
                        <X size={20} />
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {sortedAnnouncements.length > 0 ? (
                        sortedAnnouncements.map(anno => (
                            <div key={anno.id} className="bg-black/30 p-4 rounded-lg border-l-4 border-blue-400">
                                <h3 className="font-bold text-white mb-1">{anno.title}</h3>
                                <p className="text-sm text-gray-300 whitespace-pre-wrap">{anno.content}</p>
                                <p className="text-xs text-gray-500 mt-2 text-right">{new Date(anno.createdAt).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 pt-10">
                            <p>No announcements yet.</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default AnnouncementsModal;