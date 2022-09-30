import BackButton from "../components/back_button.js";
import { getRanks } from "../api/rank.js";

export default class HitsujiRanking extends Phaser.Scene {
  constructor() {
    super({ key: "hitsuji_ranking", active: true });
  }

  preload() {
    this.load.path = window.location.href.replace("index.html", "");
    this.load.html("ranking", "../../assets/html/ranking.html");
  }

  init() {
    this.fontFamily = this.registry.get("fontFamily");
  }

  create() {
    const rankingBg = this.add.graphics();
    rankingBg.fillStyle(0xeaeaea, 1).fillRect(0, 0, 1024, 768);

    const ranking = this.add.dom(510, 400).createFromCache("ranking");
    ranking.setDepth(1);
    getRanks().then((data) => {
      const table = document.getElementsByTagName("table")[0];
      table.innerHTML = "";
      const tbody = document.createElement("tbody");
      for (let i = 0; i < data.length; i += 1) {
        const tr = document.createElement("tr");
        tr.classList.add("item");
        const td = document.createElement("td");
        td.innerText = data[i].rank;
        tr.appendChild(td);
        const td1 = document.createElement("td");
        td1.innerText = data[i].name;
        tr.appendChild(td1);
        const td2 = document.createElement("td");
        td2.innerText = data[i].seconds;
        tr.appendChild(td2);
        const td3 = document.createElement("td");
        const formatDate = (date) => {
          const yyyy = date.getFullYear();
          const mm = `00${date.getMonth() + 1}`.slice(-2);
          const dd = `00${date.getDate()}`.slice(-2);
          return `${yyyy}/${mm}/${dd}`;
        };
        td3.innerText = formatDate(new Date(data[i].created_at));
        tr.appendChild(td3);
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
    });
    const backButton = new BackButton(
      this,
      245,
      700,
      77,
      30,
      "⇦ 戻る",
      24,
      this.fontFamily
    );
    backButton.setDepth(2);
    backButton.buttonGraphic.on(
      "pointerdown",
      () => {
        this.scene.start("game_result");
      },
      this
    );
  }
}
