const $container = document.getElementById('container');

async function apiUsers() {
    try {
        const response = await fetch('http://localhost:3000/animes');
        const data = await response.json();
        console.log(data);

        data.forEach(anime => {
            const $animeContainer = document.createElement('DIV');
            $animeContainer.innerHTML = /*html*/`
            <div class="flex flex-col">
                <h1>${anime.title}</h1>
                <strong>Genre: ${anime.genre}</strong>
                <strong>Studio: ${anime.studioId}</strong>
                <img src="http://localhost:3000${anime.image}" alt="${anime.title}">
            </div>
           `;
            $container.appendChild($animeContainer);
        });
    } catch (error) {
        console.error("An error occurred while fetching animes from the API", error);
    }
}

apiUsers();
