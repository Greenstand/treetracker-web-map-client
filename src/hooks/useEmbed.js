import log from 'loglevel';
import { useRouter } from 'next/router';

export default function useEmbed() {
  const router = useRouter();
  log.warn('router:', router);
  const isEmbed = !!router.asPath.match(/embed=true/);
  return isEmbed;
}
