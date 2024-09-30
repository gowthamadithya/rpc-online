// const API_URL = 'http://localhost:3001/api';
const API_URL = 'http://ec2-16-171-142-189.eu-north-1.compute.amazonaws.com:3001/api';

export const saveGame = async (gameData) => {
  const response = await fetch(`${API_URL}/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  });
  return response.json();
};

export const getHistory = async () => {
  const response = await fetch(`${API_URL}/games`);
  return response.json();
};