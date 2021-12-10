const exampleTreeData = {
  id: 'testTree',
  photo_url:
    'https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2021.05.11.18.37.00_-4.91963284_38.52757506_adc35f9c-b76e-4798-b587-70f5fba06b89_IMG_20210511_101502_-1595081185.jpg',
  verified: true,
  token_id: 'c488301f-1117-48c3-8866-3c38f28d3f25',
  created_at: '5/17/2021, 9:31:17 PM',
  lat: -4.882294219999999,
  lon: 38.380733454,
  species: 'eucalyptus',
  planter_id: 5,
  organization_id: 1,
};

const imageFixturesDir = 'images/trees/';
const imageFixtureNames = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
];

const testImage = (fileName, imageType = 'image/jpg') => {
  const imageFixturePath = `${imageFixturesDir}${fileName}`;
  return it(`Image case - ${fileName}`, () => {
    const path = `/trees/${exampleTreeData.id}`;
    cy.fixture(imageFixturePath).then((image) => {
      const blob = Cypress.Blob.base64StringToBlob(image, imageType);
      const url = Cypress.Blob.createObjectURL(blob);
      cy.task('nock', {
        hostname: 'http://127.0.0.1:4010/mock',
        method: 'GET',
        path,
        statusCode: 200,
        body: {
          ...exampleTreeData,
          photo_url: url,
          status: 200,
        },
      });
    });
    cy.visit(path);
    cy.contains(`${exampleTreeData.id}`);
  });
};

beforeEach(() => {
  cy.task('clearNock');
});

// mocking api cypress for one(1) image tree.

const testImageTree = () => it('getServerSideProps returns mock', () => {
    const path = `/trees/186734/`;
    cy.intercept(path, { fixture: 'tree186734.json' });

    cy.visit('/trees/186734');
    cy.contains('186734');
  });

describe('Image cases', () => {
  imageFixtureNames.forEach(testImage);
  testImage('gif', 'image/gif');
  testImage('png', 'image/png');
});

describe('Image Tree case', () => {
  testImageTree();
});
