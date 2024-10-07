import React, { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { MdDownloadDone } from 'react-icons/md';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

function BookmarkCard({ bookmark, isInCollection = false, collectionId = null }) {
    const [isEdit, setIsEdit] = useState(false);
    const [editedTitle, setEditedTitle] = useState(bookmark.title);
    const [editedDescription, setEditedDescription] = useState(bookmark.description);
    const [editedUrl, setEditedUrl] = useState(bookmark.url);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    // console.log(bookmark.id);
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
        <div>
            {isEdit ? (
                <li className="dark:bg-[#111827] shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4">
                        <div className="flex items-center">
                            <input
                                type="text"
                                className="bg-transparent dark:text-white text-xl font-bold text-gray-800 border-2 rounded-md w-full"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                placeholder="Title"
                                aria-label="Title"
                            />
                            <MdDownloadDone
                                onClick={handleSave}
                                className="ml-2 cursor-pointer text-green-500"
                                size={28}
                            />
                        </div>
                        <input
                            type="text"
                            className="bg-transparent dark:text-white text-gray-600 mt-2 border-2 rounded-md w-full"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            placeholder="Description"
                            aria-label="Description"
                        />
                        <input
                            type="text"
                            className="bg-transparent text-blue-500 hover:underline mt-2 block border-2 rounded-md w-full"
                            value={editedUrl}
                            onChange={(e) => setEditedUrl(e.target.value)}
                            placeholder="URL"
                            aria-label="URL"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Added on: {createdAtDate.toLocaleDateString()}
                        </p>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={handleCancel}
                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </li>
            ) : (
                <li className="dark:bg-[#111827] shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4">
                        {success && (
                            <p className="text-green-500 text-sm mb-2 transition-opacity duration-500">
                                Bookmark updated successfully!
                            </p>
                        )}
                        <div className="flex">
                            <h2 className="dark:text-white text-xl font-bold text-gray-800">{editedTitle}</h2>
                            <FiEdit
                                onClick={() => setIsEdit(true)}
                                className="dark:text-white mt-2 ml-auto cursor-pointer"
                            />
                        </div>
                        <p className="dark:text-white text-gray-600 mt-2">{editedDescription}</p>
                        <a
                            href={'https://' + editedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline mt-2 block"
                        >
                            {editedUrl}
                        </a>
                        <div className="flex space-x-5">
                            <p className="text-sm text-gray-500 mt-2">
                                Added on: {createdAtDate.toLocaleDateString()}
                            </p>
                            {bookmark.updatedAt && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Updated on: {new Date(bookmark.updatedAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                </li>
            )}
        </div>
    );
}

export default BookmarkCard;
