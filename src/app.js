(function ($, document) {
   'use strict'

   const app = (function () {

      return {
         init: function () {
            this.getAllGames();
            this.initEvents();
         },

         initEvents: function () {
            console.log('Init Events');
            this.games = {
               total: 0
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
            let ajax = new XMLHttpRequest();

            ajax.open('GET', '../src/games.json', true);
            ajax.send();
            ajax.addEventListener('readystatechange', this.getGames, false)
         },

         getGames: function () {
            if (!app.isReady.call(this)) return;

            let data = JSON.parse(this.responseText);

            app.setButtonsGames(data);
         },

         setButtonsGames: function (data) {
            let $buttonsGames = $('[data-js="buttons-games"]').get()
            let games = data;

            for (let type in games.types) {
               let $button = document.createElement('button');
               $button.textContent = games.types[type].type;
               $button.addEventListener('click', () => {
                  this.gameName = games.types[type].type;
                  this.gameRange = games.types[type].range;
                  this.gamePrice = games.types[type].price;
                  this.gameMaxNumber = games.types[type]['max-number'];
                  this.gameColor = games.types[type].color;
                  this.gameNumbers = [];

                  this.setDescriptionGame(games.types[type].description);
                  this.setRangeGame(games.types[type].range);
               });
               $buttonsGames.appendChild($button);
            }

         },

         setDescriptionGame: function (description) {
            let $descriptionGame = $('[data-js="description-game"]').get();
            $descriptionGame.innerHTML = description
         },

         setRangeGame: function (range) {
            let $buttonsGameRange = $('[data-js="buttons-game-range"]').get();
            $buttonsGameRange.innerHTML = ''

            for (let i = 0; i < range; i++) {
               let $buttonNumber = document.createElement('button');
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
            else if (app.gameNumbers.length > app.gameMaxNumber) {
               alert('Números máximos atingidos')
            }
            else {
               app.gameNumbers.splice(app.gameNumbers.indexOf(Number(this.value)), 1);
               app.isNotSelected(this)
            }
            console.log('app', app.gameNumbers)
         },

         isSelected: function (button) {
            button.style.background = app.gameColor;
         },

         isNotSelected: function (button) {
            button.style.background = '';
         },

         setCompleteGame: function () {
            let $buttonCompleteGame = $('[data-js="complete-game"]').get();
            $buttonCompleteGame.addEventListener('click', this.completeGame);
         },

         completeGame: function () {

            if (app.gameNumbers.length < app.gameMaxNumber) {
               while (app.gameNumbers.length < app.gameMaxNumber) {
                  let number = Math.floor((Math.random() * app.gameRange) + 1);

                  if (app.gameNumbers.indexOf(number) === -1) {
                     let $button = document.getElementById(`${number}`);
                     app.gameNumbers.push(number);
                     app.isSelected($button);
                  }
               }
            }
            else {
               alert('Jogo já está completo');
            }
         },

         setClearGame: function () {
            let $buttonClearGame = $('[data-js="clear-game"]').get();
            $buttonClearGame.addEventListener('click', this.clearGame);
         },

         clearGame: function () {
            for (let i = 0; i < app.gameNumbers.length; i++) {
               let $button = document.getElementById(`${app.gameNumbers[i]}`);
               app.isNotSelected($button);
            };
            app.gameNumbers = [];
         },

         setAddToCartGame: function () {
            let $buttonAddToCart = $('[data-js="cart-game"]').get();
            $buttonAddToCart.addEventListener('click', this.addToCart);
         },

         addToCart: function () {

            if (app.gameNumbers.length === app.gameMaxNumber) {
               console.log('Adicionando ao carrinho...');

               if (app.games[app.gameName] === undefined) {
                  app.games[app.gameName] = {
                     Games: [app.gameNumbers],
                     Price: app.gamePrice
                  };
               } else {
                  app.games[app.gameName].Games.push(app.gameNumbers);
               }

               app.games.total += app.gamePrice;

               console.log(app.games)
               console.log(app.games.total)

               let $cart = $('[data-js="games-in-cart"]').get();

               let $game = document.createElement('div');
               let $buttonDelete = app.createButtonDelete();
               let $numbers = document.createElement('span');
               let $gameName = document.createElement('span');
               let $gamePrice = document.createElement('span');

               $numbers.textContent = app.gameNumbers;
               $gameName.textContent = app.gameName;
               $gamePrice.textContent = `R$ ${app.gamePrice}`;

               $game.appendChild($buttonDelete);
               $game.appendChild($numbers);
               $game.appendChild($gameName);
               $game.appendChild($gamePrice);

               $cart.appendChild($game);

               app.setTotalCart();
               app.clearGame();
            }
            else {
               alert('Complete o jogo para adicionar ao carrinho')
            }
         },

         setTotalCart: function () {
            let $cartTotal = $('[data-js="total-cart"]').get();
            $cartTotal.innerHTML = `R$ ${app.games.total}`;
         },

         createButtonDelete: function () {
            let $button = document.createElement('button')
            $button.textContent = 'Deletar';
            $button.addEventListener('click', this.handleDeleteGame)
            return $button;
         },

         handleDeleteGame: function () {
            console.log('Deletando do carrinho...')
            let gameName = this.parentNode.childNodes[2].textContent;
            let gameNumbers = this.parentNode.childNodes[1].textContent;

            let $gamesInCart = $('[data-js="games-in-cart"]').get();

            $gamesInCart.removeChild(this.parentNode);

            app.games.total -= app.games[gameName].Price;
            app.games[gameName].Games.splice(app.games[gameName].Games.indexOf([gameNumbers]));

            app.setTotalCart();
         },

         setButtonSave: function () {
            let $buttonSave = $('[data-js="save"]').get();
            $buttonSave.addEventListener('click', this.toSave);
         },

         toSave: function () {
            let confirmBuy = confirm('Deseja finalizar os jogos?');
            if (confirmBuy) {
               alert('Compra realizada com sucesso! Obrigada.')
            }
            return app.games;
         }

      }
   })();

   app.init();
}
)(window.DOM, document);