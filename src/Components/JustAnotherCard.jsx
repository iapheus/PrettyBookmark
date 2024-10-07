import React, { useState } from 'react';
import { FiEdit, FiShare } from 'react-icons/fi';
import { MdDownloadDone } from 'react-icons/md';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function JustAnotherCard({ bookmark, isInCollection = false, collectionId = null }) {
    const [isEdit, setIsEdit] = useState(false);
    const [editedTitle, setEditedTitle] = useState(bookmark.title);
    const [editedDescription, setEditedDescription] = useState(bookmark.description);
    const [editedUrl, setEditedUrl] = useState(bookmark.url);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createdAtDate = bookmark.createdAt?.seconds
        ? new Date(bookmark.createdAt.seconds * 1000 + (bookmark.createdAt.nanoseconds || 0) / 1000000)
        : new Date(bookmark.createdAt);

        const handleSave = async () => {
            if (!editedTitle || !editedDescription || !editedUrl) {
                setError('All fields must be filled out.');
                return;
            }
        
            try {
                const uid = sessionStorage.getItem('uid');
                if (!uid) {
                    setError('User ID not found');
                    return;
                }
                
                let bookmarkRef;
        
                if (isInCollection && collectionId) {
                    
                    const bookmarksRef = collection(db, 'users', uid, 'collections', collectionId, 'bookmarks');
                    const bookmarkQuery = query(bookmarksRef, where('id', '==', bookmark.id));
                    const querySnapshot = await getDocs(bookmarkQuery);
        
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach(async (doc) => {
                            await updateDoc(doc.ref, {
                                title: editedTitle,
                                description: editedDescription,
                                url: editedUrl,
                                updatedAt: new Date().toISOString(),
                            });
                        });
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 3000);
                        setIsEdit(false);
                        setError(null);
                    } else {
                        setError('Bookmark not found in the collection.');
                    }
                } else {
                    bookmarkRef = doc(db, 'users', uid, 'bookmarks', bookmark.id);
        
                    const docSnap = await getDoc(bookmarkRef);
                    if (!docSnap.exists()) {
                        setError('Bookmark not found');
                        return;
                    }
        
                    await updateDoc(bookmarkRef, {
                        title: editedTitle,
                        description: editedDescription,
                        url: editedUrl,
                        updatedAt: new Date().toISOString(),
                    });
        
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 3000);
                    setIsEdit(false);
                    setError(null);
                }
            } catch (err) {
                console.error('Error updating bookmark:', err);
                setError('Failed to update bookmark');
            }
        };

    const handleCancel = () => {
        setEditedTitle(bookmark.title);
        setEditedDescription(bookmark.description);
        setEditedUrl(bookmark.url);
        setIsEdit(false);
        setError(null);
    };

    return (
        <div className="bg-[#E1EAEE] dark:bg-[#111827] shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
                {isEdit ? (
                    <>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="text"
                                className="text-xl font-bold text-black dark:text-white bg-transparent border-2 rounded-md w-full"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                placeholder="Title"
                                aria-label="Title"
                            />
                            <input
                                type="text"
                                className="text-black dark:text-white bg-transparent border-2 rounded-md w-full"
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                placeholder="Description"
                                aria-label="Description"
                            />
                            <input
                                type="text"
                                className="text-blue-500 bg-transparent hover:underline border-2 rounded-md w-full"
                                value={editedUrl}
                                onChange={(e) => setEditedUrl(e.target.value)}
                                placeholder="URL"
                                aria-label="URL"
                            />
                            <p className="text-sm text-gray-500">
                                Added on: {createdAtDate.toLocaleDateString()}
                            </p>
                        </div>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={handleSave}
                                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors"
                            >
                                <MdDownloadDone size={24} />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {success && (
                            <p className="text-green-500 text-sm mb-2 transition-opacity duration-500">
                                Bookmark updated successfully!
                            </p>
                        )}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col space-y-2">
                                <h2 className="text-xl text-black dark:text-white font-bold">{bookmark.title}</h2>
                                <p className="text-black dark:text-white">{bookmark.description}</p>
                                <a
                                    href={'https://' + bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {bookmark.url}
                                </a>
                                <div className="text-sm text-black dark:text-white  mt-2">
                                    Added on: {createdAtDate.toLocaleDateString()}
                                    {bookmark.updatedAt && (
                                        <p className="text-sm text-black dark:text-white mt-1">
                                            Updated on: {new Date(bookmark.updatedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <button
                                    onClick={() => setIsEdit(true)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors"
                                >
                                    <FiEdit size={20} />
                                </button>
                                <button
                                    onClick={() => window.open('https://' + bookmark.url, '_blank')}
                                    className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 transition-colors"
                                >
                                    <FiShare size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default JustAnotherCard;
