export const request = (url, method, data) => {
  return fetch(url, {
    headers: {
      'content-type': 'application/json',
    },
    method: method || 'GET',
    credentials: 'include', // Важно для куков
    body: data ? JSON.stringify(data) : undefined,
  }).then((res) => res.json());
};