document.addEventListener("DOMContentLoaded", () => {
  const moviePoster = document.getElementById("moviePoster");
  const movieTitle = document.getElementById("movieTitle");
  const movieRuntime = document.getElementById("movieRuntime");
  const movieShowtime = document.getElementById("movieShowtime");
  const movieAvailableTickets = document.getElementById( "movieAvailableTickets");
  const buyTicketBtn = document.getElementById("buyTicketbtn");
  const filmList = document.getElementById("films");

  //We fetch the movie data from API and populates first movie details on page load

  // fetch("http://localhost:3000/films")
  //   .then((response) => response.json())
  //   .then((movie) => {
  //     console.log(movie);
  //     moviePoster.src = movie.poster;
  //     movieTitle.innerText = movie.title;
  //     movieRuntime.innerText = `Runtime: ${movie.runtime} minutes`;
  //     movieShowtime.innerText = `Showtime: ${movie.showtime} minutes`;
  //     const availableTickets = movie.capacity - movie.tickets_sold;
  //     movieAvailableTickets.innerText = `Available Tickets: ${availableTickets}`;
  //   })
  //   .catch((error) => console.error(error));

  //Fetch movie data from API or json and populates film list on page load
  fetch("http://localhost:3000/films")
    .then((response) => response.json())
    .then((movies) => {
      // clear placeholder li element from the fllm list
      filmList.innerHTML = "";
      //Loop through make movies and create li element for each one
      movies.forEach((movie) => {
              // console.log(movie);
      const filmItem = document.createElement("li");
      filmItem.classList.add("film", "item");
      filmItem.innerText = movie.title;
      moviePoster.src = movie.poster;
      movieTitle.innerText = movie.title;
      movieRuntime.innerText = `Runtime: ${movie.runtime} minutes`;
      movieShowtime.innerText = `Showtime: ${movie.showtime} minutes`;
      const availableTickets = movie.capacity - movie.tickets_sold;
      movieAvailableTickets.innerText = `Available Tickets: ${availableTickets}`;
      
       filmItem.innerHTML = movie.title;
        filmList.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="${moviePoster.src}">
        <p>Tickets: ${availableTickets}</p>
       
      `;

        // Add event listener to li element to populate movie details and when clicked
        filmItem.addEventListener("click", () => {
          fetch(`http://localhost:3000/films/${movie.id}`)
            .then((response) => response.json())
            .then((newMovie) => {
              moviePoster.src = newMovie.poster;
              movieTitle.innerText = newMovie.title;
              movieRuntime.innerText = `Runtime: ${newMovie.runtime} minutes`;
              movieShowtime.innerText = `Showtime: ${newMovie.showtime}`;
              const availableTickets =
                newMovie.capacity - newMovie.tickets_sold;
              movieAvailableTickets.innerText = `Available Tickets: ${availableTickets}`;

              // Disable buy ticket button if no available tickets
              buyTicketBtn.disabled = availableTickets <= 0;
            })
            .catch((error) => console.error(error));
        });

        //Add event listener to buy ticket button
        buyTicketBtn.addEventListener("click", () => {
            // get current available tickets from movie details
            const currentAvailableTickets = parseInt(movieAvailableTickets.innerText.split(" ")[2]);
            if (currentAvailableTickets > 0) {
                // update available tickets on frontend and API
                const updatedAvailableTickets = currentAvailableTickets - 1;
                movieAvailableTickets.innerText = `Available Tickets: ${updatedAvailableTickets}`;
                fetch('http://localhost:3000/films', {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tickets_sold: movie.capacity - updatedAvailableTickets })
                })
                    .then(response => response.json())
                    .catch(error => console.error(error));
            } else {
                // indicate that movie is sold out
                buyTicketBtn.innerText = "Sold Out";
                buyTicketBtn.disabled = true;
        
                const filmItem = document.querySelector(`li.filmItem[data-movie-id="${movie.id}"]`);
                filmItem.classList.add("sold-out");
            }
        });                                      
      });
    });
});
