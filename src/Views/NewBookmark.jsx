import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

function BookmarkComponent() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSaveBookmark = async () => {
        if (!title || !description || !url) {
            setError('All fields must be filled out.');
            return;
        }

        try {
            await addDoc(collection(db, 'users', sessionStorage.getItem('uid'), 'bookmarks'), {
                title,
                description,
                url,
                createdAt: new Date().toISOString(),
            });

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setTitle('');
            setDescription('');
            setUrl('');
            setError(null);
        } catch (err) {
            console.error('Error adding bookmark:', err);
            setError('Failed to save bookmark');
        }
    };

    return (
        <div className="bg-transparent p-6 shadow-md rounded-md border-2 border-gray-300">
            <h2 className="text-3xl font-bold underline text-center text-blue-600 mb-4">Bookmark</h2>
            {success && <p className="text-green-500 mt-2">Bookmark saved successfully!</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="border-2 border-gray-300 bg-transparent rounded-md w-full mt-2 p-2"
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="border-2 border-gray-300 bg-transparent rounded-md w-full mt-2 p-2"
            />
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL"
                className="border-2 border-gray-300 bg-transparent rounded-md w-full mt-2 p-2"
            />
            <button
                onClick={handleSaveBookmark}
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600"
            >
                Save
            </button>
        </div>
    );
}

function CollectionComponent() {
    const [collectionName, setCollectionName] = useState('');
    const [collectionDescription, setCollectionDescription] = useState('');
    const [bookmarks, setBookmarks] = useState([]);
    const [selectedBookmarks, setSelectedBookmarks] = useState([]);
    const [isPublic, setIsPublic] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const bookmarkDocs = await getDocs(collection(db, 'users', sessionStorage.getItem('uid'), 'bookmarks'));
                setBookmarks(bookmarkDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) {
                console.error('Error fetching bookmarks:', err);
            }
        };
        fetchBookmarks();
    }, []);

    const handleSaveCollection = async () => {
        if (!collectionName || !collectionDescription || selectedBookmarks.length === 0) {
            setError('All fields must be filled out, and at least one bookmark must be selected.');
            return;
        }

        const selectedBookmarkDetails = bookmarks.filter(bookmark => selectedBookmarks.includes(bookmark.id));

        const collectionData = {
            name: collectionName,
            description: collectionDescription,
            bookmarks: selectedBookmarkDetails,
            createdAt: new Date().toISOString(),
        };

        try {
            const collectionRef = doc(collection(db, 'users', sessionStorage.getItem('uid'), 'collections'));
            const collectionId = collectionRef.id;

            await setDoc(collectionRef, {
                ...collectionData,
                id: collectionId
            });

            if (isPublic) {
                const publicCollectionRef = doc(db, 'publicCollections', collectionId);
                await setDoc(publicCollectionRef, {
                    ...collectionData,
                    id: collectionId
                });
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setCollectionName('');
            setCollectionDescription('');
            setSelectedBookmarks([]);
            setIsPublic(false);
            setError(null);
        } catch (err) {
            console.error('Error adding collection:', err);
            setError('Failed to save collection');
        }
    };

    return (
        <div className="bg-transparent p-6 shadow-md rounded-md border-2 border-gray-300">
            <h2 className="text-3xl text-center font-bold underline text-green-600 mb-4">Collection</h2>
            {success && <p className="text-green-500 mt-2">Collection saved successfully!</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="Collection Name"
                className="bg-transparent border-2 border-gray-300 rounded-md w-full mt-2 p-2"
            />
            <input
                type="text"
                value={collectionDescription}
                onChange={(e) => setCollectionDescription(e.target.value)}
                placeholder="Description"
                className="bg-transparent border-2 border-gray-300 rounded-md w-full mt-2 p-2"
            />
            <div className="mt-4">
                <label className="block text-black dark:text-gray-300 font-bold mb-3">Select Bookmarks:</label>
                <div className="max-h-48 overflow-y-scroll border-2 border-gray-300 rounded-md p-2">
                    {bookmarks.map((bookmark) => (
                        <div key={bookmark.id} className="flex items-center space-x-2 p-2 border-b border-gray-200">
                            <input
                                type="checkbox"
                                value={bookmark.id}
                                checked={selectedBookmarks.includes(bookmark.id)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedBookmarks([...selectedBookmarks, bookmark.id]);
                                    } else {
                                        setSelectedBookmarks(selectedBookmarks.filter(id => id !== bookmark.id));
                                    }
                                }}
                            />
                            <div>
                                <h3 className="font-bold text-black dark:text-white">{bookmark.title}</h3>
                                <p className="text-sm text-gray-500">{bookmark.description}</p>
                                <a href={bookmark.url} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                                    {bookmark.url}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 flex items-center">
                <label className="mr-2 text-black dark:text-white">Make this collection public?</label>
                <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-green-600"
                />
            </div>
            <button
                onClick={handleSaveCollection}
                className="bg-green-500 text-white py-2 px-4 rounded mt-4 hover:bg-green-600"
            >
                Save
            </button>
        </div>
    );
}

function MainPage() {
    const [activeTab, setActiveTab] = useState('bookmark');

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="flex justify-around mb-6 border-b-2 border-gray-300 pb-2">
                <h1
                    onClick={() => setActiveTab('bookmark')}
                    className={`cursor-pointer text-2xl font-bold ${
                        activeTab === 'bookmark' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500'
                    }`}
                >
                    Bookmark
                </h1>
                <h1
                    onClick={() => setActiveTab('collection')}
                    className={`cursor-pointer text-2xl font-bold ${
                        activeTab === 'collection' ? 'text-green-600 border-b-4 border-green-600' : 'text-gray-500'
                    }`}
                >
                    Collection
                </h1>
            </div>

            {activeTab === 'bookmark' ? <BookmarkComponent key="bookmark" /> : <CollectionComponent key="collection" />}
        </div>
    );
}

export default MainPage;
