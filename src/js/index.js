import Game from './game.js';
import Globals from './global.js';
import Database from './database.js';

Database.loadData();

Globals.changeScreen('INITIAL');
Game.loop();
