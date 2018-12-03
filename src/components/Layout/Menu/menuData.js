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
        title: 'Categories',
        key: 'categories',
        icon: 'icmn icmn-stack',
        children: []
      }
    ],
  },
  {
    title: 'Authors',
    key: 'authors',
    icon: 'icmn icmn-users',
    url: '/authors'
  },
  {
    title: 'Dictionaries',
    key: 'dictionaries',
    icon: 'icmn icmn-binoculars',
    url: '/dictionaries'
  }
]
