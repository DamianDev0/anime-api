const $container = document.getElementById('container');

async function apiUsers() {
    try {
        const response = await fetch('http://localhost:3000/animes');
        const data = await response.json();
        console.log(data);

        data.forEach(anime => {
            const $animeContainer = document.createElement('DIV');
            $animeContainer.classList.add('w-80', 'h-[500px]', 'border', 'border-gray-300', 'p-4', 'flex', 'flex-col',
                 'items-center', 'bg-white', 'shadow-lg', 'rounded-lg');
            $animeContainer.innerHTML = /*html*/`
            <div class="flex flex-col items-center justify-between h-full w-full">
                <img src="http://localhost:3000${anime.image}" alt="${anime.title}" class="w-full h-3/4 object-cover mb-4 rounded-md">
                <h1 class="text-xl font-bold mb-2">${anime.title}</h1>
                <strong class="text-sm">Genre: ${anime.genre}</strong>
                <strong class="text-sm">Studio: ${anime.studioId}</strong>
            </div>
           `;
            $container.appendChild($animeContainer);
        });
    } catch (error) {
        console.error("An error occurred while fetching animes from the API", error);
    }
}

apiUsers();
