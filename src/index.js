document.addEventListener('DOMContentLoaded', () => {
    const characterBar = document.getElementById('character-bar');
    const characterImage = document.getElementById('character-image');
    const characterName = document.getElementById('character-name');
    const characterVotes = document.getElementById('character-votes');
    const votesForm = document.getElementById('votes-form');
    const resetBtn = document.getElementById('reset-btn');
    
    let characters = [];
    let currentCharacter = null;

    // Fetch initial characters
    fetch('http://localhost:3000/characters')
        .then(res => res.json())
        .then(data => {
            characters = data;
            renderCharacterBar();
            if (data.length > 0) showCharacterDetails(data[0]);
        });

    function renderCharacterBar() {
        characterBar.innerHTML = '';
        characters.forEach(character => {
            const span = document.createElement('span');
            span.textContent = character.name;
            span.addEventListener('click', () => showCharacterDetails(character));
            characterBar.appendChild(span);
        });
    }

    function showCharacterDetails(character) {
        currentCharacter = character;
        characterImage.src = character.image;
        characterName.textContent = character.name;
        characterVotes.textContent = character.votes;
    }

    votesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const votesInput = document.getElementById('votes-input');
        const votes = parseInt(votesInput.value);
        
        if (!isNaN(votes) && votes > 0 && currentCharacter) {
            currentCharacter.votes += votes;
            characterVotes.textContent = currentCharacter.votes;
            votesInput.value = '';
        }
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all votes?')) {
            characters.forEach(c => c.votes = 0);
            if (currentCharacter) {
                currentCharacter.votes = 0;
                characterVotes.textContent = 0;
            }
        }
    });
});