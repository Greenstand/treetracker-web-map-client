import Link from 'next/link';

export default function Top(){
  return (
    <div style={{color: "white"}} >
      <h1>top page</h1>
      <h2>featured trees</h2>
      <ul>
        <li><Link href="/trees/1" >tree 1</Link></li>
        <li>tree 2</li>
      </ul>
    </div>
  );
}
