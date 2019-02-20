import AuthService from './AuthService';
var Config = require('Config')
const axios = require('axios');
const baseUrl = Config.apiUrl;

export default class ApiService {
  constructor(user) {
    this.user = user
  }
  appendAuthentication(headers){
    if (AuthService.isAuthenticated) {
      var authorization = `Bearer ${AuthService.getAccessToken()}`;
      console.log('authenticated call ' + authorization);
      headers['Authorization'] = authorization;
    } else {
      console.log('unauthenticated cal!!!!');
    }
  }
  get(url) {
    let headers = {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    };

    this.appendAuthentication(headers);

    let options = {
      url: url,
      method: 'get',
      withCredentials: true,
      headers: headers
    }

    return axios(options)
      .then(res => res.data);
  }

  post(url, contents, contentType = 'application/json'){
    let headers = {
      'Accept' : 'application/json',
      'Content-Type': contentType
    };

    this.appendAuthentication(headers);

    let options = {
      withCredentials: true,
      headers: headers
    }

    return axios.post(url, contents, options)
      .then(res => res.data);
  }

  put(url, contents){
    let headers = {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    };

    this.appendAuthentication(headers);

    let options = {
      url: url,
      method: 'put',
      withCredentials: true,
      headers: headers,
      data: contents
    }

    return axios(options)
      .then(res => res.data);
  }

  delete(url){
    let headers = {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    };

    this.appendAuthentication(headers);

    let options = {
      url: url,
      method: 'delete',
      withCredentials: true,
      headers: headers
    }

    return axios(options)
      .then(res => res.data);
  }

  upload(url, file){
    let headers = {
      'Accept' : 'application/json'
    };

    this.appendAuthentication(headers);

    let options = {
      withCredentials: true,
      headers: headers
    }

    const formData = new FormData();
    formData.append('file', file, file.fileName);

    return axios.post(url, formData, options);
  }

  getEntry() {
    return this.get(baseUrl);
  }

  getCategories(){
    return this.get(`${baseUrl}/categories`);
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

  getAuthorBooks(link, page = 1) {
    return this.get(`${link}?pageNumber=${page}&pageSize=3`);
  }

  getDictionary(id){
    return this.get(`${baseUrl}/dictionaries/${id}`);
  }

  getWords(dictionaryId, page = 1){
    return this.get(`${baseUrl}/dictionaries/${dictionaryId}/words?pageNumber=${page}&pageSize=12`);
  }

  getWordMeaning(dictionaryId,wordId)
  {
    return this.get(`${baseUrl}/dictionaries/${dictionaryId}/words/${wordId}/meanings`);
  }

  getWordTranslations(dictionaryId,wordId)
  {
    return this.get(`${baseUrl}/dictionaries/${dictionaryId}/words/${wordId}/translations`);
  }

  getWordRelationships(dictionaryId,wordId)
  {
    return this.get(`${baseUrl}/dictionaries/${dictionaryId}/words/${wordId}/relationships`);
  }

}
