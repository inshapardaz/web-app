export default function rel(hrefs = [], rel = '') {
    var link = hrefs.find(e => e.rel === rel)
    if (link) {
      return link.href
    }
  
    return ''
  }
  