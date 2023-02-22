import React, { useEffect, useState } from 'react';
import Movie from "./movie";


const Movies = () => {
    const [result, setResult] = useState([]);
    
    useEffect(() => {
      fetch("http://localhost:8000/movies")
        .then((res) => res.json())
        .then((data) => {    console.log(data)
          setResult(data)});
    }, []);
    let movies = [];
    result.forEach((movie, idx) => {
      movies.push(
        <div className="col-sm py-3" key={idx}>
          <Movie title={movie.title} year={movie.year} fullplot={movie.fullplot} type={movie.type} poster={movie.poster} rating={movie.imdb.rating}/>
        </div>
      )
      if ((idx + 1) % 4 === 0) { movies.push(<div className="w-100"></div>) }
    })
    return (
        <div className="row" >
            {movies}
        </div>
    );
};
export default Movies; 