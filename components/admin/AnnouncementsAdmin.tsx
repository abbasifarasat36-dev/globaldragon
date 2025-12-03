
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

const AnnouncementsAdmin: React.FC = () => {
    const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const sortedAnnouncements = [...announcements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('Title and content cannot be empty.');
            return;
        }

        if (editingId) {
            await updateAnnouncement(editingId, title, content);
            alert('Announcement updated!');
        } else {
            await addAnnouncement(title, content);
            alert('Announcement posted!');
        }
        
        resetForm();
    };

    const handleEdit = (announcement: Announcement) => {
        setEditingId(announcement.id);
        setTitle(announcement.title);
        setContent(announcement.content);
        window.scrollTo(0, 0); // Scroll to top to see the form
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            await deleteAnnouncement(id);
            if (editingId === id) {
                resetForm();
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white font-orbitron">Manage Announcements</h2>
            
            <form onSubmit={handleFormSubmit} className="bg-black/20 p-4 rounded-xl space-y-4">
                <h3 className="font-semibold text-lg text-blue-300 font-orbitron flex items-center gap-2">
                    <PlusCircle size={22} />
                    {editingId ? 'Edit Announcement' : 'Create New Announcement'}
                </h3>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-black/40 p-2 rounded-lg"
                />
                <textarea
                    placeholder="Content..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={5}
                    className="w-full bg-black/40 p-2 rounded-lg"
                />
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 p-2 rounded-lg font-bold">
                        {editingId ? 'Update Announcement' : 'Post Announcement'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-500 p-2 rounded-lg font-bold">
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <div className="space-y-3">
                <h3 className="font-semibold text-lg text-white font-orbitron">Posted Announcements</h3>
                {sortedAnnouncements.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No announcements posted yet.</p>
                ) : (
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto p-1">
                        {sortedAnnouncements.map(anno => (
                            <div key={anno.id} className="p-4 rounded-xl bg-black/40">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold">{anno.title}</p>
                                        <p className="text-xs text-gray-500">{new Date(anno.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(anno)} className="p-2 bg-blue-600/20 hover:bg-blue-600/50 rounded-lg"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(anno.id)} className="p-2 bg-red-600/20 hover:bg-red-600/50 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">{anno.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsAdmin;