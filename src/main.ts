import { Game } from './core/Game';
import { SceneManager } from './core/SceneManager';
import { MenuScene } from './scenes/MenuScene';

const game = new Game();
SceneManager.push(new MenuScene());
game.start();
