import React, { useState, useEffect, useCallback, useRef } from 'react';

const TestPage = () => {
  type Person = {
    firstname: string;
    lastname: string;
    birthday: string;
  };

  const scrollRef = useRef<HTMLUListElement | null>(null);
  const [data, setData] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const fetchData = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const response = await fetch('https://fakerapi.it/api/v2/persons?_quantity=100&_gender=female&_birthday_start=2005-01-01');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      const newData = result.data;

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setData((prevData) => [...prevData, ...newData]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  }, [isLoading, hasMore]);

  const handleScroll = (e) => {
    if (scrollRef.current) {
      const scrollTop = e.target.scrollTop;
      const clientHeight = e.target.clientHeight;
      const scrollHeight = e.target.scrollHeight;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Infinite Scroll Example</h1>
      <ul onScroll={handleScroll} ref={scrollRef} className="bg-gray-700 w-[400px] h-[300px] overflow-auto">
        {data.map((person, index) => (
          <li key={index} className="flex items-center">
            <p>{person.firstname} {person.lastname}</p>
            <p>Birthday: {person.birthday}</p>
          </li>
        ))}
      </ul>
      {isLoading && <p>Loading...</p>}
      {!hasMore && <p>No more data available.</p>}
    </div>
  );
};

export default TestPage;