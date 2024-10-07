import React, { useEffect, useState } from 'react'
import EachCollection from './EachCollection'
import { MdMoreHoriz } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Collections() {
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

                const collectionsRef = collection(db, 'users', uid, 'collections');

                const querySnapshot = await getDocs(collectionsRef);

                const fetchedCollections = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {collections.length === 0 ? (
                <div className='text-center p-4'>
                    <p className='text-md text-black dark:text-white'>There are no collections.</p>
                    <p className='text-md text-black dark:text-white'>Would you like to add one?</p>
                    <button 
                        onClick={() => navigate('/home/collection/new')} 
                        className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
                    >
                        Add Collection
                    </button>
                </div>
            ) : (
                <div className='space-y-3'>
                    {collections.slice(0,3).map(data => (
                        <EachCollection key={data.id} collection={data} />
                    ))}
                    {
                        collections.length > 3 && 
                        <MdMoreHoriz 
                            onClick={() => navigate('/home/collection/all')} 
                            size={24} 
                            className='text-black dark:text-white mx-auto' 
                        />
                    }
                </div>
            )}
        </div>
    )
}

export default Collections;
