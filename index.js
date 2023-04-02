document.addEventListener("DOMContentLoaded",() => {

    const moviePoster = document.getElementById("moviePoster");
    const movieTitle = document.getElementById("movieTitle");
    const movieRuntime = document.getElementById("movieRuntime");
    const movieShowtime = document.getElementById("movieShowtime");
    const movieAvailableTickets = document.getElementById("movieAvailableTickets");
    const buyTicketsBtn = document.getElementById("buyTicketbtn");
    const filmList = document.getElementById("films");
    
    //We fetch the movie data from API and populates first movie details on page load

    fetch("http://localhost:3000/films")
    .then(response => response.json())
    .then(movie => {
        moviePoster.src = movie.poster;
        movieTitle.innerText = movie.title;
        movieRuntime.innerText = `Runtime: ${movie.runtime} minutes`;
        movieShowtime.innerText = `Showtime: ${movie.showtime} minutes`;
        const availableTickets = movie.capacity - movie.tickets_sold;
        movieAvailableTickets.innerText = `Available Tickets: ${availableTickets}`;

    })
    .catch(error => console.error(error));

    //Fetch movie data from API or jso and populates film list on page load
    fetch('http://localhost:3000/films')
    .then(response => response.json())
    .then(movies => {
     // clear placeholder li element from the fllm list
     filmList.innerHTML = "";
     //Loop through make movies and create li elemwnt for each one 
     movies.forEach(movie => {
        const filmItem = document.createElement("li");
        filmItem.classList.add("filmItem");
        filmItem.innerText = mpovie.title;
     })
    })
})