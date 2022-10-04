const data = [
  {
    type: 'location',
    content: 'america',
  },

  {
    type: 'location',
    content: 'europe',
  },
  {
    type: 'location',
    content: 'uruguay',
  },
  {
    type: 'location',
    content: 'asia',
  },
  {
    type: 'location',
    content: 'china',
  },
  {
    type: 'location',
    content: 'england',
  },
  {
    type: 'planter',
    content: 'dadiorchen',
  },
  {
    type: 'planter',
    content: 'mohmin',
  },
  {
    type: 'planter',
    content: 'ruben',
  },
  {
    type: 'specie',
    content: 'apple',
  },
  {
    type: 'specie',
    content: 'mango',
  },
];

export default function fakeCall(searchKeyword) {
  const matchedResults = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const keyword of data) {
    if (keyword.content.includes(searchKeyword)) {
      matchedResults.push(keyword);
    }
  }
  return matchedResults;
}
