import log from 'loglevel';

function Global() {
  return <h1>global setting for web map</h1>;
}

export default Global;

export async function getServerSideProps({ params }) {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve(), 10));
  log.warn('on the server, global page, params: ', params);
  return {
    props: {},
  };
}
