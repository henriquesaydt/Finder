function calcAge(dateString) {
  var birthday = +new Date(dateString);
  return ~~((Date.now() - birthday) / (31557600000));
}

console.log(calcAge("1999-10-20T00:00:00.000Z"));