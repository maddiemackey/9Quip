export default function getRandomInDict(dict, numberOfItems = 1) {
    let items = new Array(numberOfItems);
    let len = Object.keys(dict).length;
    let taken = new Array(len);

    if (numberOfItems > len)
        throw new RangeError("too many items needed");

    while (numberOfItems--) {
        let x = Math.floor(Math.random() * len);
        items[numberOfItems] = Object.keys(dict)[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }

    return items;
}