export default async function handler({ query }, res) {
  const { secret, path } = query;
  if (secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (!path) {
    return res.status(401).json({ message: 'Invalid path' });
  }

  try {
    await res.revalidate(`${process.env.NEXT_PUBLIC_BASE ?? ''}${path}`);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
