import dynamic from 'next/dynamic';

const DynamicApp = dynamic(() => import('../Home'), { ssr: false });

export default function Home() {
  return <DynamicApp />;
}
