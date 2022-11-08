class Player {
    constructor()
    {
        this.name = null;
        this.index = null;
        this.positionX = 0;
        this.positionY = height - 100;
        this.rank = 0;
        this.score = 0;
        this.fuel = 200;
        this.life = 185;
        this.explosion = false;
    }

    getCount()
    {
        var playerCountRef = database.ref("playerCount");
        playerCountRef.on("value",function(data){
            playerCount = data.val();
        });
    }

    addPlayer()
    {
        var playerIndex = "players/player" + this.index;
        if (this.index === 1 ){
            this.positionX = width/2 + 100;
        }
        else{
            this.positionX = width/2 - 100;
        }
        database.ref(playerIndex).set({
            name: this.name,
            positionX: this.positionX,
            positionY: this.positionY,
            rank : this.rank,
            score: this.score
        })
    }

    updateCount(count)
    {
        database.ref("/").update({
            'playerCount': count
        })
    }
    getPlayersInfo()
    {
        var playerRef = database.ref("players");
        playerRef.on("value",function(data){
            allPlayers = data.val();
        });
    }
    update()
    {
        var playerIndex = "players/player" + this.index;
        database.ref(playerIndex).update({
            'positionY': this.positionY,
            'positionX': this.positionX,
            'rank':this.rank,
            'score':this.score,
            'fuel': this.fuel,
            'life':this.life,
            'explosion': this.explosion
        })
    }
    getDistance()
    {
        var playerIndex = "players/player" + this.index;
        database.ref(playerIndex).on("value",data =>{
            var data = data.val();
            this.positionX = data.positionX;
            this.positionY = data.positionY;
        });
    }
    getCarsAtEnd()
    {
        var carsAtEndRef = database.ref("carsAtEnd");
        carsAtEndRef.on("value",data => {
            this.rank = data.val();
        });
    }
   static updateCarsAtEnd(rank)
    {
        database.ref("/").update({
            'carsAtEnd': rank
        })
    }
}

