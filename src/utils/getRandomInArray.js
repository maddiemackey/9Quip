export default function getRandomInArray(arr, numberOfItems = 1) {
  let items = new Array(numberOfItems);
  let len = arr.length;
  let taken = new Array(len);

  if (numberOfItems > len) throw new RangeError("too many items needed");

  while (numberOfItems--) {
    let x = Math.floor(Math.random() * len);
    items[numberOfItems] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }

  return items;
}
