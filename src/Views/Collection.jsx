import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import JustAnotherCard from '../Components/JustAnotherCard';

function Collection() {
  const { collectionId } = useParams();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        let fetchedCollections = [];

        const publicCollectionsRef = collection(db, 'publicCollections');
        const publicQuery = query(publicCollectionsRef, where('__name__', '==', collectionId));
        const publicSnapshot = await getDocs(publicQuery);

        if (!publicSnapshot.empty) {
          fetchedCollections = publicSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } else {
          const uid = sessionStorage.getItem('uid');
          if (!uid) {
            setError('User ID not found');
            setLoading(false);
            return;
          }

          const userCollectionsRef = collection(db, 'users', uid, 'collections');
          const userQuery = query(userCollectionsRef, where('__name__', '==', collectionId));
          const userSnapshot = await getDocs(userQuery);

          fetchedCollections = userSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }

        setCollections(fetchedCollections);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching collections: ', err);
        setError('Failed to fetch collections');
        setLoading(false);
      }
    };

    fetchCollections();
  }, [collectionId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
          <div className="loader" role="status"></div>
          <h1 className="text-black dark:text-white text-3xl font-semibold mt-4">Loading...</h1>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-transparent max-h-screen p-4">
      <div className="max-w-7xl mx-auto py-8">
        {collections.map(collection => (
          <div key={collection.id}>
            <div className="flex">
              <div className="ml-5">
                <h1 className="font-semibold text-3xl text-black dark:text-white mt-4">{collection.name}</h1>
                <p className="font-light text-lg text-black dark:text-white mt-4 mb-5">{collection.description}</p>
              </div>
            </div>
            <hr />
            <div className="mt-5 space-y-3">
              {collection.bookmarks && collection.bookmarks.length > 0 ? (
                collection.bookmarks.map((bookmark, index) => (
                  <JustAnotherCard key={index} bookmark={bookmark} />
                ))
              ) : (
                <p className="text-black dark:text-white">No bookmarks found in this collection.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Collection;
