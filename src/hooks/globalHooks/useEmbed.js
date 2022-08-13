import { useRouter } from 'next/router';

// Return if embed=true parameter is present in URL
function useEmbed() {
  const router = useRouter();
  const isEmbed = !!router.asPath.match(/embed=true/g);
  return isEmbed;
}

export default useEmbed;
