import { request, plugins } from 'popsicle';


class ApiService {
  constructor() {
    this.utlToApi = 'http://api-inshapardaz.azurewebsites.net/api/';
  }

  sign(req) {
    const user = null;//store.getState().oidc.user;

    if (user && user.access_token) {
      const token = user.access_token;
      var authorization = 'Basic ' + token;
      req.set('Authorization', authorization)
    }

    return req;
  }

  async get(url) {
    let response;

    try
    {
      response = await request({
          url, method: 'GET', timeout: 5000
        })
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
}

export default ApiService;
