import { request, plugins } from 'popsicle';
import { store } from '../store/configureStore';

class ApiService {
  constructor() {
    this.utlToApi = 'http://localhost:5000/api/';
  }

  sign(req) {
    // console.log(store.createStore());
    // const user = store.getState().oidc.user;

    // if (user && user.access_token) {
    //   const token = user.access_token;
    //   var authorization = 'Basic ' + token;
    //   req.set('Authorization', authorization)
    // }

    return req;
  }

  async get(url) {
    let response;

    try
    {
      response = await request(this.sign({
          url, method: 'GET', timeout: 5000
        }))
        .use(
          plugins.parse('json')
        );
    }
    catch (requestError) {
      throw new Error(`Request error. ${requestError}`);
    }

    switch (response.status) {
      case 401:

        //Refresh token here
        //this.authenticationService.authenticate();

        return null;

      case 404:

        return null;

      case 200:
        return response.body;

      default:

        throw new Error(`Request has failed with status code ${response.status}.`);
    }
  }

  async entry(){
    return await this.get(this.utlToApi);
  }

  async getRecentBooks(){

    return await this.get(`${this.utlToApi}books/recent`);
  }

  async getLatestBooks(){
    return await this.get(`${this.utlToApi}books/latest`);
  }

  async getFavoriteBooks(){
    return await this.get(`${this.utlToApi}books/favorite`);
  }

  async getBooks(link)
  {
    return await this.get(link || `${this.utlToApi}books`);
  }

  async getAuthors(link)
  {
    return await this.get(link || `${this.utlToApi}authors`);
  }
}

export default ApiService;
