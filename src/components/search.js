import React, { useEffect, useRef, useState } from 'react';
import Movie from "./movie";
import SearchBar from "./SearchBar";
import axios from 'axios';


const Movies = () => {
    const [result, setResult] = useState([]);
    // useEffect(() => {
    //   fetch("http://localhost:8001/search")
    //     .then((res) => res.json())
    //     .then((data) => setResult(data));
    // }, []);
  
    // let movies = [];
    // result.forEach((movie, idx) => {
    //   movies.push(
    //     <div className="col-sm py-3" key={idx}>
    //       <Movie title={movie.title} fullplot={movie.fullplot} type={movie.type} poster={movie.poster}/>
    //     </div>
    //   )
    //   if ((idx + 1) % 4 === 0) { movies.push(<div className="w-100"></div>) }
    // })
    return (
        <div className="row" >
             <SearchBar placeholder="Enter a Title..."  />
            {/* {movies} */}
        </div>
    );
};
export default Movies; 