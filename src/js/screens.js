import Database from './database.js';
import Globals from './global.js';
import {
    createFlappyBird,
    createPipes,
    createGround,
    createLeaderboard,
    getReadyObj,
    backgroundObj,
    gameOverObj
} from './objects.js';

const Screens = {};

Screens.INITIAL = {
    init() {
        Globals.ground = createGround();
        Globals.flappyBird = createFlappyBird();
    },

    draw() {
        backgroundObj.draw();
        Globals.ground.draw();
        Globals.flappyBird.draw();
        getReadyObj.draw();
    },

    update() {
        Globals.ground.update();
    },

    click() {
        Globals.changeScreen('GAME');
    }
}

Screens.GAME = {
    init() {
        Globals.ground = createGround();
        Globals.flappyBird = createFlappyBird();
        Globals.pipes = createPipes();
        Globals.leaderboard = createLeaderboard();

        Globals.currentPlayerPoints = 0;
    },
    
    draw() {
        backgroundObj.draw();
        Globals.ground.draw();
        Globals.flappyBird.draw();
        Globals.pipes.draw();
        Globals.leaderboard.draw();
    },

    update() {
        Globals.ground.update();
        Globals.flappyBird.update();
        Globals.pipes.update();
        Globals.leaderboard.update();

    },

    click() {
        Globals.flappyBird.doJump();
    }
}

Screens.GAME_OVER = {
    init() {
        if(Globals.currentPlayerPoints > Globals.maxPlayerPoints) {
            Globals.maxPlayerPoints = Globals.currentPlayerPoints;

            Database.saveData({ key: 'maxPointsPlayer', value: Globals.currentPlayerPoints });
        }

    },

    draw() {
        gameOverObj.draw();
    },

    update() {
        Globals.flappyBird.update();
    },

    click() {
        Globals.changeScreen('INITIAL');
    }
}

export default Screens;