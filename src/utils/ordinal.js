// "borrowed" from the internet, don't ask what it does, this is a hackathon for god sakes!
export function ordinal(n) {
  n++; // because it's using the index
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
