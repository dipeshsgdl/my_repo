
class Deck {
    constructor(cards){
        this.cards=cards;
    }
}

var app = Vue.createApp({

    data() {
        return{
            cards: [{name: "aragorn", img: "aragorn.png"}, {name: "legolas", img: "legolas.png"}, {name: "sauron", img:"sauron.png"}, {name: "ring", img:"ring.png"}, {name: "gandalf", img:"gandalf.png"}, {name: "gollum", img:"gollum.png"}, {name: "frodo", img:"frodo.png"}, {name:"gimli", img:"gimli.png"},{name: "aragorn", img: "aragorn.png"}, {name: "legolas", img: "legolas.png"}, {name: "sauron", img:"sauron.png"}, {name: "ring", img:"ring.png"}, {name: "gandalf", img:"gandalf.png"}, {name: "gollum", img:"gollum.png"}, {name: "frodo", img:"frodo.png"}, {name:"gimli", img:"gimli.png"}],
            pairedCards: [],
            player1points : 0,
            player2points : 0,
            player1 : true,
            player1win : true,
            flips : 0,
            end : false,
        }
    },

    created(){
        this.cards.forEach((card) => {
            card.isFlipped = false;
            card.isPair = false;
        });
        for (let i=0; i<this.cards.length-1; i++){
            var shuffledIndex = Math.floor(Math.random()*(i+1));
            var previousCard = this.cards[shuffledIndex];
            this.cards[shuffledIndex] = this.cards[i];
            this.cards[i] = previousCard;
            }
    },

    methods:{
        flipCard(card){
            console.log(this.player1? "player1":"player2");
            if(card.isPair ===true || card.isFlipped===true || this.pairedCards.length ===2){
                return ("");
            }
            else{
            card.isFlipped = true;
            card.isbackFlipped = true;

            
            /* console.log(this.pairedCards); */
            if(this.pairedCards.length<2){
                this.pairedCards.push(card);
                console.log("if length <2:");
                console.log(this.pairedCards);

            }

            if(this.pairedCards.length === 2){
                var flips = this.flips;
                flips++;
                this.flips = flips;
                this.pairing(card);
            }}
        },
        
        pairing(card){
                if (this.pairedCards[0].name === this.pairedCards[1].name){
                    console.log("if 0 name = 1 name");
                    console.log(this.pairedCards[0]);
                    console.log(this.pairedCards[1]);
                    setTimeout(() =>{
                        for (let i=0; i<this.pairedCards.length; i++){
                            this.pairedCards[i].isPair=true;
                        }
                        this.pairedCards=[];
                        if(this.player1 === true){
                            var point = this.player1points;
                            point++;
                            this.player1points = point;
                            this.$forceUpdate();
                            if(this.cards.every(card => card.isPair === true)){
                                this.end = true;
                            }
                                
                            
                        }
                        else{
                            var point = this.player2points;
                            point++;
                            this.player2points = point;
                            this.$forceUpdate();
                            if(this.cards.every(card => card.isPair === true)){
                                this.end = true;
                            }
                            console.log(this.player2points);
                        }
                        /* this.pairedCards.forEach(card => card.isPair = true);
                     this.pairedCards = []; */
                    }, 400); 
                    console.log("after setting pair true");
                    console.log(this.pairedCards[0]);
                    console.log(this.pairedCards[1]);               
                }
                else{
                    console.log("if 0 name not equal to 1 name");

                    console.log("undoing the flip");
                    console.log("before undoing flip;")
                    console.log(this.pairedCards.length);
                    setTimeout(() =>{/* this.pairedCards.forEach(card => card.isFlipped = false);
                        this.pairedCards = []; */
                        for (let i=0; i<this.pairedCards.length; i++){
                            this.pairedCards[i].isFlipped=false;
                        }
                        this.pairedCards=[];                                                             
                       }, 500);
                    if(this.player1 === true){
                        console.log(this.player1? "player1":"player2");
                        this.player1 = false;
                        console.log(this.player1? "player1":"player2");
                    }
                    else{      
                        console.log(this.player1? "player1":"player2");                      
                        this.player1 = true;
                        console.log(this.player1? "player1":"player2");
                    }                     
                    console.log("after undoing flip;")
                    console.log(this.pairedCards);
                }
            },

            restart(){
                this.cards.forEach((card) => {
                card.restart=true;
                card.isFlipped = false;
                card.isPair = false;
                });
                
                this.pairedCards = [];
                this.player1points = 0;
                this.player2points = 0;
                this.player1 = true;
                this.player1win = true;
                this.flips = 0;
                this.end = false;
                for (let i=0; i<this.cards.length-1; i++){
                    var shuffledIndex = Math.floor(Math.random()*(i+1));
                    var previousCard = this.cards[shuffledIndex];
                    this.cards[shuffledIndex] = this.cards[i];
                    this.cards[i] = previousCard;
                    };
                setTimeout(() =>{this.cards.forEach((card) => {
                    card.restart=false;
                })},500);
            }
    },
    computed: {
        whichPlayer: function(){
            
            if(this.cards.every(card => card.isPair != true)){
                console.log(this.player1);
                return(this.player1);
                
            }
            else{
                if (this.player1points > this.player2points){
                    return true;
                }
                else if (this.player1points < this.player2points){
                    return false;
                }
            }
        },
        
        gameOver: function(){
          
            if(this.cards.every(card => card.isPair === true)){
                if (this.player1points > this.player2points){
                    return ("Player 1 is the winner");
                }
                else if (this.player1points < this.player2points){
                    return ("Player 2 is the winner");
                }
                else if(this.player1points == this.player2points){
                    return ("It's a draw");
                }
            }
            else{
                return
            }

        },
    
    }
    });    

app.mount("#app");

  