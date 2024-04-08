import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight &&
      !isLoading && hasMoreData
    ) {
      fetchQuotes();
    }
  };

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=10`
      );
      const data = await response.json();
      if (data?.data?.length > 0) {
        setQuotes(prevQuotes => [...prevQuotes, ...data?.data]);
        setPage(prevPage => prevPage + 1);
      } else {
        // no more data available
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [quotes, isLoading, hasMoreData]);

  return (
    <div>
      <h1 className='title'>PROGRAMMING QUOTES</h1>
      <div className='container'>
        {quotes?.map((quote, index) => (
          <div className='quote' key={index}>
            <p className='text'>{index + 1}). {quote?.quote}</p>
            <p className='mark'>❞❞</p>
            <p className='author'>-{quote?.author}</p>
          </div>
        ))}
        {isLoading && <p className='loading'>Loading...</p>}
        {!hasMoreData && <p className='loading'>No more data available.</p>}
      </div>
    </div>
  );
}
