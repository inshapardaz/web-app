/* global __CONFIG__*/
const baseUrl = __CONFIG__.apiUrl;

export default class ApiService {
  constructor(user) {
    this.user = user
  }
  get(url) {
    let headers = {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    };

    if (this.user && this.user.access_token) {
      const token = this.user.access_token;
      var authorization = 'Basic ' + token;
      headers['Authorization'] = authorization;
    }

    console.log(headers);
    let options = {
      method: 'get',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    }
    var request = new Request(url, options);

    return fetch(url, request);
  }

  getEntry() {
    return this.get(baseUrl)
      .then(res => res.json());
  }

  getCategories() {
    return this.get(`${baseUrl}/categories`)
      .then(res => res.json());
  }

  getRecentBooks() {
    return this.get(`${baseUrl}/books/recent`)
      .then(res => res.json());
  }

  getLatestBooks() {
    return this.get(`${baseUrl}/books/latest`)
      .then(res => res.json());
  }

  getFavoriteBooks() {
    return this.get(`${baseUrl}/books/favorite`)
      .then(res => res.json());
  }

  searchBooks(query, page = 1) {
    return this.get(`${baseUrl}/books?query=${query}&pageNumber=${page}&pageSize=6`)
      .then(res => res.json());
  }

  getooks(category = null, page = 1) {
    const url = category ? `${baseUrl}/categories/${category}/books` : `${baseUrl}/books`;
    return this.get(`${url}?pageNumber=${page}&pageSize=12`)
      .then(res => res.json());
  }

  getBook(id) {
    return this.get(`${baseUrl}/books/${id}`)
      .then(res => res.json());
  }

  getChapters(id) {
    return this.get(`${baseUrl}/books/${id}/chapters`)
      .then(res => res.json());
  }

  getChapter(id, chapterId) {
    return this.get(`${baseUrl}/books/${id}/chapters/${chapterId}`)
      .then(res => res.json());
  }

  getChapterContents(id, chapterId) {
    return this.get(`${baseUrl}/books/${id}/chapters/${chapterId}/contents`)
      .then(res => res.json());
  }

  getAuthors(page = 1) {
    return this.get(`${baseUrl}/authors?pageNumber=${page}&pageSize=12`)
      .then(res => res.json())
  }

  searchAuthors(query, page = 1) {
    return this.get(`${baseUrl}/authors?query=${query}&pageNumber=${page}&pageSize=6`)
      .then(res => res.json());
  }

  getAuthor(id) {
    return this.get(`${baseUrl}/authors/${id}`)
      .then(res => res.json())
  }

  getAuthorBooks(link) {
    return this.get(link)
      .then(res => res.json())
  }

}
