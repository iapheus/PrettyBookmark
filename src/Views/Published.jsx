import React, { useEffect, useState } from 'react';
import { MdMoreHoriz } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FcPicture } from 'react-icons/fc';

function Published() {
    const navigate = useNavigate();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const uid = sessionStorage.getItem('uid');
                if (!uid) {
                    setError('User ID not found');
                    setLoading(false);
                    return;
                }

                const collectionsRef = collection(db, 'publicCollections');
                const querySnapshot = await getDocs(collectionsRef);

                const fetchedCollections = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log(collections);
                setCollections(fetchedCollections);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching collections: ', err);
                setError('Failed to fetch collections');
                setLoading(false);
            }
        };

        setTimeout(() => {
            fetchCollections();
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

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen dark:bg-gray-900 dark:text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6 dark:text-white">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
                Published Collections
            </h1>
            {collections.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    No collections available.
                </p>
            ) : (
                collections.map((data) => (
                    <div
                        key={data.id}
                        className="bg-[#E1EAEE] dark:bg-[#111827] rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center mb-4">
                            <FcPicture size={50} className="mr-4 text-blue-600 dark:text-blue-400" />
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{data.name}</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">{data.description}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Created At: {data.createdAt}</p>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                            <button
                                onClick={() => navigate(`/home/collection/${data.id}`)}
                                className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 transition-colors"
                            >
                                <MdMoreHoriz size={24} />
                                <span className="ml-2">View Details</span>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Published;
