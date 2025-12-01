// page.tsx (sem "use client")
export const metadata = {
	title: 'DrClick - Exames',
};

import { ExamesIndex } from './_components/examesIndex';

export default function Page() {
	return <ExamesIndex />;
}