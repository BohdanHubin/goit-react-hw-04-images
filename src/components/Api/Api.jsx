const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '33243113-062ba664c841c8d43d517954c';

function fetchQuery(searchQuery, page) {
  return fetch(
    `${BASE_URL}/?key=${API_KEY}&q=${searchQuery}
      &image_type=photo&orientation=horizontal&page=
      ${page}&per_page=12`
  ).then(response => response.json());
}

const api = { fetchQuery };

export default api;