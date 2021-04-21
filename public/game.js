// JAVASCRIPT CODE //

const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

// GAME VARS AND CONSTS
let frames = 0;
const DEGREE = Math.PI / 180;
let isChallenge = false;

// LOAD IMAGES
const sprite = new Image();
sprite.src = "img/sprite.png"
const bird1_1 = new Image();
bird1_1.src = "img/bird/frame-1.png"
const bird1_2 = new Image();
bird1_2.src = "img/bird/frame-2.png"
const bird1_3 = new Image();
bird1_3.src = "img/bird/frame-3.png"
const bird1_4 = new Image();
bird1_4.src = "img/bird/frame-4.png"

const blade_1 = new Image();
blade_1.src = "img/blade/blade_1.png"

const blade_2 = new Image();
blade_2.src = "img/blade/blade_2.png"

const blade_3 = new Image();
blade_3.src = "img/blade/blade_3.png"


const background = new Image();
background.src = "img/background.jpg"

const getReadyImg = new Image();
getReadyImg.src = "img/getReady.png"


// LOAD SOUND IMAGES
const volume = new Image();
volume.src = "img/volume.png";
const mute = new Image();
mute.src = "img/mute.png";

// LOAD SOUNDS
const SCORE_S = new Audio("audio/sfx_point.wav");
const FLAP = new Audio("audio/sfx_flap.wav");
const HIT = new Audio("audio/sfx_hit.wav");
const SWOOSHING = new Audio("audio/sfx_swooshing.wav");
const DIE = new Audio("audio/sfx_die.wav");

// GAME STATE
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}


// start button coord
const startBtn = {
    x: 310,
    y: 263,
    w: 83,
    h: 29
}

const soundBtn = {
    x: 32,
    y: 32,
    w: 32,
    h: 32
}

// CONTROL THE GAME
cvs.addEventListener("click", function(evt) {
    let rect = cvs.getBoundingClientRect();
    let clickX = evt.clientX - rect.left;
    let clickY = evt.clientY - rect.top;

    if (clickX > soundBtn.x && clickX <= soundBtn.x + soundBtn.w && clickY >= soundBtn.y && clickY < soundBtn.y + soundBtn.h) {
        if (sound.isSound) {
            sound.isSound = false;
        } else {
            sound.isSound = true;
        }
    }


    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            if (sound.isSound) {
                SWOOSHING.play();
            } else {
                SWOOSHING.pause();
            }

            break;
        case state.game:
            bird.flap();
            if (sound.isSound) {
                FLAP.play();
            } else {
                FLAP.pause();
            }

            challenge(); // this challenge of the game

            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;


            // check if user click on the start button
            if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY < startBtn.y + startBtn.h) {
                reset(); // reset the game
                state.current = state.getReady;
            }
            break;
    }

});

//BACKGROUND
const bg = {
    sX: 0,
    sY: 0,
    w: 470,
    h: 400,
    x: 0,
    y: cvs.height - 500,

    draw: function() {
        ctx.drawImage(background, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(background, this.sX, this.sY, this.w, this.h, this.w, this.y, this.w, this.h);
        ctx.drawImage(background, this.sX, this.sY, this.w, this.h, 2 * this.w, this.y, this.w, this.h);
    }
}

//FOREGROUND
const fg = {
    sX: 276,
    sY: 0,
    w: 220,
    h: 100,
    x: 0,
    y: cvs.height - 100,

    dx: 2,

    draw: function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + 2 * this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + 3 * this.w, this.y, this.w, this.h);
    },

    update: function() {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w / 4);
        }
    },

    reset: function() {
        this.position = [];
        this.gap = 120;
        this.dx = 2;
    }


}

// BIRD
const bird = {
    animation: [
        { bird_frame: bird1_1 },
        { bird_frame: bird1_2 },
        { bird_frame: bird1_3 },
        { bird_frame: bird1_4 },
        { bird_frame: bird1_2 },
    ],
    w: 32,
    h: 32,
    x: 50,
    y: ctx.height / 2 - this.h / 2,

    period: 0,
    radius: 12,
    frame: 0,

    gravity: 0.25,
    jump: 4.6,
    speed: 0,
    rotation: 0,




    draw: function() {
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation);
        ctx.drawImage(bird['bird_frame'], 0, 0, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);

        ctx.restore();
    },

    flap: function() {
        this.speed = -this.jump;
    },

    update: function() {
        // if the game state is get ready state, the bird must flap slowly
        this.period = state.current == state.getReady ? 10 : 5;
        // increment the frame by 1, each period
        this.frame += frames % this.period == 0 ? 1 : 0;
        // frame goes from 0 to 4, then again to 0
        this.frame = this.frame % this.animation.length;

        if (state.current == state.getReady) {
            this.y = 150; //reset position of the bird after game over
            this.rotation = 0 * DEGREE;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            //  check collision in the floor
            if (this.y + this.h / 2 >= cvs.height - fg.h) {
                this.y = cvs.height - fg.h - this.h / 2;
                if (state.current == state.game) {
                    state.current = state.over;
                    if (sound.isSound) {
                        DIE.play();
                    } else {
                        DIE.pause();
                    }

                }
            }

            // if the speed is greater then the jump the bird is falling down
            if (this.speed >= this.jump) {
                this.rotation = 90 * DEGREE;
            } else {
                this.rotation = -25 * DEGREE;
            }

        }



    },

    speedReset: function() {
        this.speed = 0;
    }
}

//GET READY MESSAGE
const getReady = {
    sX: 0,
    sY: 0,
    w: 183,
    h: 266,
    x: cvs.width / 2 - 183 / 2,
    y: 80,

    draw: function() {
        if (state.current == state.getReady) {
            ctx.drawImage(getReadyImg, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }

    }

}

// GAME OVER MESSAGE
const gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: cvs.width / 2 - 225 / 2,
    y: 90,

    draw: function() {
        if (state.current == state.over) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }

}

const pipes = {
    position: [],

    top: {
        sX: 553,
        sY: 0
    },

    bottom: {
        sX: 502,
        sY: 0,
    },

    w: 53,
    h: 400,
    gap: 120,
    maxYpos: -190,
    dx: 2,

    draw: function() {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let topYpos = p.y;
            let bottomYpos = p.y + this.h + this.gap;
            //top pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYpos, this.w, this.h);

            //bottom pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYpos, this.w, this.h);

        }
    },

    update: function() {
        if (state.current !== state.game) return;

        if (frames % 100 == 0) {
            this.position.push({
                x: cvs.width,
                y: this.maxYpos * (Math.random() + 1)
            });
        }

        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];


            let bottomPipeYpos = p.y + this.h + this.gap; // the y position of bottom pipe 


            if (hasCollision(p, this.w, this.h, bottomPipeYpos)) {
                state.current = state.over;
                if (sound.isSound) {
                    HIT.play();
                } else {
                    HIT.pause();
                }
            }


            // move the pipes to the left screen 
            p.x -= this.dx;


            // if pipes go beyond canvas, delete them from the array
            if (p.x + this.w <= 0) {
                this.position.shift()
                score.value += 1;
                if (sound.isSound) {
                    SCORE_S.play();
                } else {
                    SCORE_S.pause();
                }
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    },

    reset: function() {
        this.position = [];
        this.gap = 120;
        this.dx = 2;
    }
}

function challenge() {
    // shrink the gap between pipes and speed the game
    if (score.value == 10) {
        isChallenge = true;
        pipes.gap -= 10;
        pipes.dx += 1;
        fg.dx += 1;
        // this.maxYpos * (Math.random() + 1)
    } else if (score.value == 20) {
        isChallenge = true;
        pipes.gap -= 5;
        pipes.dx += 0.5;
        fg.dx += 0.5;
    } else if (score.value == 30) {
        isChallenge = true;
        pipes.gap -= 2.5;
        pipes.dx += 0.25;
        fg.dx += 0.25;
    }
}

const blade = {
    position: [],
    animation: [
        { blade_frame: blade_1 },
        { blade_frame: blade_2 },
        { blade_frame: blade_3 },
    ],
    sX: 0,
    sY: 0,
    w: 35,
    h: 35,
    dx: 2,
    frame: 0,
    period: 0,
    speedX: 10,
    min: 100,
    max: 350,


    draw: function() {
        this.period = state.current == state.getReady ? 10 : 5;
        this.frame += frames % this.period == 0 ? 1 : 0;
        this.frame = this.frame % this.animation.length;
        let blade = this.animation[this.frame];
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            let topYpos = p.y;
            ctx.drawImage(blade["blade_frame"], this.sX, this.sY, this.w, this.h, p.x, topYpos, this.w, this.h);
        }
    },

    update: function() {
        if (state.current !== state.game) return;
        if (frames % 200 == 0) {
            this.position.push({
                x: cvs.width,
                y: Math.random() * (this.max - this.min + 1) + this.min,
            });
        }

        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];


            if (hasBladeCollision(p, this.w, this.h)) {
                state.current = state.over;
                if (sound.isSound) {
                    HIT.play();
                } else {
                    HIT.pause();
                }
            }

            // move the blade to the left screen 
            p.x -= this.speedX;

            // if blade go beyond canvas, delete them from the array
            if (p.x + this.w <= 0) {
                this.position.shift()
            }
        }
    },

    reset: function() {
        this.position = []
    }
}


function hasBladeCollision(blade, w, h) {
    if (bird.x + bird.radius > blade.x && bird.x - bird.radius < blade.x + w &&
        bird.y + bird.radius > blade.y && bird.y - bird.radius < blade.y + h)
        return true;

    return false;
}


function hasCollision(pipe, w, h, bottomPipeYPos) {
    // collision detection
    // top pipe
    if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + w &&
        bird.y + bird.radius > pipe.y && bird.y - bird.radius < pipe.y + h)
        return true;


    // bottom pipe
    if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + w &&
        bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + h)
        return true;


    //sky 
    if (bird.y <= 0)
        return true;

    return false;
}

const score = {
    best: parseInt(localStorage.getItem("best")) || 0,
    value: 0,

    draw: function() {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000"

        if (state.current == state.game) {
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width / 2, 100);
            ctx.strokeText(this.value, cvs.width / 2, 100);
        } else if (state.current == state.over) {
            // score value
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 415, 186);
            ctx.strokeText(this.value, 415, 186);

            // best score
            ctx.fillText(this.best, 415, 228);
            ctx.strokeText(this.best, 415, 228);
        }
    },

    reset: function() {
        this.value = 0;
    }

}

const sound = {
    sX: 0,
    sY: 0,
    w: 32,
    h: 32,
    x: 32,
    y: 32,

    isSound: true,

    draw: function() {
        if (this.isSound) {
            ctx.drawImage(volume, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        } else {
            ctx.drawImage(mute, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    },
}

const medals = {
    x: 260,
    y: 175,
    w: 45,
    h: 45,

    white: {
        sX: 312,
        sY: 112,
    },

    bronze: {
        sX: 359,
        sY: 157,
    },

    silver: {
        sX: 359,
        sY: 112,
    },

    gold: {
        sX: 312,
        sY: 157,
    },

    draw: function() {
        if (state.current == state.over) {
            switch (true) {
                case (score.value <= 10):
                    ctx.drawImage(sprite, this.white.sX, this.white.sY, this.w, this.h, this.x, this.y, this.w, this.h);
                    break;
                case (score.value > 10 && score.value <= 20):
                    ctx.drawImage(sprite, this.bronze.sX, this.bronze.sY, this.w, this.h, this.x, this.y, this.w, this.h);
                    break;
                case (score.value > 20 && score.value <= 30):
                    ctx.drawImage(sprite, this.silver.sX, this.silver.sY, this.w, this.h, this.x, this.y, this.w, this.h);
                    break;
                case (score.value > 30):
                    ctx.drawImage(sprite, this.gold.sX, this.gold.sY, this.w, this.h, this.x, this.y, this.w, this.h);
                    break;
                default:
                    break;
            }
        }

    }
}

//DRAW
function draw() {
    ctx.fillStyle = "#70c5ce"
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
    sound.draw();
    medals.draw();
    if (isChallenge)
        blade.draw();
}



// UPDATE
function update() {
    bird.update();
    fg.update();
    pipes.update();
    if (isChallenge)
        blade.update();

}

function reset() {
    pipes.reset();
    bird.speedReset();
    score.reset();
    fg.reset();
    blade.reset();
    isChallenge = false;
}

//LOOP

function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop()