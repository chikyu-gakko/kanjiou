import SettingButton from "./setting_button.js";

const API_URL = "http://13.231.182.101";

const getRank = async (time) => {
  try {
    const response = await fetch(`${API_URL}/ranked?seconds=${time}`);
    return response.json();
  } catch (error) {
    return error;
  }
};

const getRanks = async () => {
  const response = await fetch(`${API_URL}/ranks`);
  return response.json();
};

const putRanking = async (time, name) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        seconds: time,
      }),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export default class HitsujiRanking extends Phaser.Scene {
  constructor() {
    super({ key: "hitsuji_ranking", active: true });
  }

  preload() {
    this.load.path = window.location.href.replace("index.html", "");
    this.load.html("ranking", "../html/ranking.html");
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
        if (i === 0) {
          tr.classList.add("bar");
          const th = document.createElement("th");
          th.innerText = "順位";
          tr.appendChild(th);
          const th1 = document.createElement("th");
          th1.innerText = "名前";
          tr.appendChild(th1);
          const th2 = document.createElement("th");
          th2.innerText = "時間";
          tr.appendChild(th2);
          const th3 = document.createElement("th");
          th3.innerText = "日付";
          tr.appendChild(th3);
        } else {
          tr.classList.add("item");
          const td = document.createElement("td");
          td.innerText = i;
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
        }
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
    });
    const backButton = new SettingButton(
      this,
      377,
      623,
      265,
      72,
      "戻る",
      24,
      this.fontFamily
    );
    backButton.setDepth(2);
  }
}
