(function ($, document) {
   'use strict'

   const app = (function () {

      return {
         init: function () {
            this.getAllGames();
            this.initEvents();
         },

         initEvents: function () {
            this.games = {
               total: 0,
               buttons: []
            };

            this.getGames();
            this.setCompleteGame();
            this.setClearGame();
            this.setAddToCartGame();
            this.setButtonSave();
            this.setTotalCart();
         },

         isReady: function () {
            return this.readyState === 4 && this.status === 200;
         },

         getAllGames: function () {
            const ajax = new XMLHttpRequest();

            ajax.open('GET', '../src/games.json', true);
            ajax.send();
            ajax.addEventListener('readystatechange', this.getGames, false)
         },

         getGames: function () {
            if (!app.isReady.call(this)) return;

            const data = JSON.parse(this.responseText);

            app.setButtonsGames(data);
         },

         setButtonsGames: function (data) {
            const $buttonsGames = $('[data-js="buttons-games"]').get();
            const $spanGameName = $('[data-js="game-name"]').get();

            Object.keys(data).forEach((element, index) => {
               if (index === 1) {

                  data[element].forEach((games, type) => {

                     const $button = document.createElement('button');

                     $button.textContent = games.type;
                     $button.style.borderColor = games.color;
                     $button.style.color = games.color;

                     app.addButton('buttons', type, games.type, $button, games.color, false);

                     if (type === 0) {

                        this.gameAtributes(
                           games.type,
                           games.range,
                           games.price,
                           games['max-number'],
                           games.color
                        )

                        app.games['buttons'][type].isSelected = true;
                        this.setButtonsGamesColor();
                        this.setDescriptionGame(games.description);
                        this.setRangeGame(games.range);
                        $spanGameName.textContent = games.type
                     }

                     $button.addEventListener('click', () => {

                        this.gameAtributes(
                           games.type,
                           games.range,
                           games.price,
                           games['max-number'],
                           games.color
                        )

                        app.games['buttons'].forEach((element, index) => {
                           if (element['id'] === type) {
                              app.games['buttons'][index].isSelected = true;
                           }
                           else {
                              app.games['buttons'][index].isSelected = false;
                           }
                        });

                        $spanGameName.textContent = games.type;

                        this.setButtonsGamesColor();
                        this.setDescriptionGame(games.description);
                        this.setRangeGame(games.range);
                     });

                     $buttonsGames.appendChild($button);

                  })
               }
            })


         },

         addButton: function (key, id, gameName, button, color, isSelected) {
            app.games[key].push({
               id: id,
               gameName: gameName,
               button: button,
               color: color,
               isSelected: isSelected
            });
         },

         gameAtributes: function (type, range, price, maxNumber, color) {
            this.gameNumbers = Array();
            this.gameName = type;
            this.gameRange = range;
            this.gamePrice = price;
            this.gameMaxNumber = maxNumber;
            this.gameColor = color;
         },

         setButtonsGamesColor: function () {
            app.games['buttons'].forEach((element, index) => {
               if (app.games['buttons'][index].isSelected === true) {
                  app.games['buttons'][index].button.style.background = app.games['buttons'][index].color;
                  app.games['buttons'][index].button.style.color = '#ffffff';
               }
               else {
                  app.games['buttons'][index].button.style.background = '';
                  app.games['buttons'][index].button.style.color = app.games['buttons'][index].color;
               }
            });
         },

         setDescriptionGame: function (description) {
            const $descriptionGame = $('[data-js="description-game"]').get();
            $descriptionGame.innerHTML = description
         },

         setRangeGame: function (range) {
            const $buttonsGameRange = $('[data-js="game-range"]').get();
            $buttonsGameRange.innerHTML = ''

            for (let i = 0; i < range; i++) {
               const $buttonNumber = document.createElement('button');

               $buttonNumber.textContent = i + 1;
               $buttonNumber.value = i + 1;
               $buttonNumber.id = i + 1;

               $buttonNumber.addEventListener('click', this.game);

               $buttonsGameRange.appendChild($buttonNumber);
            }
         },

         game: function () {
            if (app.gameNumbers.length < app.gameMaxNumber) {

               if (app.gameNumbers.indexOf(Number(this.value)) === -1) {
                  app.gameNumbers.push(Number(this.value));
                  app.isSelected(this);
               } else {
                  app.gameNumbers.splice(app.gameNumbers.indexOf(Number(this.value)), 1);
                  app.isNotSelected(this);
               }
            }

            else if (app.gameNumbers.indexOf(Number(this.value)) !== -1) {
               app.gameNumbers.splice(app.gameNumbers.indexOf(Number(this.value)), 1);
               app.isNotSelected(this)
            }

            else {
               alert(`Só é possível selecionar ${app.gameMaxNumber} números!`);
            }

         },

         isSelected: function (button) {
            button.style.background = app.gameColor;
            button.style.color = '#ffffff';
         },

         isNotSelected: function (button, color = '') {
            button.style.background = '';
            button.style.color = color;
         },

         setCompleteGame: function () {
            const $buttonCompleteGame = $('[data-js="complete-game"]').get();

            $buttonCompleteGame.addEventListener('click', this.completeGame);
         },

         completeGame: function () {
            if (app.gameNumbers.length < app.gameMaxNumber) {

               while (app.gameNumbers.length < app.gameMaxNumber) {
                  const number = Math.floor((Math.random() * app.gameRange) + 1);

                  if (app.gameNumbers.indexOf(number) === -1) {
                     const $button = document.getElementById(`${number}`);
                     app.gameNumbers.push(number);
                     app.isSelected($button);
                  }
               }
            }

            else {
               alert('Jogo já está completo!');
            }
         },

         setClearGame: function () {
            const $buttonClearGame = $('[data-js="clear-game"]').get();
            $buttonClearGame.addEventListener('click', this.clearGame);
         },

         clearGame: function () {

            app.gameNumbers.forEach((element) => {
               const $button = document.getElementById(`${element}`);
               app.isNotSelected($button);
            })

            app.gameNumbers = [];
         },

         setAddToCartGame: function () {
            const $buttonAddToCart = $('[data-js="cart-game"]').get();
            $buttonAddToCart.addEventListener('click', this.addToCart);
         },

         addToCart: function () {
            if (app.gameNumbers.length === app.gameMaxNumber) {

               const $cart = $('[data-js="games-in-cart"]').get();
               const $game = document.createElement('div');
               const $buttonDelete = app.createButtonDelete();
               const $gameInfo = document.createElement('div');
               const $gameNameAndPrice = document.createElement('div');
               const $numbers = document.createElement('span');
               const $gameName = document.createElement('span');
               const $gamePrice = document.createElement('span');

               $cart.querySelector('.cart-empty').style.display = 'none';

               if (app.games[app.gameName] === undefined) {
                  app.createGame(app.gameName);
               } else {
                  if (app.games[app.gameName].Games.length >= 3) {
                     $cart.style.overflowY = 'auto';
                  }

                  app.games[app.gameName].Games.push(app.gameNumbers);
               }

               app.games.total += app.gamePrice;

               app.sortGameNumbers();

               app.createSpanNumbers($numbers);

               $gameName.style.color = app.gameColor;
               $gameName.textContent = app.gameName;
               $gameName.style.fontStyle = 'italic';
               $gameName.style.textTransform = 'capitalize';

               $gameInfo.style.borderLeft = `4px solid ${app.gameColor}`;

               $gamePrice.textContent = `${app.convertNumberToReal(app.gamePrice)}`;
               $gamePrice.style.fontStyle = 'normal';
               $gamePrice.style.fontWeight = 'normal';

               $gameNameAndPrice.appendChild($gameName);
               $gameNameAndPrice.appendChild($gamePrice);

               $gameInfo.appendChild($numbers);
               $gameInfo.appendChild($gameNameAndPrice);

               $game.setAttribute('class', 'game');
               $gameInfo.setAttribute('class', 'game-info');
               $gameNameAndPrice.setAttribute('class', 'name-and-price');
               $numbers.setAttribute('class', 'numbers');

               $game.appendChild($buttonDelete);
               $game.appendChild($gameInfo);

               $cart.appendChild($game);

               app.setTotalCart();
               app.clearGame();
            }

            else {
               const missing = app.gameMaxNumber - app.gameNumbers.length;
               alert(
                  `Complete o jogo antes de adicionar ao carrinho!\nPor favor, escolha ${missing} ${(missing) > 1 ? 'números' : 'número'} para completar o jogo.`
               )
            }
         },

         setTotalCart: function () {
            const $cartTotal = $('[data-js="total"]').get();
            $cartTotal.innerHTML = `${app.convertNumberToReal(app.games.total)}`;
         },

         createButtonDelete: function () {
            const $div = document.createElement('div');
            const $button = document.createElement('button');

            $button.setAttribute('class', 'fa-solid fa-trash-can');
            $div.setAttribute('class', 'game-trash')
            $button.addEventListener('click', this.handleDeleteGame);

            $div.appendChild($button);

            return $div;
         },

         handleDeleteGame: function () {
            const gameName = this.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[0].textContent;
            let gameNumbers = this.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].textContent;
            const $cart = $('[data-js="games-in-cart"]').get()
            const $gamesInCart = $('[data-js="games-in-cart"]').get();

            $gamesInCart.removeChild(this.parentNode.parentNode);

            app.games.total -= app.games[gameName].Price;

            app.games[gameName].Games.splice(app.games[gameName].Games.indexOf([gameNumbers]));

            if (app.games.total === 0) {
               $cart.querySelector('.cart-empty').style.display = 'block';
            }

            app.setTotalCart();
         },

         setButtonSave: function () {
            const $buttonSave = $('[data-js="save"]').get();
            $buttonSave.addEventListener('click', this.toSave);
         },

         sortGameNumbers: function () {
            (app.gameNumbers).sort(function (a, b) {
               if (a < b) {
                  return -1;
               }
               return true;
            })
         },

         createGame: function (gameName) {
            app.games[gameName] = {
               Games: [app.gameNumbers],
               Price: app.gamePrice
            }
         },

         convertNumberToReal: function (number) {
            return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
         },

         toSave: function () {
            if (app.games.total === 0) {
               return alert('O carrinho está vazio! Por favor, adicione jogos antes de salvar.')
            }
            const confirmBuy = confirm('Deseja finalizar os jogos?');
            if (confirmBuy) {
               alert('Compra realizada com sucesso! Obrigada.')
            }
            console.log(app.games);
         },

         createSpanNumbers: function (span) {
            for (let i = 0; i < app.gameNumbers.length; i++) {
               if (i < app.gameNumbers.length - 1)
                  span.textContent += `${app.gameNumbers[i]}, `;
               else
                  span.textContent += app.gameNumbers[i];
            }
         },

      }
   })();

   app.init();
}
)(window.DOM, document);