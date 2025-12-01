// page.tsx (sem "use client")
export const metadata = {
	title: 'DrClick - Usuários',
};

import { UsuariosIndex } from './_components/usuariosIndex';

export default function Page() {
	return <UsuariosIndex />;
}