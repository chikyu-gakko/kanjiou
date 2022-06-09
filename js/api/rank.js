const API_URL = "http://13.231.182.101";

const getRank = async (time) => {
  try {
    const response = await fetch(
      `${API_URL}/api/time_limits/time_limit?seconds=${time}`
    );
    return response.json();
  } catch (error) {
    return error;
  }
};

const putRanking = async (time, name) => {
  const fd = new FormData();
  fd.append("name", name);
  fd.append("seconds", 60 - time);
  await fetch(`${API_URL}/api/time_limits`, {
    method: "POST",
    body: fd,
  });
};

const getRanks = async () => {
  const response = await fetch(`${API_URL}/api/time_limits`);
  const data = await response.json();
  const ranks = [];
  let rank = 0;
  let seconds = -1;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].seconds !== seconds) {
      rank = i + 1;
      seconds = data[i].seconds;
    }
    ranks.push({
      ...data[i],
      rank,
    });
  }

  return ranks;
};

export { getRank, putRanking, getRanks };
