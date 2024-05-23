document.addEventListener("DOMContentLoaded", function() {
    const charactersList = document.getElementById("characters-list");
    const loadMoreButton = document.getElementById("load-more");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const modal = document.getElementById("character-modal");
    const closeModal = document.querySelector(".close");
    const characterDetails = document.getElementById("character-details");
    let currentPage = 1;
    let currentSearch = '';

    function clearCharacters() {
        charactersList.innerHTML = '';
        currentPage = 1;
    }

    function showModal(character) {
        characterDetails.innerHTML = `
            <h2>${character.name}</h2>
            <img src="${character.image}" alt="${character.name}">
            <p><strong>Status:</strong> ${character.status}</p>
            <p><strong>Species:</strong> ${character.species}</p>
            <p><strong>Type:</strong> ${character.type || 'N/A'}</p>
            <p><strong>Gender:</strong> ${character.gender}</p>
            <p><strong>Origin:</strong> ${character.origin.name}</p>
            <p><strong>Location:</strong> ${character.location.name}</p>
            <p><strong>Episodes:</strong> ${character.episode.length}</p>
            <p><strong>Created:</strong> ${new Date(character.created).toLocaleDateString()}</p>
        `;
        modal.style.display = "block";
    }

    function loadCharacters(page, name = '') {
        let url = `https://rickandmortyapi.com/api/character?page=${page}`;
        if (name) {
            url += `&name=${name}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(character => {
                    const characterCard = document.createElement("div");
                    characterCard.classList.add("character-card");

                    const characterImage = document.createElement("img");
                    characterImage.src = character.image;

                    const characterName = document.createElement("h2");
                    characterName.textContent = character.name;

                    characterCard.appendChild(characterImage);
                    characterCard.appendChild(characterName);
                    charactersList.appendChild(characterCard);

                    characterCard.addEventListener("click", () => showModal(character));
                });

                if (data.info.next) {
                    loadMoreButton.style.display = 'block';
                } else {
                    loadMoreButton.style.display = 'none';
                }
            })
            .catch(error => console.log("Error fetching data:", error));
    }

    searchButton.addEventListener("click", function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            clearCharacters();
            currentSearch = searchTerm;
            loadCharacters(currentPage, currentSearch);
        }
    });

    loadMoreButton.addEventListener("click", function() {
        currentPage++;
        loadCharacters(currentPage, currentSearch);
    });

    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // Load the first page initially
    loadCharacters(currentPage);
});
