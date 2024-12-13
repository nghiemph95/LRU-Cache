import React, { useState, useEffect } from "react";
import LRUCache from "./LRUCache"; // Import the LRUCache class

const App = () => {
  const [cache] = useState(new LRUCache(5)); // Create an instance of LRUCache with a limit of 5
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulating data fetching from an API or local source
  const fetchPageData = (pageId) => {
    setLoading(true);
    // Simulate an API call delay
    setTimeout(() => {
      const pageData = `Data for ${pageId}`; // Simulated page data
      cache.set(pageId, pageData); // Store the page data in the cache
      setPages((prevPages) => [...prevPages, pageData]); // Update the pages array
      setLoading(false);
    }, 1000);
  };

  const loadPage = (pageId) => {
    // Check if the page is already cached
    const cachedPage = cache.get(pageId);
    if (cachedPage) {
      setPages((prevPages) => [...prevPages, cachedPage]); // Use the cached data if it exists
    } else {
      fetchPageData(pageId); // Fetch data if not cached
    }
  };

  const handleResetCache = () => {
    cache.reset(); // Clear the cache
    setPages([]); // Clear the pages displayed in the UI
  };

  return (
    <div className="App">
      <h1>LRU Cache Demo</h1>

      {/* Display Loading Text */}
      {loading ? <p>Loading...</p> : null}

      {/* Buttons to load pages */}
      <button onClick={() => loadPage("page-2")}>Load Page 2</button>
      <button onClick={() => loadPage("page-3")}>Load Page 3</button>
      <button onClick={() => loadPage("page-4")}>Load Page 4</button>
      <button onClick={() => loadPage("page-5")}>Load Page 5</button>
      <button onClick={() => loadPage("page-6")}>Load Page 6</button>

      {/* Reset Cache Button */}
      <button onClick={handleResetCache}>Reset Cache</button>

      {/* Display Cached Pages */}
      <div>
        {pages.map((page, index) => (
          <div key={index}>{page}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
