import Link from 'next/link';
import FeaturedTreesSlider from '../components/featuredTreesSlider';

export default function Top() {
  return (
    <div>
      <h1>top page</h1>
      <h2>featured trees</h2>
      <FeaturedTreesSlider />
      <ul>
        <li>
          <Link href="/trees/933042">tree 933042</Link>
        </li>
        <li>
          <Link href="/trees/932946">tree 932946</Link>
        </li>
      </ul>
    </div>
  );
}
