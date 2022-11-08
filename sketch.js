var database;
var gameState = 0;
var playerCount, allPlayers;
var form, game, player;
var backgroundImg;
var car1Img, car2Img;
var trackImg;
var car1, car2, cars;
var fuelImg;
var goldCoinImg;
var fuel,goldCoin;
var obstacle1Image,obstacle2Image;
var obstacles;
var lifeImage, fuelLevelImg;
var colisionImg;

function preload(){
    backgroundImg = loadImage("assets/planodefundo.png");
    car1Img = loadImage("assets/car1.png");
    car2Img = loadImage("assets/car2.png");
    trackImg = loadImage("assets/PISTA.png");
    fuelImg = loadImage("assets/fuel.png");
    goldCoinImg = loadImage("assets/goldCoin.png");
    obstacle1Image = loadImage("assets/obstacle1.png");
    obstacle2Image = loadImage("assets/obstacle2.png");
    lifeImage = loadImage("assets/life.png");
    fuelLevelImg = loadImage("assets/fuel.png");
    colisionImg = loadImage("assets/blast.png");
}

function setup(){
    createCanvas(windowWidth,windowHeight);
    database = firebase.database();
    game = new Game();
    game.getState();
    game.start();
}

function draw(){
    background(backgroundImg);

    if (playerCount === 2){
        game.update(1);
    }

    if (gameState === 1){
        game.play();
    }
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
}
