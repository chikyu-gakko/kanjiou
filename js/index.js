import GameMenu from "./scenes/game_menu.js";
import GameSetting from "./scenes/game_setting.js";
import HitsujiGame from "./scenes/hitsuji_game.js";
import HitsujiRanking from "./scenes/hitsuji_ranking.js";
import SekainomojiGameSetting from "./scenes/sekainomoji_game_setting.js";
import GameResult from "./scenes/game_result.js";
import OpenLogo from "./scenes/open_logo.js";
import HowToPlay from "./scenes/how_to_play.js";
import PauseMenu from "./scenes/pause_menu.js";
import SekaiGame from "./scenes/sekai_game.js";
import SekaiPauseMenu from "./scenes/sekai_pause_menu.js";

const gameElement = document.getElementById("game");

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    max: {
      width: 1024,
      height: 768,
    },
  },
  parent: gameElement,
  dom: {
    createContainer: true,
  },
};

const game = new Phaser.Game(config);
game.registry.set(
  "fontFamily",
  "'UD デジタル 教科書体 NP-R', KleeOne, Arial, Sarabun"
);

game.scene.add("game_menu", GameMenu);
game.scene.add("logo", OpenLogo);
game.scene.add("game_setting", GameSetting);
game.scene.add("hitsuji_game", HitsujiGame);
game.scene.add("hitsuji_ranking", HitsujiRanking);
game.scene.add("sekainomoji_game_setting", SekainomojiGameSetting);
game.scene.add("game_result", GameResult);
game.scene.add("how_to_play", HowToPlay);
game.scene.add("pause_menu", PauseMenu);
game.scene.add("sekai_game", SekaiGame);
game.scene.add("sekai_pause_menu", SekaiPauseMenu);
