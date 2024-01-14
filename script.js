// CONSTANTS
const apiKey = 'cd81926890daa6aefc832d9f5e44946e';
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'http://image.tmdb.org/t/p/w500';

let moviesGrid;

// FETCHING API
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// SETUP
document.addEventListener('DOMContentLoaded', () => {
    // Is it on the index page?
    const isIndexPage = window.location.href.includes('index.html');
    if (isIndexPage) {
        displayUpcomingMovies();

        moviesGrid = document.getElementById('moviesGrid'); 
        moviesGrid.addEventListener('click', async (event) => {
            const movieCard = event.target.closest('.movie-card');
            if (movieCard) {
                const movieId = movieCard.getAttribute('data-movie-id');
                console.log('Clicked on movie card with movieId:', movieId);
                window.location.href = `detail.html?movieId=${movieId}`;
            }
        });

        const sortCheckbox = document.getElementById('sortCheckbox');
        sortCheckbox.addEventListener('change', () => {
            const isChecked = sortCheckbox.checked;
            if (isChecked) {
                sortMoviesAlphabetically();
            } else {
                displayUpcomingMovies();
            }
        });

        // SEARCH ENTER LISTENER 
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query !== '') {
                    searchMovies(query);
                }
            }
        });
    } else {
        const movieId = window.location.search.split('=')[1];
        if (movieId) {
            displayMovieDetails(movieId);
            displaySimilarMovies(movieId);
        }
    }
});


async function displayUpcomingMovies() {

    try {
        const isIndexPage = document.getElementById('moviesGrid') !== null;

        if (isIndexPage) {
            const page = 1;
            const endpoint = `movie/upcoming?api_key=${apiKey}&language=en-US&page=${page}`;

            const data = await fetchData(endpoint);

            if (data && data.results) {
                const moviesGrid = document.getElementById('moviesGrid');
                moviesGrid.innerHTML = '';

                for (const movie of data.results) {
                    const movieCard = document.createElement('div');
                    movieCard.className = 'movie-card';
                    movieCard.setAttribute('data-movie-id', movie.id); 
                    movieCard.innerHTML = `
                        <img src="${imageBaseUrl}/${movie.poster_path}" alt="${movie.title}" class="movie-poster">
                        <p class="movie-title">${movie.title}</p>
                    `;

                    movieCard.addEventListener('click', async () => await showMovieDetails(movie.id));

                    moviesGrid.appendChild(movieCard);
                }
            }
        }
    } catch (error) {
        console.error('Error displaying upcoming movies:', error);
    }
}


async function searchMovies(query) {
    const endpoint = `search/movie?api_key=${apiKey}&query=${query}`;

    const data = await fetchData(endpoint);

    if (data && data.results) {
        moviesGrid.innerHTML = ''; 

        data.results.forEach((movie) => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${imageBaseUrl}/${movie.poster_path}" alt="${movie.title}" class="movie-poster">
                <p class="movie-title">${movie.title}</p>
            `;

            movieCard.addEventListener('click', () => showMovieDetails(movie.id));

            moviesGrid.appendChild(movieCard);
        });
    }
}


async function fetchMovieDetails(movieId) {
    const endpoint = `movie/${movieId}?api_key=${apiKey}&language=en-US`;
    return fetchData(endpoint);
}


async function fetchSimilarMovies(movieId) {
    const endpoint = `movie/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1`;
    return fetchData(endpoint);
}

async function displayMovieDetails(movieId) {
    try {
        console.log('Fetching movie details...');
        const movieDetails = await fetchMovieDetails(movieId);

        if (movieDetails) {
            console.log('Movie details:', movieDetails);

            const movieTitle = document.getElementById('movieTitle');
            const movieReleaseDate = document.getElementById('releaseDate');
            const movieOverview = document.getElementById('overview');
            const moviePoster = document.getElementById('poster');
            
            const movieOrigTitle = document.getElementById('origTitle');
            const movieTagLine= document.getElementById('tagLine');
            const movieOrigLang = document.getElementById('origLang');
            const movieimdbID = document.getElementById('imdbID');
            const movieHomePage = document.getElementById('homePage');
            const movieRunTime = document.getElementById('runTime');
            const moviePopularity = document.getElementById('popularity');
            const movieStatus = document.getElementById('status');

            
            if (movieDetails.poster_path) {
                moviePoster.src = `${imageBaseUrl}/${movieDetails.poster_path}`;
                moviePoster.alt = movieDetails.title;
            } else {
                moviePoster.src = 'filler.jpg'; 
                moviePoster.alt = 'Placeholder Image';
            }

            if (movieTitle) {
                movieTitle.textContent = movieDetails.title;
            } else {
                console.error('Movie title not found.');
            }

            if (movieReleaseDate) {
                movieReleaseDate.textContent = `Release Date: ${movieDetails.release_date}`;
            } else {
                console.error('Release date not found.');
            }

            if (movieOverview) {
                movieOverview.textContent = movieDetails.overview;
            } else {
                console.error('Overview not found.');
            }

            if (movieOrigTitle) {
                movieOrigTitle.textContent = movieDetails.original_language;
            } else {
                console.error('Original Language not found.');
            }

            if (movieTagLine) {
                movieTagLine.textContent = movieDetails.tagline;
            } else {
                console.error('Tagline not found.');
            }

            if (movieOrigLang) {
                movieOrigLang.textContent = movieDetails.original_language;
            } else {
                console.error('Original Language not found.');
            }

            if (movieimdbID) {
                movieimdbID.textContent = movieDetails.imdb_id;
            } else {
                console.error('IMDB ID not found.');
            }

            if (movieHomePage) {
                movieHomePage.textContent = movieDetails.homepage;
            } else {
                console.error('Movie Homepage not found.');
            }
            if (movieRunTime) {
                movieRunTime.textContent = `${movieDetails.runtime} minutes`;
            } else {
                console.error('Run Time: not found.');
            }
            if (moviePopularity) {
                moviePopularity.textContent = movieDetails.popularity;
            } else {
                console.error('Movie Popularity not found.');
            }
            if (movieStatus) {
                movieStatus.textContent = movieDetails.status;
            } else {
                console.error('Movie Status not found.');
            }

        } else {
            console.log('No movie details received.');
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}


async function displaySimilarMovies(movieId) {
    try {
        const similarMovies = await fetchSimilarMovies(movieId);

        if (similarMovies && similarMovies.results) {
            const similarMoviesList = document.getElementById('similarMoviesList');
            similarMoviesList.innerHTML = '';

            similarMovies.results.forEach((movie) => {
                const similarMovieItem = document.createElement('div');
                similarMovieItem.className = 'similar-movie-item';
                similarMovieItem.innerHTML = `
                    <img src="${imageBaseUrl}/${movie.poster_path}" alt="${movie.title}" class="similar-movie-poster">
                    <p class="similar-movie-title">${movie.title}</p>
                `;

                similarMovieItem.addEventListener('click', () => showMovieDetails(movie.id));

                similarMoviesList.appendChild(similarMovieItem);
            });
        }
    } catch (error) {
        console.error('Error fetching similar movies:', error);
    }
}

async function showMovieDetails(movieId) {
    console.log('Showing movie details for movie ID:', movieId);
    await displayMovieDetails(movieId);
    console.log('Movie details displayed.');
    await displaySimilarMovies(movieId);
    setTimeout(() => {
        window.location.href = 'detail.html';
    }, 1000); 
}


function goBack() {
    window.location.href = 'index.html';
}


async function sortMoviesAlphabetically() {
    try {
        const endpoint = `movie/popular?api_key=${apiKey}&language=en-US&page=1`;
        const data = await fetchData(endpoint);

        if (data && data.results) {
            const sortedMovies = data.results.sort((a, b) => {
                const titleA = a.title.toUpperCase();
                const titleB = b.title.toUpperCase();
                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
            });
            
            const moviesGrid = document.getElementById('moviesGrid');
            moviesGrid.innerHTML = '';

            for (const movie of sortedMovies) {
                const movieCard = document.createElement('div');
                movieCard.className = 'movie-card';
                movieCard.setAttribute('data-movie-id', movie.id);
                movieCard.innerHTML = `
                    <img src="${imageBaseUrl}/${movie.poster_path}" alt="${movie.title}" class="movie-poster">
                    <p class="movie-title">${movie.title}</p>
                `;
                movieCard.addEventListener('click', async () => await showMovieDetails(movie.id));
                moviesGrid.appendChild(movieCard);
            }
        }
    } catch (error) {
        console.error('Error sorting movies alphabetically:', error);
    }
}
