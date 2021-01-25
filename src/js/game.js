import Screens from './screens.js';
import Globals from './global.js';

let currentFrame = 0;

const Game = {
    currentScreen: null,

    loop() {
        Game.currentScreen.draw();
        if(Game.currentScreen.update)
            Game.currentScreen.update();

        Globals.frames++;
        requestAnimationFrame(Game.loop);
    }
}

Globals.changeScreen = (newScreen) => {
    Game.currentScreen = Screens[newScreen];

    if(Game.currentScreen.init)
        Game.currentScreen.init();
}

Globals.currentPlayerPoints = 0;
Globals.maxPlayerPoints = 0;

document.addEventListener('click', () => {
    if(Game.currentScreen.click)
        Game.currentScreen.click();
});

export default Game;