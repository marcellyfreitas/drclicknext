'use client';

import React from 'react';
import { Container } from '@/components/dashboard/container';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useUserAuthentication } from '@/contexts/user-authentication-context';
import { Button } from '@/components/ui/button';
import { Edit, Trash, TriangleAlert } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EditForm } from './edit-dialog';
import { httpClient } from '@/services';
import { UserService } from '@/services/modules/userService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const service = new UserService(httpClient, '/public/usuarios');

export const ModuleIndex = () => {
	const { user, fetchUser } = useUserAuthentication();
	const [editOpen, setEditOpen] = React.useState(false);
	const router = useRouter();

	async function handleDelete() {
		try {
			service.delete(user.id);
			toast.success('Conta excluída com sucesso!');
			await fetch('/api/authentication/user/logout', { method: 'POST' });
			router.push('/authentication/user/login');
		} catch (error) {
			console.error(error);
			toast.error('Erro ao excluir conta!');
		}
	}

	async function handleEditSuccess() {
		setEditOpen(false);
		await fetchUser(false);
	}

	return (
		<Container>
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Atualizar meus dados</DialogTitle>
					</DialogHeader>
					<EditForm
						id={user.id}
						onCancel={() => {
							setEditOpen(false);
						}}
						onSuccess={handleEditSuccess}
					/>
				</DialogContent>
			</Dialog>

			<div className="flex items-center justify-between gap-4">
				<h1 className="text-2xl font-semibold">Minha conta</h1>
				<Button onClick={() => setEditOpen(true)} className="cursor-pointer"><Edit /> Dados</Button>
			</div>

			<Card>
				<CardHeader>
					<h2 className="font-semibold"> Meus dados</h2>
				</CardHeader>

				<CardContent>
					<ul>
						<li><b>Nome: </b> {user.name}</li>
						<li><b>Email: </b> {user.email}</li>
					</ul>
				</CardContent>
			</Card>

			<div className="flex flex-col gap-4 bg-neutral-100 rounded-lg p-4">
				<div className="flex gap-4">
					<TriangleAlert className="text-yellow-500" />
					<h1 className="text-xl font-semibold">Exclusão de conta.</h1>
				</div>

				<div>
					<p>Deseja excluir sua conta? Clique no botão abaixo.</p>
					<p>Após a exclusão, todos os seus dados serão removidos permanentemente.</p>
				</div>

				<div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="destructive" className="cursor-pointer"><Trash />Excluir minha conta</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => handleDelete()} className="text-red-600">Confirmar exclusão</DropdownMenuItem>
							<DropdownMenuItem>Cancelar</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</Container>
	);
};

export default ModuleIndex;