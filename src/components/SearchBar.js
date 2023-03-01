import React, { useState } from "react";
import axios from 'axios';
import Movie from "./movie";


function SearchBar({ placeholder, data }) {
  const [result, setResult] = useState([]);
  let textInput = React.createRef();

  const onKeyPressHandler = (e) => {
    if (e.key === 'Enter') {
      search()
    }
  };

  const search = () => {
    var term = textInput.current.value
    var url = "http://localhost:8001/search?search=" + term
    axios
      .get(url)
      .then((res) => {
        setResult(res.data);
        console.log(result)
      });
  };

  let movies = [];
  result.forEach((movie, idx) => {
    movies.push(
      <div className="col-sm py-3">
        <Movie title={movie.title} fullplot={movie.fullplot} type={movie.type} poster={movie.poster} match="searchResult" />
      </div>
    )
    if ((idx + 1) % 4 === 0) { movies.push(<div className="w-100"></div>) }
  })
  return (

    <div>

      <div className="wrap">
        <div className="search">
          <input type="text" className="searchTerm" ref={textInput}
            placeholder="Enter a Title"
            onKeyPress={onKeyPressHandler}></input>
        </div>
      </div>
      <div className="row" >
        {movies}
      </div>
    </div>


  );
}

export default SearchBar;