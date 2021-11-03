import log from 'loglevel';

import Link from '../components/Link';

export default function Top({ trees, countries }) {
  return (
    <div>
      <h1>top page</h1>
      <h2>Featured Trees</h2>
      <ul>
        {trees.map((tree) => (
          <li key={tree.id}>
            <Link href={`/trees/${tree.id}`}>tree {tree.id}</Link>
          </li>
        ))}
      </ul>
      <h2>Check out the global leaders in the tree planting effort</h2>
      {countries.map((country) => (
        <li key={country.id}>{country.name}</li>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const props = {};
  {
    const url = `${process.env.NEXT_PUBLIC_API_NEW}/trees/featured`;
    log.warn('url:', url);

    const res = await fetch(url);
    const data = await res.json();
    log.warn('response:', data);
    props.trees = data.trees;
  }

  {
    const url = `${process.env.NEXT_PUBLIC_API_NEW}/countries/leader`;
    log.warn('url:', url);

    const res = await fetch(url);
    const data = await res.json();
    log.warn('response:', data);
    props.countries = data.countries;
  }

  return {
    props,
  };
}
