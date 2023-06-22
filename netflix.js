
const apikey = "6a4b5b6d84e037cddc22cb4d7cc6b0db";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const youtubeApiKey = "AIzaSyBDSyByNykT3YdAVHGISwOFfBiNz1b-kJE";
const apiPaths = {
    fetchALLCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=
    AIzaSyBrgnuKGVlcw_JMxjASsUOAo4e13-7i5WQ`
}
// Boots up the app
function init() {
    fetchTrendingMovie();
    fetchAndBuildALLSections();
}

function fetchTrendingMovie() {
    fetchAndbuildMovieSection(apiPaths.fetchTrending, "Trending Now")
        .then(list => {
            // console.log(list.slice(0,2));
            list = list.splice(1, 10);
            const randomIndex = parseInt(Math.random() * list.length);
            buildBannerSection(list[randomIndex], randomIndex + 1);
        }).catch(err => {
            console.log(err);
        });
}

function buildBannerSection(movie, index) {
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;
    const div = document.createElement('div');
    div.innerHTML = `
    <p class="banner-title">${movie.title}</p>
    <p class="banner-info"><img id="top10" src="./assets/top10.png">  #${index} in Movies Today</p>
    <p class="banner-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0, 200).trim() + "..." : movie.overview}</p>
    <div class="action-button-cont">
      <button class="action-button"> <img src="./assets/playicon.png" alt=""> &nbsp;&nbsp; Play</button>
      <button class="action-button more-info"> <img src="./assets/infoicon.png" alt="">&nbsp;&nbsp; More Info</button>
    </div>
    `;
    div.className = "banner-content container";
    bannerCont.append(div);
}


function fetchAndBuildALLSections() {
    fetch(apiPaths.fetchALLCategories)
        .then(res => res.json())
        .then(res => {
            const categories = res.genres;
            if (Array.isArray(categories) && categories.length) {
                categories.forEach(category => {
                    fetchAndbuildMovieSection(
                        apiPaths.fetchMoviesList(category.id),
                        category.name
                    );
                });
            }
            // console.table(categories);
        })
        .catch(err => console.error(err));
}


function fetchAndbuildMovieSection(fetchUrl, categoryName) {
    // console.log("Category Section")
    // console.log(fetchUrl, categoryName)
    return fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            // console.table(res.results)
            const movies = res.results;
            if (Array.isArray(movies) && movies.length) {
                buildMovieSection(movies, categoryName)
            }
            return movies;
        })
        .catch(err => console.error(err));
}

function buildMovieSection(list, categoryName) {
    // console.table(                                       list, categoryName.value);
    const moviesCont = document.getElementById('movies-cont');
    const movieslistHTML = list.map(item => {
        return `
        <div class="movie-item" 
        onmouseover ="searchMovieTrailer('${item.title}','yt${item.id}')">
    <iframe allow=autoplay width="245px" height="150px"
     src=""
     id="yt${item.id}"></iframe>
        <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}"/>
        </div>
        `;
    }).join('');
    const moviesSectionHTML = `
    <h2 class="movies-section-heading">
      ${categoryName} <span class="explore-nudge">Explore All</span>
    </h2>
    <div class="movies-row">
      ${movieslistHTML}
    </div>
    `
    // console.log(moviesSectionHTML);

    const div = document.createElement('div');
    div.className = "movies-section";
    div.innerHTML = moviesSectionHTML;
    //append html into movies  container-----------
    moviesCont.append(div);
}


function searchMovieTrailer(movieName, iFrameId) {
    if (!movieName) return;
    // fetch(apiPaths.searchOnYoutube(movieName))
        // .then(res => res.json())
        // .then(res => {
            // console.log(res.items)
            // const bestResult = res.items[0];
            // const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
            const elements = document.getElementById(iFrameId);
            elements.src =  `https://www.youtube.com/embed/WQmGwmc-XUY?autoplay=1&controls=0`;
            // elements.src =  `https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0`;
        // })
        // .catch(err => console.error(err));
}



window.addEventListener('load', function () {
    init();
    window.addEventListener("scroll", function () {
        const header = document.getElementById('header');
        if (this.window.scrollY > 5)
            header.classList.add("black-bg");
        else
            header.classList.remove("black-bg");

    })
})