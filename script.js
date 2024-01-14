// Constants
const apiKey = 'cd81926890daa6aefc832d9f5e44946e'; // Replace with your actual API key
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'http://image.tmdb.org/t/p/w500';

// Function to fetch data using the fetch API
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

// Initial setup
// Move this block outside of the displayUpcomingMovies function
document.addEventListener('DOMContentLoaded', () => {
    // Check if the current page is the index page
    const isIndexPage = window.location.href.includes('index.html');
    if (isIndexPage) {
        displayUpcomingMovies(); // Fetch and display upcoming movies on the index page

        // Add event listener for movie cards
        moviesGrid = document.getElementById('moviesGrid');  // Assign moviesGrid globally
        moviesGrid.addEventListener('click', async (event) => {
            const movieCard = event.target.closest('.movie-card');
            if (movieCard) {
                const movieId = movieCard.getAttribute('data-movie-id');
                console.log('Clicked on movie card with movieId:', movieId);
                window.location.href = `detail.html?movieId=${movieId}`;
            }
        });        
    } else {
        // Extract movie ID from the URL and display details on the detail page
        const movieId = window.location.search.split('=')[1];
        if (movieId) {
            displayMovieDetails(movieId);
            displaySimilarMovies(movieId);
        }
    }
});




async function displayUpcomingMovies() {

    try {
        // Check if we are on the index page (where moviesGrid exists)
        const isIndexPage = document.getElementById('moviesGrid') !== null;

        if (isIndexPage) {
            const page = 1; // You can change the page number as needed
            const endpoint = `movie/upcoming?api_key=${apiKey}&language=en-US&page=${page}`;

            const data = await fetchData(endpoint);

            if (data && data.results) {
                const moviesGrid = document.getElementById('moviesGrid');
                moviesGrid.innerHTML = '';

                for (const movie of data.results) {
                    const movieCard = document.createElement('div');
                    movieCard.className = 'movie-card';
                    movieCard.setAttribute('data-movie-id', movie.id); // Set the data-movie-id attribute
                    movieCard.innerHTML = `
                        <img src="${imageBaseUrl}/${movie.poster_path}" alt="${movie.title}" class="movie-poster">
                        <p class="movie-title">${movie.title}</p>
                    `;

                    // Add event listener to handle clicks on movie cards
                    movieCard.addEventListener('click', async () => await showMovieDetails(movie.id));

                    moviesGrid.appendChild(movieCard);
                }
            }
        }
    } catch (error) {
        console.error('Error displaying upcoming movies:', error);
    }
}



// Function to search for movies
async function searchMovies(query) {
    const endpoint = `search/movie?api_key=${apiKey}&query=${query}`;

    const data = await fetchData(endpoint);

    if (data && data.results) {
        const moviesGrid = document.getElementById('moviesGrid');
        moviesGrid.innerHTML = '';

        data.results.forEach((movie) => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${imageBaseUrl}/${movie.poster_path}" alt="${movie.title}" class="movie-poster">
                <p class="movie-title">${movie.title}</p>
            `;

            // Add event listener to handle clicks on movie cards
            movieCard.addEventListener('click', () => showMovieDetails(movie.id));

            moviesGrid.appendChild(movieCard);
        });
    }
}

// Function to fetch detailed information about a movie
async function fetchMovieDetails(movieId) {
    const endpoint = `movie/${movieId}?api_key=${apiKey}&language=en-US`;
    return fetchData(endpoint);
}

// Function to fetch similar movies
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

            // Update your HTML elements on detail.html with the movie details
            const movieTitle = document.getElementById('movieTitle');
            const movieReleaseDate = document.getElementById('releaseDate');
            const movieOverview = document.getElementById('overview');
            const moviePoster = document.getElementById('poster');

            // Log the elements before updating
            console.log('Movie title element:', movieTitle);
            console.log('Release date element:', movieReleaseDate);
            console.log('Overview element:', movieOverview);
            console.log('Poster element:', moviePoster);

            // Check if the movie has a poster path before setting the image source
            if (movieDetails.poster_path) {
                moviePoster.src = `${imageBaseUrl}/${movieDetails.poster_path}`;
                moviePoster.alt = movieDetails.title;
            } else {
                moviePoster.src = 'filler.jpg'; // Replace with your placeholder image path
                moviePoster.alt = 'Placeholder Image';
            }

            // Update other elements
            if (movieTitle) {
                movieTitle.textContent = movieDetails.title;
            } else {
                console.error('Movie title element not found.');
            }

            if (movieReleaseDate) {
                movieReleaseDate.textContent = `Release Date: ${movieDetails.release_date}`;
            } else {
                console.error('Release date element not found.');
            }

            if (movieOverview) {
                movieOverview.textContent = movieDetails.overview;
            } else {
                console.error('Overview element not found.');
            }

        } else {
            console.log('No movie details received.');
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}





// Function to display similar movies on the detail page
async function displaySimilarMovies(movieId) {
    try {
        const similarMovies = await fetchSimilarMovies(movieId);

        if (similarMovies && similarMovies.results) {
            // Update your HTML elements on detail.html with the list of similar movies
            const similarMoviesList = document.getElementById('similarMoviesList');
            similarMoviesList.innerHTML = '';

            similarMovies.results.forEach((movie) => {
                const similarMovieItem = document.createElement('div');
                similarMovieItem.className = 'similar-movie-item';
                similarMovieItem.innerHTML = `
                    <img src="${imageBaseUrl}/${movie.poster_path}" alt="${movie.title}" class="similar-movie-poster">
                    <p class="similar-movie-title">${movie.title}</p>
                `;

                // Add event listener to handle clicks on similar movie items
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
        window.location.href = 'detail.html'; // Navigate to the detail page
    }, 1000); // Adjust the delay time if needed
}


// Function to navigate back to the index page
function goBack() {
    window.location.href = 'index.html';
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    // Check if the current page is the index page or detail page
    const isIndexPage = window.location.href.includes('index.html');

    if (isIndexPage) {
        displayUpcomingMovies(); // Fetch and display upcoming movies on the index page
    } else {
        // Extract movie ID from the URL and display details on the detail page
        const movieId = window.location.search.split('=')[1];
        if (movieId) {
            displayMovieDetails(movieId);
            displaySimilarMovies(movieId);
        }
    }
});
