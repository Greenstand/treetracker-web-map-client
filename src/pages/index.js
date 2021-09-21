import dynamic from 'next/dynamic';

const DynamicApp = dynamic(() => import('../MapComponent'), { ssr: false });

export default function Home() {
  return <div>Welcome<DynamicApp /></div>;
}
