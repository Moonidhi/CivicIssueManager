import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // import your firebase.ts
import { collection, getDocs } from 'firebase/firestore';

const TestFirebase = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'your-collection-name')); // replace with your Firestore collection
        const docsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(docsData);
        console.log(docsData); // logs data in browser console
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Firestore Data:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TestFirebase;
