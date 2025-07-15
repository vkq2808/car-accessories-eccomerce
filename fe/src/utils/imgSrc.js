const baseApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

export const imgSrc = (src) => {
  // replace http://localhost:3001/api/v1 with the actual API URL in env
  const res = src.replace('http://localhost:3001/api/v1', baseApiUrl);
  return res;
};
