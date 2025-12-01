// page.tsx (sem "use client")
export const metadata = {
	title: 'DrClick - Especializações',
};

import { EspecializacoesIndex } from './_components/especializacoesIndex';

export default function Page() {
	return <EspecializacoesIndex />;
}