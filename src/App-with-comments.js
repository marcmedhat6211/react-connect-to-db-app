import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

/**
 * fetch() Method:
 *    A built in method to fetch data from a database or send data to database
 *    Takes 2 arguments (2nd one is optional)
 *        1st argument: the API url (string)
 *        2nd argument: a js object where you can pass extra headers or extra body or change the http request method
 *    default method is a get request
 *    returns a promise because sending an http request is an asynchronous task so it doesn't finish right away
 *    note: the fetch method doesn't return an error when the error status is generated, but it returns an error when you try to access a field in the data object and that field is not there
 */
function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Syntax using normal promises
   */
  // const fetchMoviesHandler = () => {
  //   fetch("https://swapi.py4e.com/api/films")
  //     .then((response) => {
  //       return response.json(); // to transform the returned data into json format, this returns a promise too
  //     })
  //     .then((data) => {
  //       const transformedMovies = data.results.map((movieData) => {
  //         return {
  //           id: movieData.episode_id,
  //           title: movieData.title,
  //           openingText: movieData.opening_crawl,
  //           releaseDate: movieData.release_date,
  //         };
  //       });

  //       setMovies(transformedMovies);
  //     });
  // };

  /**
   * Syntax using async await
   */
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null); // here we're setting the error to null to make sure that we're not stuck with any previous error

    try {
      const response = await fetch("https://swapi.py4e.com/api/films"); // this response object has many fields like status (status code), ok (whether the response was successful or not)

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });

      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  /**
   * used useEffect to make the http request gets done once the component is being rendered
   * The best practice is to add dependencies
   * however the fetchMoviesHandler is a function which changes everytime the component gets re rendered
   *    the solution is to use the useCallback hook which lets the component only gets re rendered if some dependencies changed
   */
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = <p>Found no movies!</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>} */}
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
