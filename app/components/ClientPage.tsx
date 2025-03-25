'use client';

import dynamic from 'next/dynamic';

const GridLayoutDemo = dynamic(() => import('./GridLayoutDemo'), {
  ssr: false
});

export default function ClientPage() {
  return <GridLayoutDemo />;
}
