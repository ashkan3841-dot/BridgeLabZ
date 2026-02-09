function capitalize(string) {
  if (!string) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function reverseString(string) {
  if (!string) {
    return "";
  }
  return string.split("").reverse().join("");
}
function countVowels(string) {
  if (!string) return "";
  string = string.toLowerCase();
  let count = 0;
  for (let i = 0; i < string.length; i++) {
    if ("aeiou".includes(string[i])) {
      count++;
    }
  }
  return count;
}

module.exports = {
  capitalize,
  reverseString,
  countVowels,
};
