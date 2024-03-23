import React, { useEffect } from 'react';

function Animal() {
  useEffect(() => {
    const animalCardsContainer = document.getElementById('animalCardsContainer');
    const cardLimit = 11.5;

    for (let i = 0; i < cardLimit; i++) {
      const cardCol = document.createElement('div');
      cardCol.className = 'col md-4';
      cardCol.innerHTML = `
        <div class="card d-flex flex-column h-100" style="border-color: rgb(0, 179, 255);">
          <img class="card-img-top" src="" alt="Card image cap" width="200" height="300" />
          <div class="card text-center border-0">
            <div class="card-body flex-fill">
              <h5 class="card-title"></h5>
              <p class="card-text">
                <div id="favoriteDiv">
                  <form action="/favorite" method="post">
                    <input type="hidden" name="animal_id" value="" />
                    <button id="button" type="submit" class="button" style="color: white;">Favorite</button>
                  </form>
                </div>
              </p>
              <input type="submit" value="View Animal" class="px-3" />
            </div>
          </div>
        </div>
      `;
      animalCardsContainer.appendChild(cardCol);
    }
  }, []);

  return (
    <div className="container">
      <div className="row mt-5" id="animalCardsContainer">
        {/* Animal cards will be dynamically added here */}
      </div>
    </div>
  );
}

export default Animal;
