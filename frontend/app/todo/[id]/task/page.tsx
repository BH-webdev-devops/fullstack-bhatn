'use client'
import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'


// import { useRouter } from 'next/router';

interface ParamsType {
  params : {
    id?: string | any
  }
}

const Task: React.FC<ParamsType> =  () => {
    const [task, setTask] = useState<null>(null);
    const params = useParams<{id: string }>()
    console.log(params)

    useEffect(() => {
        const fetchTask = async () => {
            const token = localStorage.getItem('token')
          try {
            const res = await fetch(`http://localhost:3000/api/todo/${params.id}/task`, {
              method: 'GET',
              headers: { 'Authorization': `Bearer ${token}` }
            });
    
            if (!res.ok) {
              throw new Error('Failed to fetch task details');
            }
    
            const data = await res.json();
            console.log(data)
            setTask(data);
          } catch (err: any) {
            
            // setError(err.message);
          }
        };
        fetchTask();
      }, []);
    
  return (
    <div>
      <h1>tasks page</h1>
  </div>
  );
};

export default Task;

// 'use client';

// import { useState, useEffect } from 'react';

// interface Book {
//   id: string;
//   title: string;
//   author: string;
//   description: string;
//   published_date: string;
// }

// const BookDetailsPage: React.FC<{ params: { id: string } }> = ({ params }) => {
//   const [book, setBook] = useState<Book | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBookDetails = async () => {
//       try {
//         const res = await fetch(`/api/books/${params.id}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!res.ok) {
//           throw new Error('Failed to fetch book details');
//         }

//         const data = await res.json();
//         setBook(data);
//       } catch (err: any) {
//         setError(err.message);
//       }
//     };

//     fetchBookDetails();
//   }, [params.id]);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!book) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Book Details</h1>
//       <p><strong>Title:</strong> {book.title}</p>
//       <p><strong>Author:</strong> {book.author}</p>
//       <p><strong>Description:</strong> {book.description}</p>
//       <p><strong>Published Date:</strong> {book.published_date}</p>
//     </div>
//   );
// };

// export default BookDetailsPage;
