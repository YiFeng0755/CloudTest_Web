module.export = function (arr, search, delimiter) {
  arr = convertArray(arr);
  if (search === null) {
    return arr
  }
  if (typeof search === 'function') {
    return arr.filter(search)
  }
  search = ('' + search).toLowerCase()
  var n = delimiter === 'in' ? 3 : 2
  var keys = toArray(arguments, n).reduce(function (prev, cur) {
    return prev.concat(cur)
  }, [])
  var res = []
  var item, key, val, j
  for (var i = 0, l = arr.length; i < l; i++) {
    item = arr[i]
    val = item && item.$value || item
    j = keys.length
    if (j) {
      while (j--) {
        key = keys[j]
        if (key === '$key' && contains(item.$key, search) || contains(getPath(val, key), search)) {
          res.push(item)
          break
        }
      }
    } else if (contains(item, search)) {
      res.push(item)
    }
  }
  return res
}