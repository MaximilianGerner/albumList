class Searchbar extends HTMLElement {
  constructor() {
    super();
  }


  connectedCallback() {
    this.innerHTML = `

      <style>
        #search-form {
  display: grid;
  grid-template-columns: auto 60px;
  margin: 0px;
  
  border:0px;
}


#search-input, #search-button {
  background-color:black;
  border:0px;
  border-color:black;
  height:60px;
  margin:0px;
  font-family:"CommitMono Nerd Font";
  font-size:17pt;
  border-style:solid;
  padding:0px 15px;
  color: white;
}


.search-result {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10%;
  margin-right: 10%;
}


#searchResults {
  list-style-type: none;
  margin: 0px;
  border-top: 0px;
  border-right: 5px;
  border-bottom: 5px;
  border-left: 5px;
  border-color: black;
  border-style: solid;
  margin: 0px;

  display:grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
}

#moreBut {

  border-top: 0px;
  border-right: 5px;
  border-left: 5px;
  border-bottom: 5px;

  border-color: black;
  border-style: solid;
  margin: 0px;
  width: 100%;
  text-align: center;

  font-size: 34pt;
  color: grey;


}

#resultWindow{
  background-color: lightgrey;

}


.albumtitle {
  font-size: 16pt;
  font-weight: bold;
}

.albumartist {

}

.albumtitle, .albumartist {
  padding: 7px;
  margin: 0px;
}

</style>



      <div id="search-form">
    <input type="text" id="search-input" placeholder="search for album">
    <button type="button" onclick="showSearchWindow(); return false;" id="search-button"><img src="search-icon.png"
                                                                                              height=30px width=30px
                                                                                              id="search-icon"
                                                                                              alt="Album cover art">
    </button>
</div>

<div id="resultWindow"></div>

<form id="editAlbum"></form>

<script src="/components/search.js"></script>
    `
}
}


customElements.define('searchbar-component', Searchbar);






// Get the elements from the document
    var searchInput = document.getElementById("search-input");


    // Add an event listener to the form submission
    searchInput.addEventListener('keyup', function (event) {

        //event.preventDefault();
        if (event.key == "Enter") {

            showSearchWindow();

        }

    });

    function appendMoreResults(query, searchPage) {

        fetch("http://localhost:8000/api/getAccessToken").then(response => response.text()).then(function (token) {
            fetch("https://api.spotify.com/v1/search?q=" + query + "&type=album&offset=" + 5 * searchPage + "&limit=5",
                {
                    method: 'GET', headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    }
                }).then(response => response.json()).then(function (json) {

                const ul = document.getElementById('searchResults');

                for (var i = 0; i < Object.keys(json.albums.items).length; i++) {

                    var li = document.createElement('li');
                    li.setAttribute("class", "search-result")

                    li.setAttribute("onclick", "editAlbum('" + json.albums.items[i].id + "')");

                    const albumTitle = document.createElement("p");
                    albumTitle.innerHTML = json.albums.items[i].name;
                    albumTitle.setAttribute("class", "albumTitle");

                    li.appendChild(albumTitle);

                    const albumArtist = document.createElement("p");
                    albumArtist.innerHTML = json.albums.items[i].artists[0].name;
                    albumArtist.setAttribute("class", "albumArtist");

                    li.appendChild(albumArtist);

                    const image = document.createElement("img");

                    image.setAttribute("onerror", "this.src='loading.gif';");
                    image.setAttribute("src", json.albums.items[i].images[1].url);
                    image.setAttribute("width", "40%");

                    li.appendChild(image);

                    li.appendChild(albumTitle);
                    li.appendChild(albumArtist);

                    ul.appendChild(li);

                }

                let moreBut = document.getElementById("moreBut");
                moreBut.setAttribute("onclick", "appendMoreResults('" + query + "', " + (searchPage + 1) + ")");

            })
        })
    }


    function showSearchWindow() {
        // Get the value of the input
        const query = encodeURI(searchInput.value);
        // Check if the input is not empty
        if (query) {


            document.getElementById("editAlbum").innerHTML = "";

            const div = document.getElementById("resultWindow");
            div.innerHTML = "";

            const ul = document.createElement('ul');

            ul.setAttribute("id", "searchResults");

            appendMoreResults(query, 0);

            div.appendChild(ul);


            const moreBut = document.createElement("p");
            moreBut.setAttribute("onclick", "appendMoreResults('" + query + "', 1)");
            moreBut.setAttribute("id", "moreBut");
            moreBut.innerHTML = "+";
            div.appendChild(moreBut);


        } else {
            // Display a message if the input is empty
            alert("Please enter a query");
        }
    }


    function editAlbum(id) {
        document.getElementById("resultWindow").innerHTML = "";

        const form = document.getElementById("editAlbum");

        fetch("http://localhost:8000/api/getAccessToken").then(response => response.text()).then(function (token) {
            fetch("https://api.spotify.com/v1/albums/" + id,
                {
                    method: 'GET', headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    }
                }).then(response => response.json()).then(function (json) {


                const coverArtInput = document.createElement("input");
                coverArtInput.setAttribute("name", "coverArtInput");
                coverArtInput.setAttribute("value", json.images[1].url);
                coverArtInput.setAttribute("onchange",
                    "document.getElementById('coverArt').setAttribute('src', this.value)");
                form.appendChild(coverArtInput);

                const coverArt = document.createElement("img");
                coverArt.setAttribute("id", "coverArt");
                coverArt.setAttribute("src", json.images[1].url);
                form.appendChild(coverArt);


                const nameInput = document.createElement("input");
                nameInput.setAttribute("name", "nameInput");
                nameInput.setAttribute("type", "text");
                nameInput.setAttribute("value", json.name);
                form.appendChild(nameInput);


                const artistsList = document.createElement("ul");
                artistsList.setAttribute("name", "artistsList");
                artistsList.setAttribute("id", "artistsList")
                for (let i = 0; i < json.artists.length; i++) {
                    let artistInput = document.createElement("input");
                    artistInput.setAttribute("name", "artistInput" + i);
                    artistInput.setAttribute("type", "text");
                    artistInput.setAttribute("value", json.artists[i].name);
                    artistsList.appendChild(artistInput);
                }
                form.appendChild(artistsList);


                const releaseDateInput = document.createElement("input");
                releaseDateInput.setAttribute("name", "releaseDateInput");
                releaseDateInput.setAttribute("type", "date");
                releaseDateInput.setAttribute("value", json["release_date"]);
                form.appendChild(releaseDateInput);


                const ratingInput = document.createElement("input");
                ratingInput.setAttribute("name", "ratingInput");
                ratingInput.setAttribute("type", "number");
                ratingInput.setAttribute("step", "0.1");
                ratingInput.setAttribute("placeholder", "rating")
                ratingInput.autofocus = true;
                form.appendChild(ratingInput);


                fetch("http://localhost:8000/api/getAccessToken").then(response => response.text()).then(function
                    (token) {
                    fetch("https://api.spotify.com/v1/artists/" + json.artists[0].id,
                        {
                            method: 'GET', headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + token
                            }
                        }).then(response => response.json()).then(function (json) {


                        let genres = "";
                        if (json.genres.length > 0) {
                            genres = json.genres[0];

                            for (let i = 1; i < json.genres.length; i++) {
                                genres += ", " + json.genres[i];
                            }
                        }

                        const genresInput = document.createElement("input");
                        genresInput.setAttribute("name", "genresInput");
                        genresInput.setAttribute("type", "text");
                        genresInput.setAttribute("placeholder", "genres");
                        genresInput.setAttribute("value", genres);
                        form.appendChild(genresInput);


                    })
                });


                const rememberCheck = document.createElement("input");
                rememberCheck.setAttribute("name", "rememberCheck");
                rememberCheck.setAttribute("type", "checkbox");
                //rememberCheck.setAttribute("value", "true");
                form.appendChild(rememberCheck);


                const addButton = document.createElement("button");
                addButton.setAttribute("type", "submit");
                addButton.innerHTML = "Add";
                form.appendChild(addButton);

            })
        });


        document.querySelector("form").addEventListener("submit", function (event) {
            event.preventDefault();


            let artistsLi = document.getElementById("artistsList").getElementsByTagName("input");
            
            let artists = {};
            
            console.log(artistsLi[0]);

            for (let i = 0; i < artistsLi.length; i++) {
                artists[i] = artistsLi[i].value;
                console.log(artistsLi[i].value);
            }


            fetch("http://localhost:8000/api/insertAlbum", {
                method: "POST",
                body: JSON.stringify({
                    albumName: event.target.elements.nameInput.value,
                    releaseDate: event.target.elements.releaseDateInput.value,
                    genres: event.target.elements.genresInput.value,
                    coverLink: event.target.elements.coverArtInput.value,
                    userId: 1,
                    rating: event.target.elements.ratingInput.value,
                    artists: artists
                }),
                headers: {
                    "Content-type": "application/json"
                }
            })
                //.then((response) => response.json())
                .then(function (json) {
                    console.log(json);
                    document.getElementById("editAlbum").innerHTML = "";
                    document.getElementById("search-input").setAttribute("value", "");
                }).catch((err) => alert("Couldn't upload album! (" + err + ")"));

            document.getElementById("editAlbum").innerHTML = "";
            document.getElementById("search-input").setAttribute("value", "");

        });


    }



