import React, { useEffect, useState, useCallback } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import './App.sass';


const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;


export default function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [searchfield, setSearchfield] = useState("");


  const getPhotos = useCallback(() => {
    let apiUrl = `https://api.unsplash.com/photos?`;

    if (searchfield) apiUrl = `https://api.unsplash.com/search/photos?query=${searchfield}`;

    apiUrl += `&client_id=${accessKey}`;
    apiUrl += `&page=${page}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const searchedImages = data.results ?? data;

        if (page === 1) {
          setImages(searchedImages);
          return;
        };

        setImages((images) => [...images, ...searchedImages]);
    });
  }, [page, searchfield]);


  useEffect(() => {
    getPhotos();
  }, [page, getPhotos]);


  const searchPhotos = (e) => {
    e.preventDefault();

    setPage(1);

    getPhotos();
  };

  if (!accessKey) {
    return (
      <a href="https://unsplash.com/developers" className="error">REQUIRED: Get Your Unsplash API Key First.</a>
    );
  };


  return (
    <div className="app">
      <h1><span className="infinity">∞</span> Unsplash Image Gallery!</h1>

      <form onSubmit={searchPhotos}>
        <input type="text" placeholder="Search Unsplash..." value={searchfield} onChange={(e) => setSearchfield(e.target.value)} />
        <button>Search</button>
      </form>

      <InfiniteScroll
        dataLength={images.length} //This is important field to render the next data
        next={() => setPage((page) => page + 1)}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <div className="image-grid">
          {images.map((image, index) => (
            <a className="image" key={index} href={image.links.html} target="_blank" rel="noopener noreferrer">
              <img src={image.urls.regular} alt={image.alt_description} />
            </a>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};
