import GameMenu from "./game_menu.js";
import GameSetting from "./game_setting.js";
import HitsujiGame from "./hitsuji_game.js";
import GameResult from "./game_result.js";
import OpenLogo from "./open_logo.js";
import HowToPlay from "./how_to_play.js";
import PauseMenu from "./pause_menu.js";

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
};

const game = new Phaser.Game(config);
game.registry.set("fontFamily", "'UD デジタル 教科書体 NP-R', KleeOne, Arial");

game.scene.add("game_menu", GameMenu);
game.scene.add("logo", OpenLogo);
game.scene.add("game_setting", GameSetting);
game.scene.add("hitsuji_game", HitsujiGame);
game.scene.add("game_result", GameResult);
game.scene.add("how_to_play", HowToPlay);
game.scene.add("pause_menu", PauseMenu);
