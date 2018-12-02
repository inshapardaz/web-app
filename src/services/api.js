/* global __CONFIG__*/
const axios = require('axios');
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
      var authorization = `${this.user.token_type} ${this.user.id_token}`;
      headers['Authorization'] = authorization;
    }

    let options = {
      url: url,
      method: 'get',
      withCredentials: true,
      headers: headers
    }

    return axios(options)
      .then(res => res.data);
  }

  getEntry() {
    return this.get(baseUrl);
  }

  getCategories() {
    return this.get(`${baseUrl}/categories`);
  }

  getRecentBooks() {
    return this.get(`${baseUrl}/books/recent`);
  }

  getLatestBooks() {
    return this.get(`${baseUrl}/books/latest`);
  }

  getFavoriteBooks() {
    return this.get(`${baseUrl}/books/favorite`);
  }

  searchBooks(query, page = 1) {
    return this.get(`${baseUrl}/books?query=${query}&pageNumber=${page}&pageSize=6`);
  }

  getBooks(category = null, page = 1) {
    const url = category ? `${baseUrl}/categories/${category}/books` : `${baseUrl}/books`;
    return this.get(`${url}?pageNumber=${page}&pageSize=12`);
  }

  getBook(id) {
    return this.get(`${baseUrl}/books/${id}`);
  }

  getChapters(id) {
    return this.get(`${baseUrl}/books/${id}/chapters`);
  }

  getChapter(id, chapterId) {
    return this.get(`${baseUrl}/books/${id}/chapters/${chapterId}`);
  }

  getChapterContents(id, chapterId) {
    return this.get(`${baseUrl}/books/${id}/chapters/${chapterId}/contents`);
  }

  getAuthors(page = 1) {
    return this.get(`${baseUrl}/authors?pageNumber=${page}&pageSize=12`);
  }

  searchAuthors(query, page = 1) {
    return this.get(`${baseUrl}/authors?query=${query}&pageNumber=${page}&pageSize=6`);
  }

  getAuthor(id) {
    return this.get(`${baseUrl}/authors/${id}`);
  }

  getAuthorBooks(link) {
    return this.get(link);
  }

}
