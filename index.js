document.addEventListener("DOMContentLoaded", () => {
  const moviePoster = document.getElementById("moviePoster");
  const movieTitle = document.getElementById("movieTitle");
  const movieRuntime = document.getElementById("movieRuntime");
  const movieShowtime = document.getElementById("movieShowtime");
  const movieAvailableTickets = document.getElementById("movieAvailableTickets");
  const buyTicketBtn = document.getElementById("buyTicketbtn");
  const filmList = document.getElementById("films");

  // Fetch movie data from API or JSON and populate film list on page load
  fetch("http://localhost:3000/films")
    .then((response) => response.json())
    .then((movies) => {
      // Clear placeholder li element from the film list
      filmList.innerHTML = "";
      // Loop through movies and create li element for each one
      movies.forEach((movie) => {
        const filmItem = document.createElement("li");
        filmItem.dataset.movieId = movie.id;
        filmItem.textContent = movie.title;

        filmList.appendChild(filmItem);

        // Add event listener to li element to populate movie details when clicked
        filmItem.addEventListener("click", () => {
          fetch(`http://localhost:3000/films/${movie.id}`)
            .then((response) => response.json())
            .then((newMovie) => {
              moviePoster.src = newMovie.poster;
              movieTitle.innerText = newMovie.title;
              movieRuntime.innerText = `Runtime: ${newMovie.runtime} minutes`;
              movieShowtime.innerText = `Showtime: ${newMovie.showtime} `;
              const availableTickets = newMovie.capacity - newMovie.tickets_sold;
              movieAvailableTickets.innerText = `Available Tickets: ${availableTickets}`;

              // Disable buy ticket button if no available tickets
              buyTicketBtn.disabled = availableTickets <= 0;
            })
            .catch((error) => console.error(error));
        });

        // Add movie details to li element
        filmItem.innerHTML = `
          <h2>${movie.title}</h2>
          <img src="${movie.poster}">
          <p>Tickets: ${movie.capacity - movie.tickets_sold}</p>
        `;
      });
    })
    .catch((error) => console.error(error));

  // Add event listener to buy ticket button
  buyTicketBtn.addEventListener("click", () => {
    // Get current available tickets from movie details
    const currentAvailableTickets = parseInt(movieAvailableTickets.innerText.split(" ")[2]);
    if (currentAvailableTickets > 0) {
      // Update available tickets on frontend and API
      const updatedAvailableTickets = currentAvailableTickets - 1;
      movieAvailableTickets.innerText = `Available Tickets: ${updatedAvailableTickets}`;
      fetch(`http://localhost:3000/films/${filmList.querySelector("li.active").dataset.movie.Id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickets_sold: movieCapacity - updatedAvailableTickets })
      })
        .then(response => response.json())
        .catch(error => console.error(error));
    } else {
      // Indicate that movie is sold out
      buyTicketBtn.innerText = "Sold Out";
      buyTicketBtn.disabled = true;

      const filmItem = filmList.querySelector("li.active");
      filmItem.classList.add("sold-out");
    }
  });
});
