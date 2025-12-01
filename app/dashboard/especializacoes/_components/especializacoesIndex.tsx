
'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

import { httpClient } from '@/services';
import { Container } from '@/components/dashboard/container';
import { Edit, Plus, Trash } from 'lucide-react';
import { CreateForm } from './createForm';
import { EditForm } from './editForm';
import { EspecializacoesService } from '@/services/modules/especializacoesService';

const service = new EspecializacoesService(httpClient);

export const EspecializacoesIndex: React.FC = () => {
	const [collection, setCollection] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const fetchUsers = async () => {
		try {
			const response = await service.getAll();
			setCollection(response.data.data);
		} catch (error) {
			console.error(error);
			setError('Erro ao buscar lista');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleSuccess = () => {
		setOpen(false);
		setLoading(true);
		fetchUsers();
	};

	const handleEdit = (id: string) => {
		setSelectedId(id);
		setEditOpen(true);
	};

	const handleEditSuccess = () => {
		setEditOpen(false);
		setLoading(true);
		fetchUsers();
	};

	const handleDelete = async (id: string) => {
		try {
			await service.delete(id);
			toast.success('Item removido com sucesso!');
			setLoading(true);
			fetchUsers();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao remover item!');
		}
	};

	if (error) return <p>{error}</p>;

	return (
		<Container>

			<div className="flex justify-between items-center mb-4">
				<h1 className="font-semibold text-xl">Especializações</h1>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button className="cursor-pointer" onClick={() => setOpen(true)}><Plus /> Novo</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Nova especialização</DialogTitle>
						</DialogHeader>
						<CreateForm onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
					</DialogContent>
				</Dialog>

				<Dialog open={editOpen} onOpenChange={setEditOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Editar Especialização</DialogTitle>
						</DialogHeader>
						{selectedId && (
							<EditForm
								id={selectedId}
								onCancel={() => setEditOpen(false)}
								onSuccess={handleEditSuccess}
							/>
						)}
					</DialogContent>
				</Dialog>
			</div>

			<Table>
				<TableCaption>Lista de especializações.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loading ?
						Array.from({ length: 5 }).map((_, idx) => (
							<TableRow key={idx}>
								<TableCell><Skeleton className="h-4 w-32" /></TableCell>
								<TableCell><Skeleton className="h-4 w-48" /></TableCell>
							</TableRow>
						)) :
						collection.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.name}</TableCell>
								<TableCell>
									<div className="flex w-full justify-end gap-2">
										<Button
											className="rounded-full cursor-pointer"
											size={'icon'}
											onClick={() => handleEdit(item.id)}
										>
											<Edit />
										</Button>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant={'destructive'}
													className="rounded-full cursor-pointer"
													size={'icon'}
												>
													<Trash />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() => handleDelete(item.id)}
													className="text-red-600 cursor-pointer"
												>
													Confirmar exclusão
												</DropdownMenuItem>
												<DropdownMenuItem className="cursor-pointer">
													Cancelar
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</Container>
	);
};

