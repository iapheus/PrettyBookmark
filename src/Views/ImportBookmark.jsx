import React, { useState, useRef, useEffect } from 'react';
import { db } from '../firebase';
import { doc, addDoc, collection } from 'firebase/firestore';

function ImportBookmark() {
    const [jsonData, setJsonData] = useState(null);
    const [collectionName, setCollectionName] = useState('');
    const [collectionDescription, setCollectionDescription] = useState('');
    const [selectedBookmarks, setSelectedBookmarks] = useState([]);
    const [error, setError] = useState(null);
    const [displayedBookmarks, setDisplayedBookmarks] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);

    const scrollContainerRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = JSON.parse(e.target.result);
                setJsonData(result);
            } catch (err) {
                setError('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };

    const findToolbarCollection = (json) => {
        if (!json.children) return null;
        return json.children.find(child => child.guid === 'toolbar_____' && child.title === 'toolbar');
    };

    const extractBookmarks = (collection) => {
        if (!collection || !collection.children) return [];
        return collection.children.flatMap((child) => {
            if (child.type === 'text/x-moz-place-container' && child.children) {
                return extractBookmarks(child);
            } else if (child.type === 'text/x-moz-place') {
                return [{ title: child.title, url: child.uri }];
            }
            return [];
        });
    };

    const handleCheckboxChange = (bookmark) => {
        setSelectedBookmarks(prevSelected => {
            if (prevSelected.some(selected => selected.url === bookmark.url)) {
                return prevSelected.filter(selected => selected.url !== bookmark.url);
            }
            return [...prevSelected, bookmark];
        });
    };

    const handleSave = async () => {
        if (!collectionName || !collectionDescription) {
            setError('Collection name and description are required');
            return;
        }

        if (selectedBookmarks.length === 0) {
            setError('No bookmarks selected');
            return;
        }

        try {
            const uid = sessionStorage.getItem('uid');
            const collectionRef = collection(db, 'users', uid, 'collections');

            await addDoc(collectionRef, {
                name: collectionName,
                description: collectionDescription,
                bookmarks: selectedBookmarks,
                createdAt: new Date().toISOString()
            });

            setError(null);
            alert('Bookmarks saved successfully!');
        } catch (err) {
            console.error('Error saving bookmarks:', err);
            setError('Failed to save bookmarks');
        }
    };

    const toolbarCollection = jsonData ? findToolbarCollection(jsonData) : null;
    const bookmarks = toolbarCollection ? extractBookmarks(toolbarCollection) : [];

    const handleScroll = () => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                if (displayedBookmarks.length < bookmarks.length) {
                    setVisibleCount((prevCount) => prevCount + 10);
                } else {
                    setHasMore(false);
                }
            }
        }
    };

    useEffect(() => {
        setDisplayedBookmarks(bookmarks.slice(0, visibleCount));
    }, [visibleCount, bookmarks]);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-900 dark:text-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-800 dark:text-white">Import Bookmarks</h1>

            <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
                <div className="text-red-600 mt-2">
                    {error}
                </div>
            )}

            {jsonData && bookmarks.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No bookmarks found in the toolbar collection.
                </div>
            )}

            {jsonData && bookmarks.length > 0 && (
                <div className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-lg font-semibold mb-1">Collection Name:</label>
                        <input
                            type="text"
                            value={collectionName}
                            onChange={(e) => setCollectionName(e.target.value)}
                            className="bg-transparent block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg font-semibold mb-1">Collection Description:</label>
                        <textarea
                            value={collectionDescription}
                            onChange={(e) => setCollectionDescription(e.target.value)}
                            className="bg-transparent block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Select Bookmarks to Save</h2>
                    <div
                        ref={scrollContainerRef}
                        className="max-h-52 overflow-y-auto space-y-2 p-4 border border-gray-200 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                        onScroll={handleScroll}
                    >
                        {displayedBookmarks.map((bookmark, index) => (
                            <div key={index} className="flex items-center p-2 bg-white dark:bg-gray-700 shadow rounded mb-2">
                                <input
                                    type="checkbox"
                                    checked={selectedBookmarks.some(b => b.url === bookmark.url)}
                                    onChange={() => handleCheckboxChange(bookmark)}
                                    className="mr-2"
                                />
                                <span className="text-lg text-gray-800 dark:text-gray-200">{bookmark.title} - <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{bookmark.url}</a></span>
                            </div>
                        ))}
                        {!hasMore && <div className="text-center text-gray-500 dark:text-gray-400">No more bookmarks</div>}
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full px-4 py-2 mt-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Save Selected Bookmarks
                    </button>
                </div>
            )}
        </div>
    );
}

export default ImportBookmark;
