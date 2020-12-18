export default function getRandomInArray(arr, numberPerRound = 1, rounds) {
  let numberOfItems = numberPerRound * rounds;
  let items = new Array(numberOfItems);
  let len = arr.length;
  let taken = new Array(len);

  if (numberOfItems > len) throw new RangeError('too many items needed');

  while (numberOfItems--) {
    let x = Math.floor(Math.random() * len);
    items[numberOfItems] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }

  // Create results array containing one array for each round
  const result = [];
  var i;
  for (i = 0; i < rounds; i++) {
    result.push([]);
  }

  // internet code (solution B): https://flaviocopes.com/how-to-divide-array-js/
  const wordsPerLine = Math.ceil(items.length / (numberPerRound / rounds));

  for (let line = 0; line < rounds; line++) {
    for (let i = 0; i < wordsPerLine; i++) {
      const value = items[i + line * wordsPerLine];
      if (!value) continue; //avoid adding "undefined" values
      result[line].push(value);
    }
  }

  return result;
}
