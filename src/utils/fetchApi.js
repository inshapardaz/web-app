/* global __CONFIG__*/
const baseUrl = __CONFIG__.apiUrl;

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

export function searchBooks(query, page = 1){
  return fetch(`${baseUrl}/books?query=${query}&pageNumber=${page}&pageSize=6`)
          .then(res => res.json());
}

export function getFavoriteBooks(){
  return fetch(`${baseUrl}/books/favorite`)
          .then(res => res.json());
}

export function getBooks(category = null, page = 1)
{
  const url = category ? `${baseUrl}/categories/${category}/books` : `${baseUrl}/books`;
  return fetch(`${url}?pageNumber=${page}&pageSize=12`)
          .then(res => res.json());
}

export function getBook(id)
{
  return fetch(`${baseUrl}/books/${id}`)
          .then(res => res.json());
}

export function getChapters(id)
{
  return fetch(`${baseUrl}/books/${id}/chapters`)
          .then(res => res.json());
}

export function getChapter(id, chapterId)
{
  return fetch(`${baseUrl}/books/${id}/chapters/${chapterId}`)
          .then(res => res.json());
}

export function getChapterContents(id, chapterId)
{
  return fetch(`${baseUrl}/books/${id}/chapters/${chapterId}/contents`)
          .then(res => res.json());
}

export function getAuthors(page = 1)
{
  return fetch(`${baseUrl}/authors?pageNumber=${page}&pageSize=12`)
          .then(res => res.json())
}

export function searchAuthors(query, page = 1){
  return fetch(`${baseUrl}/authors?query=${query}&pageNumber=${page}&pageSize=6`)
          .then(res => res.json());
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
