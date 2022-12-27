const API_URL =
  process.env.NODE_ENV === "development"
    ? ""
    : "https://kanjiouapi.onrender.com";

const getRank = async (time, gameMode) => {
  try {
    const response = await fetch(
      `${API_URL}/api/ranks/${time}?gameMode=${gameMode}`,
    );
    return response.json();
  } catch (error) {
    return error;
  }
};

const putRanking = async (time, name, gameMode) => {
  const fd = new FormData();
  fd.append("gameMode", gameMode);
  fd.append("name", name);
  fd.append("secondsLeft", 60 - time);
  const r = await fetch(`${API_URL}/api/records`, {
    method: "POST",
    body: fd,
  });
  if (!r.ok) throw "error";
};

const getRanks = async () => {
  const response = await fetch(`${API_URL}/api/ranks`);
  const data = await response.json();
  const ranks = [];
  let rank = 0;
  let secondsLeft = -1;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].secondsLeft !== secondsLeft) {
      rank = i + 1;
      secondsLeft = data[i].secondsLeft;
    }
    ranks.push({
      ...data[i],
      rank,
    });
  }

  return ranks;
};

export { getRank, putRanking, getRanks };
