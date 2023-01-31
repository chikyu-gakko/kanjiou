import Phaser from "phaser";
import phaserReact from "phaser3-react";

import HelloWorldScene from "./HelloWorldScene";
import OpenLogo from "./scenes/open_logo";
import PauseMenu from "./scenes/pause_menu";
import GameMenu from "./scenes/game_menu";
import GameResult from "./scenes/game_result";
import GameSetting from "./scenes/game_setting";
import HitsujiGame from "./scenes/hitsuji_game";
import HitsujiRanking from "./scenes/hitsuji_ranking";
import HowToPlay from "./scenes/how_to_play";
import SekaiGame from "./scenes/sekai_game";
import SekaiGameResult from "./scenes/sekai_game_result";
import SekaiPauseMenu from "./scenes/sekai_pause_menu";
import SekaiGameSetting from "./scenes/sekai_game_setting";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    max: {
      width: 1024,
      height: 768,
    },
  },
  dom: {
    createContainer: true,
  },
  plugins: {
    global: [
      {
        key: "phaser-react",
        plugin: phaserReact,
        start: true,
      },
    ],
  },
  // physics: {
  //   default: 'arcade',
  //   arcade: {
  //     gravity: { y: 200 },
  //   },
  // },
  scene: [
    OpenLogo,
    GameMenu,
    GameResult,
    GameSetting,
    HitsujiGame,
    PauseMenu,
    HitsujiRanking,
    HowToPlay,
    SekaiGame,
    SekaiGameResult,
    SekaiPauseMenu,
    SekaiGameSetting,
  ],
};

// export default new Phaser.Game(config)
const game = new Phaser.Game(config);
game.registry.set(
  "kanjiFontFamily",
  "'Noto Serif JP', serif"
);
game.registry.set(
  "fontFamily",
  "'sans-serif', KleeOne, Arial, Sarabun"
);

export default game;
