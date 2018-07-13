// The scaffolding necessary to Phaser
var actions = { preload: preload, create: create, update: update };
var game = new Phaser.Game(790,400, Phaser.AUTO, "game", actions);

// Global score variable initialised to 0.
var score = -2;
// Global variable to hold the text displaying the score.
var labelScore;
// Global player variable declared but not initialised.
var player;
// Global pipes variable initialised to the empty array.
var pipes = [];
// the interval (in seconds) at which new pipe columns are spawned
var pipeInterval = 2.0;


// Loads all resources for the game and gives them names.
function preload() {
    // make image file available to game and associate with alias playerImg
    game.load.image("playerImg","../assets/Flappy-cropped.png");
    // make sound file available to game and associate with alias score
    game.load.audio("score", "../assets/point.ogg");
    // make image file available to game and associate with alias pipe
    game.load.image("pipe","../assets/pipe.png");

    game.load.image("screenshot","assets/screenshotOver.png");
}

// Initialises the game. This function is only called once.
function create() {
    // set the background colour of the scene
    game.stage.setBackgroundColor("#000000");
    // add welcome text
    game.add.text(20, 20, "press ENTER to start",
        {font: "30px Arial", fill: "#FFFFFF"});
    // add score text
    labelScore = game.add.text(20, 60, "0",
    {font: "30px Arial", fill: "#FFFFFF"});
    // initialise the player and associate it with playerImg
    player = game.add.sprite(80, 200, "playerImg");

    // Start the ARCADE physics engine.
    // ARCADE is the most basic physics engine in Phaser.
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // enable physics for the player sprite
    game.physics.arcade.enable(player);
    // set the player's gravity
    player.body.gravity.y = 250;

    // associate spacebar with jump function
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(startGame);

    // time loop to keep generating new pipes
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);

    game.paused = true;
}

// This function updates the scene. It is called for every new frame.
function update() {
    // Call gameOver function when player overlaps with any pipe
    game.physics.arcade.overlap(player, pipes, gameOver);

    if (player.y >= 400)
    {
      gameOver();
    }
    if (player.y <= 0)
    {
      gameOver();
    }
}
// Adds a pipe part to the pipes array
function addPipeBlock(x, y) {
    // make a new pipe block
    var block = game.add.sprite(x,y,"pipe");
    // insert it in the pipe array
    pipes.push(block);
    // enable physics engine for the block
    game.physics.arcade.enable(block);
    // set the block's horizontal velocity to a negative value
    // (negative x value for velocity means movement will be towards left)
    block.body.velocity.x = -200;
}

// Generate moving pipe
function generatePipe() {
    // Generate  random integer between 1 and 5. This is the location of the
    // start point of the gap.
    var gapStart = game.rnd.integerInRange(1, 5);
    // Loop 8 times because 8 blocks fit in the canvas.
    for (var count = 0; count < 8; count++) {
        // If the value of count is not equal to the gap start point
        // or end point, add the pipe image.
        if(count != gapStart && count != gapStart+1){
            addPipeBlock(790, count * 50);
        }
    }
    // Increment the score each time a new pipe is generated.
    changeScore();
}

function playerJump() {
    // the more negative the value the higher it jumps
    player.body.velocity.y = -125;
}

// Function to change the score
function changeScore() {
    //increments global score variable by 1
    score++;
    // updates the score label
    labelScore.setText(score.toString());
    game.sound.play("score");
}

function gameOver() {
    // stop the game (update() function no longer called)
    score = -2;
    game.state.restart();
}
function startGame() {
  game.paused = false;
}
