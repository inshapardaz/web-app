import AuthService from './AuthService';
var Config = require('Config')
const axios = require('axios');
const baseUrl = Config.apiUrl;
let libraryId = Config.libraryId; 

var overrideLibraryId  = localStorage.getItem('libraryId');
if (overrideLibraryId != null)
{
  console.log(`Overriding to library ${overrideLibraryId}`);
  libraryId = overrideLibraryId;
}

class ApiService {
  appendAuthentication(headers){
    if (AuthService.isAuthenticated()) {
      var authorization = `Bearer ${AuthService.getAccessToken()}`;
      headers['Authorization'] = authorization;
    } 
  }
  get(url, language = 'ur', accept = 'application/json') {
    let headers = {
      'Accept' : accept,
      'Content-Type': 'application/json',
      'Accept-Language': language
    };

    this.appendAuthentication(headers);

    let options = {
      url: url,
      method: 'get',
      withCredentials: true,
      headers: headers
    }

    return axios(options)
      .then(res => this.parseObject(res.data));
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

    delete contents.links;
    
    return axios.post(url, contents, options)
    .then(res => this.parseObject(res.data));
  }

  put(url, contents){
    let headers = {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    };

    this.appendAuthentication(headers);

    delete contents.links;

    let options = {
      url: url,
      method: 'put',
      withCredentials: true,
      headers: headers,
      data: contents
    }

    return axios(options)
    .then(res => this.parseObject(res.data));
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
    .then(res => this.parseObject(res.data));
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

    return axios.post(url, formData, options)
                .then(res => this.parseObject(res.data));
  }

  getEntry() {
    return this.get(`${baseUrl}/libraries/${libraryId}`);
  }

  getCategories(){
    return this.get(`${baseUrl}/libraries/${libraryId}/categories`);
  }

  getCategory(id){
    return this.get(`${baseUrl}/libraries/${libraryId}/categories/${id}`);
  }

  getSeries(){
    return this.get(`${baseUrl}/libraries/${libraryId}/series`);
  }

  getSeriesById(id){
    return this.get(`${baseUrl}/libraries/${libraryId}/series/${id}`);
  }

  searchBooks(query, page = 1, pageSize = 12) {
    return this.get(`${baseUrl}/libraries/${libraryId}/books?query=${query}&pageNumber=${page}&pageSize=${pageSize}`);
  }

  getBooks(page = 1, pageSize = 12, query = null) {
    const url = `${baseUrl}/libraries/${libraryId}/books`;
    return this.get(`${url}?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
  }

  getLatestBooks(page = 1, pageSize = 12) {
    const url = `${baseUrl}/libraries/${libraryId}/books`;
    return this.get(`${url}?pageNumber=${page}&pageSize=${pageSize}&sortby=datecreated&sort=descending`);
  }

  getBooksByCategory(category, page = 1, pageSize = 12, query = null) {
    const url = `${baseUrl}/libraries/${libraryId}/books`;
    return this.get(`${url}?pageNumber=${page}&pageSize=${pageSize}&categoryid=${category}${this.getQueryParameter(query)}`);
  }

  getBooksBySeries(series, page = 1, pageSize = 12, query = null) {
    const url = `${baseUrl}/libraries/${libraryId}/books`;
    return this.get(`${url}?pageNumber=${page}&pageSize=${pageSize}&seriesid=${series}${this.getQueryParameter(query)}`);
  }

  getBook(id) {
    return this.get(`${baseUrl}/libraries/${libraryId}/books/${id}`);
  }

  getBookChapters(book) {
    return this.get(book.links.chapters);
  }

  getChapters(bookId) {
    return this.get(`${baseUrl}/libraries/${libraryId}/books/${bookId}/chapters`);
  }

  getChapter(id, chapterId) {
    return this.get(`${baseUrl}/libraries/${libraryId}/books/${id}/chapters/${chapterId}`);
  }

  getChapterContents(id, chapterId, language = 'ur', mimeType = 'text/markdown') {
    return this.get(`${baseUrl}/libraries/${libraryId}/books/${id}/chapters/${chapterId}/contents`, language, mimeType);
  }

  getAuthors(page = 1, pageSize = 12, query = null) {
    return this.get(`${baseUrl}/libraries/${libraryId}/authors?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
  }

  searchAuthors(query, page = 1, pageSize = 6) {
    return this.get(`${baseUrl}/libraries/${libraryId}/authors?&pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
  }

  getAuthor(id) {
    return this.get(`${baseUrl}/libraries/${libraryId}/authors/${id}`);
  }

  getAuthorBooks(authorId, page = 1, pageSize= 12, query = null) {
    return this.get(`${baseUrl}/libraries/${libraryId}/books?pageNumber=${page}&pageSize=${pageSize}&authorid=${authorId}`);
  }

  getBookFiles(link){
    return this.get(link);
  }

  /** Obsolete */
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

  getQueryParameter = (query) => (query) ? `&query=${query}` : "";

  parseObject(source){
    if (source)
    {
      if (source.links)
      {
        let newLinks = {};
        source.links.forEach(link => {
          newLinks[link.rel.replace("-", "_")] = link.href;
        });
        source.links = newLinks;
      }

      if (source.data)
      {
        let newItems = [];
        source.data.forEach(item => newItems.push(this.parseObject(item)));
        source.data = newItems;
      }

      if (source.contents)
      {
        let newItems = [];
        source.contents.forEach(item => newItems.push(this.parseObject(item)));
        source.contents = newItems;
      }

      if (Array.isArray(source))
      {
        
        let newItems = [];
        source.forEach(item => newItems.push(this.parseObject(item)));
        source = newItems;
      }
    }

    return source;
  }

}

export default new ApiService();
