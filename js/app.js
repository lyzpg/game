var game = {
    level: 1,
    score: 10,
    lives: 9,
    playing: true,
    board: {
        WIDTH: 707,
        HEIGHT: 704,
        TILE_HEIGHT: 83,
        TILE_WIDTH: 101
    },
    writeScore: function() {
        $('#score-value').html(this.score);
    },
    writeLives: function() {
        $('#lives-value').html(this.lives);
    },
    writeLevel: function() {
        $('#level-value').html(this.level);
    },
    increaseScore: function(points) {
        this.score += points;
        this.writeScore();
    },
    decreaseScore: function(points) {
      if (this.score > 0) {
        this.score -= points;
        this.writeScore();
      }
    },
    extraLife: function() {
        this.lives++;
        this.writeLives();
    },
    loseLife: function() {
        this.lives--;
        this.writeLives();
    },
    startPlaying: function() {this.playing = false;},
    stopPlaying: function() {this.playing = true;},
    levelUp: function() {
        // Game over at level 15.
        if (this.level >= 15) {
            this.playing = false;
        } else {
            this.level ++;
            life.reset();
            // Increase difficulty by speeding up enemies each level.
            allEnemies.forEach(function(enemy) {
                enemy.levelUp();
            });
            // Place the food, and if it overlaps the life icon, places food elsewhere
            do {
                food.reset();
            } while (food.checkCollision(life));
            this.writeLevel();
            this.increaseScore(0);
            addEnemies(this, this.level);
        }
    }
};

// Player starts at Y_LIMIT
game.board.Y_LIMIT = game.board.HEIGHT - game.board.TILE_HEIGHT - 47;

// --- Entity object constructor ----
// Parameters: x, y, width, height, xOffset, yOffset, sprite.
// x and y provide location.
// width and height delimit placement of the entity regarding the image.
// xOffset and yOffset provide padding of sorts.
// sprite is the image url, which is loaded by a helper.
var Entity = function(x, y, width, height, xOffset, yOffset, sprite) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.sprite = sprite;
};

// Collision detection code adapted from MDN https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Entity.prototype.checkCollision = function(otherEntity) {
    if (game.playing) {
        if (this.x + this.xOffset < otherEntity.x + otherEntity.width + otherEntity.xOffset &&
            this.x + this.xOffset + this.width > otherEntity.x + otherEntity.xOffset &&
            this.y + this.yOffset < otherEntity.y + otherEntity.yOffset + otherEntity.height &&
            this.height + this.y + this.yOffset > otherEntity.y + otherEntity.yOffset) {
            return true;
        } else {
            return false;
        }
    }
};

// Object's render function is called by renderEntities() in engine.js.
Entity.prototype.render = function() {
    if (game.playing) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// --- Enemy object constructor ---
// Parameters: x, y, speed, yOffset, height, sprite, speed
// Default width of 98 and xOffset of 1.
var Enemy = function(x, y, speed, yOffset, height, sprite) {
    Entity.call(this, x, y, 198, height, 1, yOffset, sprite); //UPDATE: fixed delayed collision
    this.speed = speed;
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Entity;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (game.playing) {
        this.x += this.speed * dt;
        if (this.checkCollision(player)) {
            if (game.score > 0) {
                game.decreaseScore(5);
            }
            game.loseLife();
            if (game.lives > 0) {
                player.reset();
            } else {
                game.playing = false;
            }
        }
        if (this.x > game.board.WIDTH) {
            this.x = -150;
        }
    }
};

// Increase enemy speed
// Parameter: amount (how much you want to increase the speed by)
Enemy.prototype.increaseSpeed = function(amount) {
    this.speed += amount;
};

// Action(s) to perform at each new level: Speed up the enemy a
// small random amount based on level.
// Parameters: game (object) and level (the level the game is on)
Enemy.prototype.levelUp = function(game, level) {
    if (this.level > 10) {
        this.increaseSpeed(getRandomInt(10, 20));
    } else {
        this.increaseSpeed(getRandomInt(5,15));
    }
};

// CarOrange object constructor
// Parameters: x, y (coordinates) will be passed to the Enemy constructor.
// A randomized speed between 50 and 100 is passed to the Enemy constructor,
// as well as a yOffset of 77, height of 67, and the image URL for sprite.
var CarOrange = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(50, 100), 77, 67, 'images/car-orange.png');
};
CarOrange.prototype = Object.create(Enemy.prototype);
CarOrange.prototype.constructor = Enemy;

// CarTeal object constructor
// Parameters: x, y (coordinates) will be passed to the Enemy constructor.
// A randomized speed between 125 and 225 is passed to the Enemy constructor,
// as well as a yOffset of 79, height of 53, and the image URL for sprite.
var CarTeal = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(125, 225), 79, 53, 'images/car-teal.png');
};
CarTeal.prototype = Object.create(Enemy.prototype);
CarTeal.prototype.constructor = Enemy;

// CarGrey object constructor
// Parameters: x, y (coordinates) will be passed to the Enemy constructor.
// A randomized speed between 175 and 250 is passed to the Enemy constructor,
// as well as a yOffset of 73, height of 76, and the image URL for sprite.
var CarGrey = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(175, 250), 73, 76, 'images/car-grey.png');
};
CarGrey.prototype = Object.create(Enemy.prototype);
CarGrey.prototype.constructor = Enemy;

// CarBlue object constructor
// Parameters: x, y (coordinates) will be passed to the Enemy constructor.
// A randomized speed between 150 and 225 is passed to the Enemy constructor,
// as well as a yOffset of 79, height of 52, and the image URL for sprite.
var CarBlue = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(150, 225), 79, 52, 'images/car-blue.png');
};
CarBlue.prototype = Object.create(Enemy.prototype);
CarBlue.prototype.constructor = Enemy;

// CarGreen object constructor
// Parameters: x, y (coordinates) will be passed to the Enemy constructor.
// A randomized speed between 75 and 175 is passed to the Enemy constructor,
// as well as a yOffset of 77, height of 67, and the image URL for sprite.
var CarGreen = function(x, y) {
    Enemy.call(this, x, y, getRandomInt(75, 175), 77, 67, 'images/car-green.png');
};
CarGreen.prototype = Object.create(Enemy.prototype);
CarGreen.prototype.constructor = Enemy;

// Player object constructor
// Calculated x coordinates, calculated y coordinates, width of 67, height of 76,
// xOffset of 17, yOffset of 64, and the image URL for the sprite are being passed to the
// Entity constructor.
var Player = function() {
    Entity.call(this, game.board.TILE_WIDTH * 3, game.board.Y_LIMIT, 67, 76, 17, 64,
        'images/char-cat-girl.png');
};
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Entity;

// Reset player by moving back to starting position
Player.prototype.reset = function() {
    this.x = game.board.TILE_WIDTH * 3;
    this.y = game.board.Y_LIMIT;
};

// When player gets to the other side and has "beat a level"
// call function to reset player and for leveling up in the game
Player.prototype.update = function() {
    if (game.playing) {
        // player made it to the top where y <= 0
        if (this.y <= 0) {
            this.reset();
            game.levelUp();
        }
    }
};

// Move the player left, right, up, or down based on
// the arrow key the user presses. It also prevents
// the player from moving off the board.
Player.prototype.handleInput = function(key) {
    if (game.playing) {
        switch(key) {
            case 'left':
                if (this.x > 0) {
                    this.x -= game.board.TILE_WIDTH;
                }
                break;
            case 'right':
                if (this.x < game.board.WIDTH - game.board.TILE_WIDTH) {
                    this.x += game.board.TILE_WIDTH;
                }
                break;
            case 'up':
                if (this.y > 0) {
                    this.y -= game.board.TILE_HEIGHT;
                }
                break;
            case 'down':
                if (this.y < game.board.Y_LIMIT) {
                    this.y += game.board.TILE_HEIGHT;
                }
                break;
        }
    }
};

// Item object constructor
// Parameters x, y, width, height, xOffset, yOffset, and sprite
// are being passed to the Entity constructor.
var Item = function(x, y, width, height, xOffset, yOffset, sprite) {
    Entity.call(this, x, y, width, height, xOffset, yOffset, sprite);
    // Unique property obtained keeps track if the player got the item.
    // Intended to be set to true when the player touches the item,
    // and to be reset to false at the beginning of each level.
    this.obtained = false;
};
Item.prototype = Object.create(Entity.prototype);
Item.prototype.constructor = Entity;

// Reset the item, intended to be run at the start of each level.
// It resets the object's obtained property to false and moves it to
// a new random location (tile) on the board except for on the grass.
Item.prototype.reset = function() {
    this.obtained = false;
    this.x = game.board.TILE_WIDTH * getRandomInt(0, 7);
    this.y = 80 + game.board.TILE_HEIGHT * getRandomInt(0, 6);
};

// When the player is touching the item, set the item's obtained
// value to true, and run that object's success function. The success
// function is unique to each item and is the action to take once
// the player obtained the item at that level.
Item.prototype.update = function() {
    if (this.checkCollision(player) && this.obtained === false) {
        this.obtained = true;
        if (typeof this.success === 'function') {
            this.success();
        }
    }
};

// Life object constructor.
// Parameters: x, y (coordinates) will be passed to the Item constructor.
// A width of 90, height of 90, xOffset of 7, yOffset of 53 (see note), and
// the image URL for the sprite are being passed to the Item constructor.
// Note: The real yOffset of the life icon image is 48 but using 53 instead
// because the life icon goes beyond the top of the tile and I want the player
// to be on the tile with the majority of the life icon to obtain it.
var Life = function(x, y) {
    Item.call(this, x, y, 90, 90, 7, 53, 'images/Life.png');
};
Life.prototype = Object.create(Item.prototype);
Life.prototype.constructor = Item;

// Action(s) to perform when life is successfully obtained:
// Gain an extra life
Life.prototype.success = function() {
    game.extraLife();
};

// Food object constructor
// Parameters: x, y (coordinates) will be passed to the Item constructor.
// A width of 95, height of 85 (see note), xOffset of 4, yOffset of 58, and
// the image URL for the sprite are being passed to the Item constructor.
// Note: The real height of the food image is 105 but using 85 for height instead
// because the food goes beyond the bottom of the tile and I want the player
// to be on the tile with the majority of the food to obtain it.
var Food = function(x, y) {
    Item.call(this, x, y, 95, 85, 4, 58, 'images/food.png');
};
Food.prototype = Object.create(Item.prototype);
Food.prototype.constructor = Item;

// Action(s) to perform when food is successfully obtained:
// Increase score by 5.
Food.prototype.success = function() {
    game.increaseScore(5);
};

// Instantiate initial objects.
var carOrange = new CarOrange(getRandomInt(-175, -250), 60 + game.board.TILE_HEIGHT);
var carTeal = new CarTeal(getRandomInt(-125, -225), 60 + game.board.TILE_HEIGHT * 2);
var carGrey = new CarGrey(getRandomInt(-75, -125), 60 + game.board.TILE_HEIGHT * 3);
var carBlue = new CarBlue(getRandomInt(-50, -100), 60 + game.board.TILE_HEIGHT * 4);
var player = new Player();
var life = new Life(game.board.TILE_WIDTH * getRandomInt(0, 7),
    80 + game.board.TILE_HEIGHT * getRandomInt(0, 6));
var food = new Food(game.board.TILE_WIDTH * getRandomInt(0, 7),
    80 + game.board.TILE_HEIGHT * getRandomInt(0, 6));
// Make sure food is not placed where it overlaps the life icon
while (food.checkCollision(life)) {
    food.reset();
}

// Any new enemy added must be placed in the allEnemies array.
// engine.js loops through the array to render enemies.
var allEnemies = [carOrange, carTeal, carGrey, carBlue];

// addEnemies function adapted from http://davidbcalhoun.com/2010/is-hash-faster-than-switch-in-javascript/
function addEnemies(game, level) {
    var cases = {};
    cases[2] = function() {
        var carOrange2 = new CarOrange(getRandomInt(-100, -200), 60 + game.board.TILE_HEIGHT * 3);
        allEnemies.push(carOrange2);
    };
    cases[4] = function() {
        var carGrey2 = new CarGrey(getRandomInt(-100, -250), 60 + game.board.TILE_HEIGHT * 2);
        allEnemies.push(carGrey2);
    };
    cases[6] = function() {
        var carTeal2 = new CarTeal(getRandomInt(-100, -175), 60 + game.board.TILE_HEIGHT);
        allEnemies.push(carTeal2);
    };
    cases[8] = function() {
        var carBlue2 = new CarBlue(getRandomInt(-100, -225), 60 + game.board.TILE_HEIGHT * 4);
        allEnemies.push(carBlue2);
    };
    cases[10] = function() {
        var carGreen = new CarGreen(getRandomInt(-150, -250), 60 + game.board.TILE_HEIGHT * 5);
        allEnemies.push(carGreen);
    };
    cases[12] = function() {
        var carGreen2 = new CarGreen(getRandomInt(-100, -200), 60 + game.board.TILE_HEIGHT * 5);
        allEnemies.push(carGreen2);
    };
    cases[14] = function() {
        var carGreen3 = new CarGreen(getRandomInt(-150, -250), 60);
        allEnemies.push(carGreen3);
    };
    cases[16] = function() {
        var carGreen4 = new CarGreen(getRandomInt(-100, -200), 60);
        allEnemies.push(carGreen4);
    };
    cases[18] = function() {
        var carGrey2 = new CarGrey(getRandomInt(-150, -200), -25);
        allEnemies.push(carGrey2);
    };
    cases[20] = function() {
        var carGrey3 = new CarGrey(getRandomInt(-150, -200), -25);
        allEnemies.push(carGrey3);
    };
    if(typeof cases[level] === 'function') {
        // Only executes if defined above.
         cases[level]();
    }
}

// Function code is from from Mozilla Developer Network
// Returns a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

$(document).ready(function(){
    // The Start New Game button will start a new game by reloading
    // the webpage.
    $('#btn-start-game').click(function(){
        location.reload();
    });
});

// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
