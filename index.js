const characterBar = document.querySelector("#character-bar");
const detailedInfo = document.querySelector("#detailed-info");
const votesForm = document.querySelector("#votes-form");
const inputVotes = document.querySelector("#votes");
const charactersName = document.querySelector("#name");
const charactersImage = document.querySelector("#image");
const charactersVote = document.querySelector("#vote-count");
const resetBtn = document.querySelector("#reset-btn");

const BASE_URL = "http://localhost:3000/characters";

async function getAllCharacters() {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.length === 0) {
      console.log("No characters were found");
    }

    const results = data.map(({ id, name, votes }) => ({ id, name, votes }));

    for (let i = 0; i < results.length; i++) {
      let spanElement = document.createElement("span");
      spanElement.textContent = results[i].name;
      spanElement.setAttribute("data-id", results[i].id);
      spanElement.classList.add("character-name");
      characterBar.appendChild(spanElement);
    }
    return results;
  } catch (error) {
    console.log(error);
  }
}

async function getCharacterInfo(id) {
  id = Number(id);

  try {
    if (!id) {
      console.log("No id is present");
      return;
    }

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!data) {
      console.log("No character found!");
    }

    return data;
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  const allCharacters = await getAllCharacters();

  document.addEventListener("click", async function (e) {
    const target = e.target.closest(".character-name");

    if (target) {
      const id = target.getAttribute("data-id");
      const data = await getCharacterInfo(id);

      charactersName.textContent = data.name;
      charactersImage.setAttribute("src", data.image);
      charactersVote.textContent = data.votes || 0;
    }
  });

  votesForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (charactersName.textContent !== "Character's Name") {
      const character = allCharacters.find(
        (character) => character.name === charactersName.textContent
      );

      if (character) {
        let finalVotes =
          Number(charactersVote.textContent) + Number(inputVotes.value);

        try {
          const response = await fetch(`${BASE_URL}/${character.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ votes: finalVotes }),
          });

          if (response.ok) {
            charactersVote.textContent = finalVotes;
          } else {
            console.log("Failed to update votes");
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Character not found");
      }
    }
  });

  resetBtn.addEventListener("click", async function (e) {
    if (charactersName.textContent !== "Character's Name") {
      const character = allCharacters.find(
        (c) => c.name === charactersName.textContent
      );

      if (character) {
        try {
          const response = await fetch(`${BASE_URL}/${character.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ votes: 0 }),
          });

          return response;
        } catch (error) {
          console.log(error);
          return error;
        }
      }
    }
  });
}

main();