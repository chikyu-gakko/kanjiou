import Phaser from "phaser";
``
// import phaserReact from "phaser3-react";

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
import NakamaGameSetting from "./scenes/nakama_game_setting";
import NakamaGame from "./scenes/nakama_game";
import NakamaGameResult from "./scenes/nakama_game_result";
import NakamaPauseMenu from "./scenes/nakama_pause_menu";
import SekaiHowToPlay from "./scenes/sekai_how_to_play";
import NakamaHowToPlay from "./scenes/nakama_how_to_play";

import MemoryRuselt from "./scenes/memory_game_result";
import MemoryGame from "./scenes/memory_game";
import MemoryModeSetting from "./scenes/memory_mode_setting";
import MemoryGenre1Setting from "./scenes/memory_genre1_setting";
import MemoryGenre2Setting from "./scenes/memory_genre2_setting";
import MemoryLevelSetting from "./scenes/memory_level_setting";
import MemoryHowToPlay from "./scenes/memory_how_to_play";
import {
  worker
} from "./mocks/browser";

if (process.env.NODE_ENV === "development") {
  worker.start({
    onUnhandledRequest: "bypass",
  });
}

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
  // plugins: {
  //   global: [
  //     {
  //       key: "phaser-react",
  //       plugin: phaserReact,
  //       start: true,
  //     },
  //   ],
  // },
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
    NakamaGameSetting,
    NakamaGame,
    NakamaGameResult,
    NakamaPauseMenu,
    SekaiHowToPlay,
    NakamaHowToPlay,
    MemoryModeSetting,
    MemoryGenre1Setting,
    MemoryGenre2Setting,
    MemoryGame,
    MemoryRuselt,
    MemoryLevelSetting,
    MemoryHowToPlay
  ],
};

// FIXME: mswの動作確認用必要なくなったら消す
// const test = async () => {
//   const r = await fetch("users");
//   console.log(await r.json());
// };
// test();

const game = new Phaser.Game(config);

game.registry.set("fontFamily", "'sans-serif',KleeOne, Arial, Sarabun");
game.registry.set("kanjiFontFamily", 'KleeOneForStrokeCount');
export default game;