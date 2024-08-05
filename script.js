const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

async function loadMovies(searchTerm){
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&apikey=4e1af779`;
    const res = await fetch(URL);
    const data = await res.json();
    if(data.Response === "True") {
        displayMovieList(data.Search);
    }
}

function findMovies(){
    let searchTerm = movieSearchBox.value.trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let displayMovieListItem = document.createElement('div');
        displayMovieListItem.dataset.id = movies[idx].imdbID;
        displayMovieListItem.classList.add('search-list-item');
        let moviePoster;
        if(movies[idx].Poster !== "N/A") {
            moviePoster = movies[idx].Poster;
        } else {
            moviePoster = "img2.jpg";
        }

        displayMovieListItem.innerHTML =
            `<div class="search-item-thumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="search-item-info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
            </div>`;

        searchList.appendChild(displayMovieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=4e1af779`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${details.Poster !== "N/A" ? details.Poster : "img2.jpg"}" alt="movie-poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year : ${details.Year}</li>
                <li class="rated">Rating : ${details.Rated}</li>
                <li class="released">Released : ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre : ${details.Genre}</b></p>
            <p class="writer"><b>Writer : ${details.Writer}</b></p>
            <p class="actors"><b>Actors : ${details.Actors}</b></p>
            <p class="plot"><b>Plot : ${details.Plot}</b></p>
            <p class="language"><b>Language : ${details.Language}</b></p>
            <p class="awards"><b><i class="fas fa-award"></i></b>${details.Awards}</p>
        </div>`;
}
