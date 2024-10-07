import React, { useEffect, useState } from 'react'
import EachCollection from '../Components/EachCollection'
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function CollectionAll() {
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
        <div className='space-y-3'>
            {collections.map(data => (
                <EachCollection key={data.id} collection={data} />
            ))}
        </div>
    )
}

export default CollectionAll;
