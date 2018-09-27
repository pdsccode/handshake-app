export default  {
  duration: function (timeInSecond) {
    var interval = Math.floor(timeInSecond / 31536000)
    if (interval > 1) {
      return interval + ' years'
    }
    interval = Math.floor(timeInSecond / 2592000)
    if (interval > 1) {
      return interval + ' months'
    }
    interval = Math.floor(timeInSecond / 86400)
    if (interval > 1) {
      return interval + ' days'
    }
    interval = Math.floor(timeInSecond / 3600)
    if (interval > 1) {
      return interval + ' hours'
    }
    interval = Math.floor(timeInSecond / 60)
    if (interval > 1) {
      return interval + ' minutes'
    }
    return Math.floor(timeInSecond) + ' timeInSecond'
  }
}
