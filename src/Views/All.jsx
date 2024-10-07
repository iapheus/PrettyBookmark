import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import BookmarkCard from '../Components/BookmarkCard';

function All() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const uid = sessionStorage.getItem('uid');
                if (!uid) {
                    setError('User not logged in');
                    setLoading(false);
                    return;
                }

                const bookmarksRef = collection(db, 'users', uid, 'bookmarks');

                const querySnapshot = await getDocs(bookmarksRef);
                
                const fetchedBookmarks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt ? new Date(doc.data().createdAt).toLocaleString() : null
                }));
                // console.log(fetchedBookmarks);
                setBookmarks(fetchedBookmarks);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching bookmarks: ', err);
                setError('Failed to fetch bookmarks');
                setLoading(false);
            }
        };

        setTimeout(() => {
            fetchBookmarks();
        }, 100);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-full">
                <div className="loader" role="status"></div>
                <h1 className="text-black dark:text-white text-3xl font-semibold mt-4">Loading...</h1>
            </div>
        );
    }

    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

    return (
        <div className="p-4">
            <div className="max-w-7xl mx-auto py-8">
                <h1 className="text-3xl text-black dark:text-white font-mono text-center mb-16">Bookmarks</h1>
                {bookmarks.length === 0 ? (
                    <div className="text-center">
                        <img src="/no-data.svg" alt="No data" className="h-64 mx-auto mb-4" />
                        <p className="text-white text-lg">No bookmarks found.</p>
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {bookmarks.map(bookmark => (
                            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default All;
