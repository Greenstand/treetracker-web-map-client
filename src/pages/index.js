import dynamic from 'next/dynamic';

const DynamicApp = dynamic(() => import('../Home'), { ssr: true });

export default function Home() {
  return <DynamicApp />;
}
