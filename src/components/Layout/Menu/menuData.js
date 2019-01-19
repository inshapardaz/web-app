export default [
  {
    title: 'سرورق',
    key: 'home',
    url: '/',
    icon: 'icmn icmn-home',
  },
  {
    title: 'کتابیں',
    key: 'book',
    icon: 'icmn icmn-books',
    children: [
      {
        title: 'گزشتہ زیرِمطالعہ کتابیں',
        key: 'recent',
        icon: 'icmn icmn-history',
        url: '/books/recents',
      },
      {
        title: 'پسندیدہ کتابیں',
        key: 'favorites',
        icon: 'icmn icmn-heart',
        url: '/books/favorites',
      },
      {
        title: 'نئی کتابیں',
        key: 'latest',
        icon: 'icmn icmn-fire',
        url: '/books/new',
      },
      {
        divider:true
      },
      {
        title: 'زمرہ‌جات',
        key: 'book-categories',
        icon: 'icmn icmn-stack',
        children: []
      }
    ],
  },
  {
    title: 'ادیب',
    key: 'authors',
    icon: 'icmn icmn-users',
    url: '/authors'
  },
  {
    title: 'زمرہ‌جات',
    key: 'categories',
    icon: 'icmn icmn-stack',
    url: '/categories',
  },
  {
    title: 'لغّات',
    key: 'dictionaries',
    icon: 'icmn icmn-binoculars',
    url: '/dictionaries'
  }
]
