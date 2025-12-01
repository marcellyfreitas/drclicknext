import { Metadata } from 'next';
import HomeIndex from './_components/home-index';

export const metadata: Metadata = {
	title: 'Dr. Click - Página inicial',
	description: 'Agendamentos de consultas médicas descomplicados.',
};

export default function Page() {
	return (
		<HomeIndex />
	);
}
