// page.tsx (sem "use client")
export const metadata = {
	title: 'DrClick - Convenios',
};

import { ConveniosIndex } from './_components/conveniosIndex';

export default function Page() {
	return <ConveniosIndex />;
}