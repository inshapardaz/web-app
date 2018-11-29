const baseUrl = 'http://api-inshapardaz.azurewebsites.net/api';

export function entry(){
  return fetch(baseUrl)
          .then(res => res.json());
}

export function getCategories(){

  return fetch(`${baseUrl}/categories`)
          .then(res => res.json());
}

export function getRecentBooks(){

  return fetch(`${baseUrl}/books/recent`)
          .then(res => res.json());
}

export function getLatestBooks(){
  return fetch(`${baseUrl}/books/latest`)
          .then(res => res.json());
}

export function getFavoriteBooks(){
  return fetch(`${baseUrl}/books/favorite`)
          .then(res => res.json());
}

export function getBooks(page = 1)
{
  return fetch(`${baseUrl}/books?pageNumber=${page}&pageSize=12`)
          .then(res => res.json());
}

export function getBooksByUrl(link)
{
  return fetch(`${baseUrl}/books`)
          .then(res => res.json());
}

export function getBook(id)
{
  return fetch(`${baseUrl}/books/${id}`)
          .then(res => res.json());
}

export function getAuthors(page = 1)
{
  return fetch(`${baseUrl}/authors?pageNumber=${page}&pageSize=12`)
          .then(res => res.json())
}
export function getAuthor(id)
{
  return fetch(`${baseUrl}/authors/${id}`)
          .then(res => res.json())
}

export function getAuthorBooks(link)
{
  return fetch(link)
          .then(res => res.json())
}
