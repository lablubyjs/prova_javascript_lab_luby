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
            const games = data;

            for (let type in games.types) {
               const $button = document.createElement('button');

               $button.textContent = games.types[type].type;
               $button.style.borderColor = games.types[type].color;
               $button.style.color = games.types[type].color;


               app.games['buttons'].push({
                  id: type,
                  button: $button,
                  color: games.types[type].color,
                  isSelected: false
               });

               if (type == 0) {
                  this.gameAtributes(
                     games.types[type].type,
                     games.types[type].range,
                     games.types[type].price,
                     games.types[type]['max-number'],
                     games.types[type].color
                  )
                  
                  app.games['buttons'][type].isSelected = true;
                  this.setButtonsGamesColor();
                  this.setDescriptionGame(games.types[type].description);
                  this.setRangeGame(games.types[type].range);
                  $spanGameName.textContent = games.types[type].type
               }

               $button.addEventListener('click', () => {
                  this.gameAtributes(
                     games.types[type].type,
                     games.types[type].range,
                     games.types[type].price,
                     games.types[type]['max-number'],
                     games.types[type].color
                  )

                  app.games['buttons'].forEach((element, index) => {
                     if (element['id'] === type) {
                        app.games['buttons'][index].isSelected = true;
                     }
                     else {
                        app.games['buttons'][index].isSelected = false;
                     }
                  });

                  $spanGameName.textContent = games.types[type].type;

                  this.setButtonsGamesColor();
                  this.setDescriptionGame(games.types[type].description);
                  this.setRangeGame(games.types[type].range);
               });

               $buttonsGames.appendChild($button);
            }

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
            for (let i = 0; i < app.gameNumbers.length; i++) {
               const $button = document.getElementById(`${app.gameNumbers[i]}`);
               app.isNotSelected($button);
            };

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
               alert(
                  `Complete o jogo antes de adicionar ao carrinho!\nPor favor, escolha ${app.gameMaxNumber - app.gameNumbers.length} números para completar o jogo.`
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
            const $cart = $('[data-js="games-in-cart"]').get()
            const $gamesInCart = $('[data-js="games-in-cart"]').get();

            $gamesInCart.removeChild(this.parentNode.parentNode);

            app.games.total -= app.games[gameName].Price;

            if (app.games.total === 0) {
               $cart.querySelector('.cart-empty').style.display = 'block';
            }

            app.setTotalCart();
         },

         setButtonSave: function () {
            const $buttonSave = $('[data-js="save"]').get();
            $buttonSave.addEventListener('click', this.toSave);
         },

         toSave: function () {
            const confirmBuy = confirm('Deseja finalizar os jogos?');
            if (confirmBuy) {
               alert('Compra realizada com sucesso! Obrigada.')
            }
            return app.games;
         },

         createSpanNumbers: function (button) {
            for (let i = 0; i < app.gameNumbers.length; i++) {
               const $number = document.createElement('span');
               if (i < app.gameNumbers.length - 1)
                  $number.textContent = `${app.gameNumbers[i]}, `;
               else
                  $number.textContent = app.gameNumbers[i];
               button.appendChild($number);
            }
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
         }

      }
   })();

   app.init();
}
)(window.DOM, document);