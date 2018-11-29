export default [
  {
    title: 'Home',
    key: 'home',
    url: '/',
    icon: 'icmn icmn-home',
  },
  {
    title: 'Books',
    key: 'book',
    icon: 'icmn icmn-books',
    children: [
      {
        title: 'Recent Reads',
        key: 'recent',
        icon: 'icmn icmn-history',
        url: '/books/recents',
      },
      {
        title: 'Favorites',
        key: 'favorites',
        icon: 'icmn icmn-heart',
        url: '/books/favorites',
      },

      {
        title: 'Latest',
        key: 'latest',
        icon: 'icmn icmn-fire',
        url: '/books/new',
      },
      {
        divider:true
      },
      {
        title: 'Fiction',
        key: 'fiction',
        url: '/books?category=fiction',
      },
      {
        title: 'Comedy',
        key: 'comedy',
        url: '/books?category=comedy',
      },
      {
        title: 'Travel Log',
        key: 'travel',
        url: '/books?category=travel',
      },
    ],
  },
  {
    title: 'Authors',
    key: 'authors',
    icon: 'icmn icmn-users',
    url: '/authors'
  }
]
