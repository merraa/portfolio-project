const apiKey = "6eec751a921c4c2a3db0050f78e00558";

const resultClicked = (descript, image, poster, releaseDate, firstAirDate) => {
  // hidding the searched results in order to display only the clicked element
  const resultDiv = document.querySelector(".search-result");
  resultDiv.innerHTML = "";
  resultDiv.classList.add("hidden");
  // changing the background image
  const body = document.querySelector("body");
  body.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${image})`;
  // setting up the description
  const description = document.createElement("p");
  description.style.width = "100%";
  description.style.color = "white";
  description.style.marginBottom = "10px";
  description.textContent = descript;
  // setting up the release date
  const release = document.createElement("p");
  release.style.color = "white";
  release.style.width = "100%";
  if (releaseDate) {
    release.textContent = `Release Date: ${releaseDate}`;
  } else {
    release.textContent = `Release Date: ${firstAirDate}`;
  }
  //adding the poster image
  const posterImg = document.createElement("img");
  posterImg.setAttribute("src", `https://image.tmdb.org/t/p/w300/${poster}`);
  posterImg.style.boxShadow = "10px 10px 5px 0px rgba(0,0,0,0.75)";
  posterImg.style.marginLeft = "20vh";
  //creating a div to put the description, release date and cast together
  const container = document.createElement("div");
  container.appendChild(description);
  container.appendChild(release);
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.width = "500px";
  // appending it to the root div
  const result = document.querySelector(".result-clicked");
  result.classList.remove("hidden");
  result.appendChild(container);
  result.appendChild(posterImg);

  return container;
};

function createClickListener(elem) {
  return function () {
    const container = resultClicked(
      elem.overview,
      elem.backdrop_path,
      elem.poster_path,
      elem.release_date,
      elem.first_air_date
    );
    displayActors(elem.id, elem.media_type, container);
  };
}

const searchValue = () => {
  //variables
  const welcome = document.querySelector(".home-page");
  welcome.classList.add("hidden");
  const resultDiv = document.querySelector(".search-result");
  resultDiv.classList.remove("hidden");
  const body = document.querySelector("body");
  body.style.backgroundImage = "none";
  body.style.backgroundColor = "black";

  const searchTerm = document.querySelector(".search-txt").value;
  //fetching data
  fetch(
    `https://api.themoviedb.org/3/search/multi?query=${searchTerm}&api_key=${apiKey}`
  )
    .then((response) => response.json())
    .then((response) => {
      const resultArr = [...response.results];
      if (resultArr.length !== 0) {
        for (elem of resultArr) {
          // creating an image element to display the poster
          const image = document.createElement("img");
          if (elem.poster_path) {
            image.setAttribute(
              "src",
              `https://image.tmdb.org/t/p/w300/${elem.poster_path}`
            );
            image.style.boxShadow = "10px 10px 5px 0px rgba(0,0,0,0.75)";
            image.style.borderRadius = "5px";
            // adding an event listener so the image responds to a click
            image.addEventListener("click", createClickListener(elem));
            resultDiv.appendChild(image);
          }
        }
      } else {
        // for when there is no result for the search
        const sorry = document.createElement("h1");
        sorry.textContent = "Sorry we could'nt find what you're looking for";
        resultDiv.appendChild(sorry);
        resultDiv.style.marginLeft = "20vw";
        resultDiv.style.marginBottom = "42vw";
      }
    })
    .catch((err) => console.error(err));
};

//function to display the cast of a movie or a tv show
const displayActors = (movieId, media_type, container) => {
  const result = document.querySelector(".result-clicked");
  //fetching cast data
  fetch(
    `https://api.themoviedb.org/3/${media_type}/${movieId}/credits?api_key=${apiKey}`
  )
    .then((response) => response.json())
    .then((json) => {
      // element for the description of the cast
      const actors = document.createElement("p");
      actors.textContent = "Cast: ";
      actors.style.marginTop = "20px";

      container.appendChild(actors);
      if (json.cast.length !== 0) {
        // going through each actor to display their name and photo
        for (let i = 0; i <= 4; i++) {
          if (json.cast[i]) {
            const actorName = document.createElement("p");
            actorName.textContent = json.cast[i].name;

            const actorImg = document.createElement("img");
            actorImg.setAttribute(
              "src",
              `https://image.tmdb.org/t/p/w200${json.cast[i].profile_path}`
            );
            actorImg.style.width = "50px";
            actorImg.style.height = "50px";
            actorImg.style.borderRadius = "5px";

            const containerDiv = document.createElement("div");
            containerDiv.style.display = "flex";
            containerDiv.style.flexDirection = "column";
            containerDiv.style.alignItems = "center";
            containerDiv.style.marginTop = "20px";
            containerDiv.style.marginRight = "30px";
            containerDiv.appendChild(actorImg);
            containerDiv.appendChild(actorName);

            container.append(containerDiv);
          } else break;
        }
      }
    })
    .catch((err) => console.error(err));

  //"displaying" the trailer
  //fetching the video data
  fetch(
    `https://api.themoviedb.org/3/${media_type}/${movieId}/videos?api_key=${apiKey}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.results.length !== 0) {
        //going through each video and creating a button to display the trailer
        for (video of json.results) {
          if (video.type === "Trailer") {
            const trailer = document.createElement("a");
            trailer.innerHTML = `<button 
            style="width: 150px; 
                   height: 50px; 
                   color: white;
                   background-color: -webkit-link;
                   border: none;
                   border-radius: 5px;"
            >Watch Trailer</button>`;
            trailer.setAttribute(
              "href",
              `https://www.youtube.com/watch?v=${video.key}`
            );
            trailer.setAttribute("target", "_blank");
            result.append(trailer);
            break;
          }
        }
      }
      //setting the watch movie button
      const searchTerm = document.querySelector(".search-txt").value;
      const searchArr = searchTerm.split(" ").join("-");
      const watchHere = document.createElement("a");
      watchHere.innerHTML = `<button 
            style="width: 150px; 
                   height: 50px; 
                   color: white;
                   background-color: -webkit-link;
                   border: none;
                   border-radius: 5px;"
            >Watch Movie</button>`;
      watchHere.setAttribute(
        "href",
        `https://moviesjoy.plus/search/${searchArr}`
      );
      watchHere.setAttribute("target", "_blank");
      result.append(watchHere);
    });
};

//home and logo functionality
const home = () => {
  //reseting the welcome page
  const welcome = document.querySelector(".home-page");
  welcome.classList.remove("hidden");
  //reseting the result container
  const resultDiv = document.querySelector(".search-result");
  resultDiv.classList.add("hidden");
  resultDiv.innerHTML = "";
  //reseting the result of an image clicked
  const result = document.querySelector(".result-clicked");
  result.classList.add("hidden");
  result.innerHTML = "";
  //reseting the body background
  const body = document.querySelector("body");
  body.style.backgroundImage = `url("3435862-landscape-1533822689-nun-cp-001r.jpg")`;
  //reseting the search bar
  const searchTerm = document.querySelector(".search-txt");
  searchTerm.value = "";
};
