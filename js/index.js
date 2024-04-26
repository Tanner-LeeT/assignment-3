var searchButton = document.getElementById('search-button');
var favoritesButton = document.getElementById('favorites-button');
var searchTab = document.getElementById('search-tab');
var favoritesTab = document.getElementById('favorites-tab');
var searchForm = document.getElementById('search-form');
var query = document.getElementById('query');
var albumsPayload;
var favoritesPayload;
var favoriteAlbums = [];

favoritesButton.addEventListener('click', switchToFavoritesTab);
searchButton.addEventListener('click', switchtoSearchTab);
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    displaySearchResults(query.value);
});

//Add to favorite event 
document.addEventListener('click', function(event) {

    // Checking if the clicked element is the "Add to Favorites" button
    if (event.target && event.target.classList.contains('btn-success')) {
        var button = event.target;
        var albumId = button.dataset.albumId; // Retrieveing the album ID from data attribute
        console.log('Clicked album ID:', albumId);
        var clickedAlbum = albumsPayload.find(album => album.id === albumId); // Finding the album by ID
        console.log('Clicked album:', clickedAlbum);
        if (clickedAlbum && !favoriteAlbums.some(album => album.id === albumId)) {
            favoriteAlbums.push(clickedAlbum); // Adding the album to favorites
            displayFavoriteAlbums(); // Updating the displayed favorite albums
            addToFavorites(clickedAlbum);
        }
    }
});

//Remove from favorite event
document.addEventListener('click', function(event) {
    // Checking if the clicked element is the "Remove from Favorites" button
    if (event.target && event.target.classList.contains('btn-danger')) {
        var button = event.target;
        var albumId = button.dataset.albumId; // Retrieving the album ID from data attribute
        console.log('Clicked album ID:', albumId);
        var indexToRemove = favoriteAlbums.findIndex(album => album.id === albumId); // Finding the index of the album in favorites
        console.log('Index to remove:', indexToRemove);
        if (indexToRemove !== -1) {
            favoriteAlbums.splice(indexToRemove, 1); // Removing the album from favorites
            console.log('Album removed from favorites:', favoriteAlbums);
            displayFavoriteAlbums(); // Updating the displayed favorite albums
            removeFromFavorites(indexToRemove)
        } else {
            console.log('Album not found in favorites:', albumId);
        }
    }
});

async function appInit(){
    const albums = await fetch('https://66194cb4125e9bb9f299a48d.mockapi.io/album/api/albums');
    const favorites = await fetch('https://66194cb4125e9bb9f299a48d.mockapi.io/album/api/favorites')
    albumsPayload = await albums.json(); 
    favoritesPayload = await favorites.json();
    console.log(albumsPayload);
    console.log(favoritesPayload);
}

appInit();

async function addToFavorites(albumData) {
    try {
        const response = await fetch('https://66194cb4125e9bb9f299a48d.mockapi.io/album/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(albumData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to add album to favorites');
        }

        const addedAlbum = await response.json();
        console.log('Added album to favorites:', addedAlbum);
        return addedAlbum;
    } catch (error) {
        console.error('Error adding album to favorites:', error);
    }
}

async function removeFromFavorites(albumToRemove) {
    try {
        // Finding the index of the album to remove in the favoriteAlbums array
        const indexToRemove = favoriteAlbums.findIndex(album => album.id === albumToRemove.id);

        if (indexToRemove !== -1) {
            favoriteAlbums.splice(indexToRemove, 1); // Removing the album from favorites array
            console.log('Removed album from favorites:', albumToRemove);
            displayFavoriteAlbums(); // Updating the displayed favorite albums
        } else {
            console.log('Album not found in favorites:', albumToRemove);
        }

    } catch (error) {
        console.error('Error removing album from favorites:', error);
    }
}

function displaySearchResults(query){
    // Clearing previous search results
    var searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';

    // Converting the query to lowercase
    var lowercaseQuery = query.toLowerCase();

    // Filtering albums based on the query, using both album name and artist name
    var filteredAlbums = albumsPayload.filter(function(album){
        return album.albumName.toLowerCase().includes(lowercaseQuery) || 
               album.artistName.toLowerCase().includes(lowercaseQuery);
    });

    // Displaying search results
    filteredAlbums.forEach(album => {

        const albumHTML = `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
            <div class="fw-bold">
           ${album.albumName}
            <span class="badge bg-primary rounded-pill">${album.averageRating}</span>
            </div>
            <span>${album.artistName}</span>
            </div>
            <button type="button" class="btn btn-success" data-album-id="${album.id}">Add to Favorites</button>
        </li>`;
    
        searchResultsContainer.innerHTML += albumHTML;
    });
}

function displayFavoriteAlbums(){
    const favoritesDiv = document.getElementById('favorites')
    favoritesDiv.innerHTML = '';
    favoritesPayload.forEach(album => {

        favoriteAlbums.push(album);
        
    });
    favoriteAlbums.forEach(album => {

        const ConstructHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">
                    ${album.albumName}
                    <span class="badge bg-primary rounded-pill">${album.averageRating}</span>
                </div>
                <span>${album.artistName}</span>
            </div>
            <button type="button" data-album-id="${album.id}" class="btn btn-danger">Remove from Favorites</button>
        </li> 
        `;
        favoritesDiv.innerHTML += ConstructHTML;
    });
}

function switchToFavoritesTab(e){
    favoritesTab.classList.remove('d-none');
    favoritesButton.classList.add('active');
    searchTab.classList.add('d-none');
    searchButton.classList.remove('active');
    displayFavoriteAlbums();
}

function switchtoSearchTab(e){
    searchTab.classList.remove('d-none');
    searchButton.classList.add('active');
    favoritesTab.classList.add('d-none');
    favoritesButton.classList.remove('active');
}