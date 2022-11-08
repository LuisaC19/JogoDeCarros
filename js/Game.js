class Game{
    constructor(){
        this.resetTitle = createElement("h2");
        this.resetButton = createButton("");
        this.leaderBoard = createElement("h2");
        this.leader1 = createElement("h2");
        this.leader2 = createElement("h2");
        this.carMove = false;
        this.leftButtonDown = false;
    }
    getState(){
        var gameStateRef = database.ref("gameState");
        gameStateRef.on("value", function(data){
            gameState = data.val();
        });
    }
    update(state){
        database.ref("/").update({
            'gameState': state
        });
    }
    start(){
        player = new Player();
        playerCount = player.getCount();
        form = new Form();
        form.display();
        car1 = createSprite( width/2 + 100, height - 100);
        car1.addImage(car1Img);
        car1.addImage("colisão",colisionImg);
        car1.scale = 0.07;
        car2 = createSprite( width/2 - 100, height - 100);
        car2.addImage(car2Img);
        car2.addImage("colisão",colisionImg);
        car2.scale = 0.07;
        cars = [car1,car2];
        fuel = new Group();
        goldCoin = new Group();
        obstacles = new Group();
        this.addSprites(goldCoin,18,goldCoinImg,0.09);
        this.addSprites(fuel,4,fuelImg,0.02);
        var obstaclesPositions = [ 
            { x: width / 2 + 250, y: height - 800, image: obstacle2Image }, 
            { x: width / 2 - 150, y: height - 1300, image: obstacle1Image }, 
            { x: width / 2 + 250, y: height - 1800, image: obstacle1Image }, 
            { x: width / 2 - 180, y: height - 2300, image: obstacle2Image }, 
            { x: width / 2, y: height - 2800, image: obstacle2Image }, 
            { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
            { x: width / 2 + 180, y: height - 3300, image: obstacle2Image }, 
            { x: width / 2 + 250, y: height - 3800, image: obstacle2Image }, 
            { x: width / 2 - 150, y: height - 4300, image: obstacle1Image }, 
            { x: width / 2 + 250, y: height - 4800, image: obstacle2Image }, 
            { x: width / 2, y: height - 5300, image: obstacle1Image }, 
            { x: width / 2 - 180, y: height - 5500, image: obstacle2Image } ];
        this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions);
    }
    handleElements(){
        form.hide();
        form.titleImg.position(40,50);
        form.titleImg.class("gameTitleAfterEffect");
        this.resetTitle.html("Reiniciar Jogo");
        this.resetTitle.class("resetText");
        this.resetTitle.position(width/2 +200, 40);
        this.resetButton.class("resetButton");
        this.resetButton.position(width/2 +230, 100);
        this.leaderBoard.html("O placar foi de:");
        this.leaderBoard.class("resetText");
        this.leaderBoard.position(width/3 -60, 40);
        this.leader1.class("leadersText");
        this.leader1.position(width/3 - 50, 80);
        this.leader2.class("leadersText");
        this.leader2.position(width/3 - 50, 130);
    }
    play(){
        this.handleElements();
        this.handleMousePressed();
        player.getPlayersInfo();
        player.getCarsAtEnd();
        if (allPlayers !== undefined){
            image(trackImg, 0, -height*5, width, height*6);
            this.showLeaderboard();
            drawSprites();
        }
        var index = 0;
        for (var plr in allPlayers){
            var x = allPlayers[plr].positionX;
            var y = allPlayers[plr].positionY;
            var l = allPlayers[plr].life;
            if (l <= 0){
                cars[index].changeImage("colisão");
                cars[index].scale = 0.3;
                player.explosion = true;
                player.update();
            }
            cars[index].position.x = x;
            cars[index].position.y = y;
            if (index + 1 === player.index){
                fill(0);
                textWidth(5);
                textSize(20);
                text(player.name, x - 30, y + 80);
                camera.position.y = y;
                this.handleCoins(index);
                this.handleFuel(index);
                this.handleObstacles(index);
                this.handleCarsCollide(index);
            }
            index += 1;

        }
        this.handleControls();
        const finishLine =-5*height+100;

        if (player.positionY < finishLine){
            player.rank += 1;
            Player.updateCarsAtEnd(player.rank);
            player.update();
            console.log('Alerta');
            this.showRank();
            gameState = 2;
        }
        this.showLife();
        this.showFuel();
    }
    handleControls(){
        console.log(player.explosion);
        if(player.explosion === false){
            if(keyDown(87)){
                player.positionY -= 4;
                player.update(); 
                this.carMove = true;
            }
            else if(this.carMove){
                player.positionY -= 2;
                player.update(); 
            }
            if(keyDown(68) && player.positionX<width/2+350){
                player.positionX += 4;
                this.leftButtonDown = false;
                player.update(); 
            }
            if(keyDown(65)&& player.positionX>width/3-50){
                player.positionX -= 4;
                this.leftButtonDown = true;
                player.update(); 
            }
        }
    }
    showRank() {
        swal({
          //title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
          title: `Incrível!${"\n"}${player.rank}º lugar`,
          text: "Você alcançou a linha de chegada com sucesso!",
          imageUrl:
            "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
          imageSize: "100x100",
          confirmButtonText: "Ok"
        });
      }
      showLife() 
      {
        push();
        image(lifeImage, width / 2 - 130,player.positionY - height/2 + 10, 20, 20);
        fill("white");
        rect(width / 2 - 100,player.positionY - height/2 + 10, 185, 20);
        fill("#f50057");
        rect(width / 2 - 100, player.positionY - height/2 + 10, player.life, 20);
        noStroke();
        pop();
      }
      showFuel() 
      {
        push();
        image(fuelLevelImg, width / 2 - 360,player.positionY - height/2 + 10, 20, 20);
        fill("white");
        rect(width / 2 - 335,player.positionY - height/2 + 10, 200, 20);
        fill("#ffc400");
        rect(width / 2 - 335, player.positionY - height/2 + 10, player.fuel, 20);
        noStroke();
        pop();
      }
    handleObstacles(index){
        if(cars[index].collide(obstacles)&&player.life >0){
            player.life -= 185/5;
            if(this.leftButtonDown){
                player.positionX +=60;
            }
            else{
                player.positionX-=60;
            }
            player.update();
        }

    }
    handleCarsCollide(index){
        if(index===0){
            if(cars[index].collide(cars[1])){
                if(this.leftButtonDown){
                    player.positionX +=60;
                }
                else{
                    player.positionX-=60;
                }
                if(player.life >0){
                    player.life -= 185/2;
                }
                player.update();
            }
        }
        if(index===1){
            if(cars[index].collide(cars[0])){
                if(this.leftButtonDown){
                    player.positionX +=60;
                }
                else{
                    player.positionX-=60;
                }
                if(player.life >0){
                    player.life -= 185/2;
                }
                player.update();
            }
        }
    }
     
    handleMousePressed() {
        this.resetButton.mousePressed(() => {
            database.ref("/").update({
                'carsAtEnd': 0,
                'gameState': 0,
                'playerCount': 0,
                'players': {}
            });
            window.location.reload();
        });
      }
      handleCoins(index){
        cars[index].overlap(goldCoin,function(collector,collected){
            player.score += 10;
            collected.remove();
            player.update();
        })
      }
      handleFuel(index){
        cars[index].overlap(fuel,function(collector,collected){
            player.fuel = 200;
            collected.remove();
        })
        if (this.carMove && player.fuel > 0){
            player.fuel -= 0.3;
        }
        if (player.fuel < 0){
            gameState = this.gameOver();
        }
      }
      showLeaderboard() 
      {
          var leader1, leader2;
          var players = Object.values(allPlayers);
          if (
            (players[0].rank === 0 && players[1].rank === 0) ||
            players[0].rank === 1
          ) {
            // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
            leader1 =
                players[0].rank +
                "&emsp;" +
                players[0].name +
                "&emsp;" +
                players[0].score;
      
            leader2 =
                players[1].rank +
                "&emsp;" +
                players[1].name +
                "&emsp;" +
                players[1].score;
          }
          else{
            leader1 =
                players[1].rank +
                "&emsp;" +
                players[1].name +
                "&emsp;" +
                players[1].score;

            leader2 =
                players[0].rank +
                "&emsp;" +
                players[0].name +
                "&emsp;" +
                players[0].score;
          }
          this.leader1.html(leader1);
          this.leader2.html(leader2);
      }
      addSprites(spriteGroup,spriteCount,images,scale,positions=[])
      {
        for(var i = 0; i < spriteCount; i += 1){
            var x,y;
            if(positions.length==0){
                x = random(width/2 + 150,width/2 - 150);
                y = random(-height*4.5,height-400);
            }
            else{
                x = positions[i].x;
                y = positions[i].y;
                images = positions[i].image;
            }
            var sprite = createSprite(x,y)
            sprite.addImage(images);
            sprite.scale = scale;
            spriteGroup.add(sprite);
        }
    
      }
      gameOver() {
        swal({
          title: `Fim de Jogo`,
          text: "Oops você perdeu a corrida!",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
          imageSize: "100x100",
          confirmButtonText: "Obrigado por jogar"
        });
      }
    
}
