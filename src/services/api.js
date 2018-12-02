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

    console.log(headers);
    let options = {
      url: url,
      method: 'get',
      withCredentials: true,
      headers: headers
    }

    return axios(options);
  }

  getEntry() {
    return this.get(baseUrl)
      .then(res => res.data);
  }

  getCategories() {
    return this.get(`${baseUrl}/categories`)
      .then(res => res.data);
  }

  getRecentBooks() {
    return this.get(`${baseUrl}/books/recent`)
      .then(res => res.data);
  }

  getLatestBooks() {
    return this.get(`${baseUrl}/books/latest`)
      .then(res => res.data);
  }

  getFavoriteBooks() {
    return this.get(`${baseUrl}/books/favorites`)
      .then(res => res.data);
  }

  searchBooks(query, page = 1) {
    return this.get(`${baseUrl}/books?query=${query}&pageNumber=${page}&pageSize=6`)
      .then(res => res.data);
  }

  getBooks(category = null, page = 1) {
    const url = category ? `${baseUrl}/categories/${category}/books` : `${baseUrl}/books`;
    return this.get(`${url}?pageNumber=${page}&pageSize=12`)
      .then(res => res.data);
  }

  getBook(id) {
    return this.get(`${baseUrl}/books/${id}`)
      .then(res => res.data);
  }

  getChapters(id) {
    return this.get(`${baseUrl}/books/${id}/chapters`)
      .then(res => res.data);
  }

  getChapter(id, chapterId) {
    return this.get(`${baseUrl}/books/${id}/chapters/${chapterId}`)
      .then(res => res.data);
  }

  getChapterContents(id, chapterId) {
    return this.get(`${baseUrl}/books/${id}/chapters/${chapterId}/contents`)
      .then(res => res.data);
  }

  getAuthors(page = 1) {
    return this.get(`${baseUrl}/authors?pageNumber=${page}&pageSize=12`)
      .then(res => res.data);
  }

  searchAuthors(query, page = 1) {
    return this.get(`${baseUrl}/authors?query=${query}&pageNumber=${page}&pageSize=6`)
      .then(res => res.data);
  }

  getAuthor(id) {
    return this.get(`${baseUrl}/authors/${id}`)
      .then(res => res.data)
  }

  getAuthorBooks(link) {
    return this.get(link)
      .then(res => res.data)
  }

}
