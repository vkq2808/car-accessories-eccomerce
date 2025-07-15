const baseApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

export const imgSrc = (src) => {
  // replace http://localhost:3000/api/v1 with the actual API URL in env
  return src.replace('http://localhost:3000/api/v1', baseApiUrl);
};
