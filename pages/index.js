
import dynamic from 'next/dynamic'

const DynamicApp = dynamic(
     () => import('../src/MapComponent'),
     { ssr: false }
)

export default function home () { 
     return (
             <DynamicApp/>
     )
}