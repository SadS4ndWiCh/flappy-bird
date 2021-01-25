import { canvas, ctx } from './canvas.js';
import Globals from './global.js';
import Utils from './utils.js';

const sprites = new Image();
sprites.src = './assets/sprites.png'

function createFlappyBird() {
    const flappyBirdObj = {
        spriteX: 0,
        spriteY: 0,
        width: 33,
        height: 24,
        x: 10,
        y: 50,
        jump: 4.6,
        gravity: 0.25,
        velocity: 0,
        currentFrame: 0,
        movements: [
            { spriteX: 0, spriteY: 0 },
            { spriteX: 0, spriteY: 26 },
            { spriteX: 0, spriteY: 52 },
            { spriteX: 0, spriteY: 26 },
        ],

        update() {
            if(flappyBirdObj.collideGround()) {
                Globals.changeScreen('GAME_OVER');
            }

            flappyBirdObj.velocity = flappyBirdObj.velocity + flappyBirdObj.gravity;
            flappyBirdObj.y = flappyBirdObj.y + flappyBirdObj.velocity;
        },

        draw() {
            flappyBirdObj.updateCurrentFrame();
            const { spriteX, spriteY } = flappyBirdObj.movements[flappyBirdObj.currentFrame];

            ctx.drawImage(
                sprites,
                spriteX, spriteY,
                flappyBirdObj.width, flappyBirdObj.height,
                flappyBirdObj.x, flappyBirdObj.y,
                flappyBirdObj.width, flappyBirdObj.height
            )
        },

        updateCurrentFrame() {
            const framesInterval = 10;
            const passedInterval = Globals.frames % framesInterval === 0;

            if(passedInterval) {
                const incrementBase = 1;
                const increment = incrementBase + flappyBirdObj.currentFrame;
                const repeatBase = flappyBirdObj.movements.length;

                flappyBirdObj.currentFrame = increment % repeatBase;
            }
        },

        doJump() {
            flappyBirdObj.velocity = -flappyBirdObj.jump;
        },

        collideGround() {
            return ( flappyBirdObj.y + flappyBirdObj.velocity ) >= Globals.ground.y
        },

        earnPoints(amount) {
            Globals.currentPlayerPoints += amount;
        }
    }

    return flappyBirdObj;
}

const getReadyObj = {
    spriteX: 134,
    spriteY: 0,
    width: 174,
    height: 152,
    x: ( canvas.width / 2 ) - 174 / 2,
    y: 50,

    draw() {
        ctx.drawImage(
            sprites,
            getReadyObj.spriteX, getReadyObj.spriteY,
            getReadyObj.width, getReadyObj.height,
            getReadyObj.x, getReadyObj.y,
            getReadyObj.width, getReadyObj.height
        )
    }
}

const backgroundObj = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,

    draw() {
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            sprites,
            backgroundObj.spriteX, backgroundObj.spriteY,
            backgroundObj.width, backgroundObj.height,
            backgroundObj.x, backgroundObj.y,
            backgroundObj.width, backgroundObj.height
        )

        ctx.drawImage(
            sprites,
            backgroundObj.spriteX, backgroundObj.spriteY,
            backgroundObj.width, backgroundObj.height,
            ( backgroundObj.x + backgroundObj.width ), backgroundObj.y,
            backgroundObj.width, backgroundObj.height
        )
    }
}

function createPipes() {
    const pipesObj = {
        width: 52,
        height: 400,
    
        topPipe: { spriteX: 52, spriteY: 169 },
        bottomPipe: { spriteX: 0, spriteY: 169 },
    
        spaceBetween: 80,
        pointsPerPipe: 100,
        pipes: [],
    
        update() {
            const framesInterval = 100;
            const passedInterval = Globals.frames % framesInterval === 0;
            if(passedInterval) {
                pipesObj.pipes.push({ x: canvas.width, y: -150 * ( Math.random() + 1 ) });
            }

            pipesObj.pipes.forEach(pipe => {
                pipe.x = pipe.x - 2;

                if(pipesObj.collideFlappyBird(pipe)) {
                    Globals.changeScreen('GAME_OVER');
                }

                if(pipesObj.wasFlappyBirdTraveled(pipe)) {
                    Globals.flappyBird.earnPoints(pipesObj.pointsPerPipe);
                }

                if(pipe.x + pipesObj.width < -1)
                    pipesObj.pipes.shift();

            });
        },

        draw() {
            const { topPipe, bottomPipe } = pipesObj;
    
            pipesObj.pipes.forEach(pipe => {
                const topX = pipe.x;
                const topY = pipe.y;

                ctx.drawImage(
                    sprites,
                    topPipe.spriteX, topPipe.spriteY,
                    pipesObj.width, pipesObj.height,
                    topX, topY,
                    pipesObj.width, pipesObj.height
                );

                const bottomX = pipe.x;
                const bottomY = pipe.y + pipesObj.height + pipesObj.spaceBetween;

                ctx.drawImage(
                    sprites,
                    bottomPipe.spriteX, bottomPipe.spriteY,
                    pipesObj.width, pipesObj.height,
                    bottomX, bottomY,
                    pipesObj.width, pipesObj.height
                );

                pipe.pipeTop = {
                    x: topX,
                    y: pipesObj.height + topY,
                }

                pipe.pipeBottom = {
                    x: bottomX,
                    y: bottomY,
                }
            });
        },

        collideFlappyBird(pipe) {
            const { flappyBird } = Globals;

            const flappyBirdTop = flappyBird.y;
            const flappyBirdBottom = flappyBird.y + flappyBird.height;

            if(( flappyBird.x + flappyBird.width ) >= pipe.x) {
                return flappyBirdTop <= pipe.pipeTop.y || flappyBirdBottom >= pipe.pipeBottom.y    
            }
        },

        wasFlappyBirdTraveled(pipe) {
            if(!pipe.wasTraveled) {
                const flappyBird = Globals.flappyBird;
                
                if((flappyBird.x + (flappyBird.width / 2)) >= (pipe.x + (pipesObj.width / 2))) {
                    pipe.wasTraveled = true;
                    return true
                }
            }

            return false;
        }
    }

    return pipesObj;
}

const medalsObj = {
    width: 44,
    height: 44,

    x: 73,
    y: 137,

    medals: {
        none: { spriteX: 0, spriteY: 78, },
        bronze: { spriteX: 48, spriteY: 124, },
        silver: { spriteX: 48, spriteY: 78, },
        gold: { spriteX: 0, spriteY: 124, },
    },

    // Draw a specific medal
    draw(medalName='none') {
        const { spriteX, spriteY } = medalsObj.medals[medalName];

        ctx.drawImage(
            sprites,
            spriteX, spriteY,
            medalsObj.width, medalsObj.height,
            medalsObj.x, medalsObj.y,
            medalsObj.width, medalsObj.height
        )
    },

    getMedalByPoints(points) {
        if(points < 10) return 'none'
        else if(points >= 10 && points < 20) return 'bronze'
        else if(points >= 20 && points < 40) return 'silver'
        else if(points >= 40) return 'gold'
        
    }
}

function createGround() {
    const groundObj = {
        spriteX: 0,
        spriteY: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
    
        update() {
            const groundMove = 1;
            const repeatIn = groundObj.height / 2;
            const movement = groundObj.x - groundMove;
    
            groundObj.x = movement % repeatIn;
        },
    
        draw() {
            ctx.drawImage(
                sprites,
                groundObj.spriteX, groundObj.spriteY,
                groundObj.width, groundObj.height,
                groundObj.x, groundObj.y,
                groundObj.width, groundObj.height
            )
    
            ctx.drawImage(
                sprites,
                groundObj.spriteX, groundObj.spriteY,
                groundObj.width, groundObj.height,
                ( groundObj.x + groundObj.width ), groundObj.y,
                groundObj.width, groundObj.height
            )
        },        
    }

    return groundObj;
}

const gameOverObj = {
    spriteX: 134,
    spriteY: 153,
    width: 226,
    height: 200,
    x: ( canvas.width / 2 ) - 226 / 2,
    y: 50,

    medalPosition: {
        x: 73, y: 137
    },

    currentScorePosition: {
        x: 252, y: 148
    },

    bestScorePosition: {
        x: 252, y: 190
    },

    draw() {
        ctx.drawImage(
            sprites,
            gameOverObj.spriteX, gameOverObj.spriteY,
            gameOverObj.width, gameOverObj.height,
            gameOverObj.x, gameOverObj.y,
            gameOverObj.width, gameOverObj.height
        );

        Utils.writeText(
            `${Globals.currentPlayerPoints}`,
            gameOverObj.currentScorePosition.x,
            gameOverObj.currentScorePosition.y,
        );

        Utils.writeText(
            `${Globals.maxPlayerPoints}`,
            gameOverObj.bestScorePosition.x,
            gameOverObj.bestScorePosition.y
        );
        
        const medal = medalsObj.getMedalByPoints(Globals.currentPlayerPoints);
        medalsObj.draw(medal);
    },
}

function createLeaderboard() {
    const leaderboardObj = {
        x: canvas.width - 15,
        y: 35,
        
        draw() {
            Utils.writeText(
                `${Globals.currentPlayerPoints}`,
                leaderboardObj.x,
                leaderboardObj.y
            );
        },

        update() {
            const framesInterval = 240;
            const passedInterval = Globals.frames % framesInterval === 0;

            //if(passedInterval)
            //    Globals.currentPlayerPoints++;
        }
    }

    return leaderboardObj
}

export {
    createFlappyBird,
    createPipes,
    createGround,
    createLeaderboard,
    getReadyObj,
    backgroundObj,
    medalsObj,
    gameOverObj,
}