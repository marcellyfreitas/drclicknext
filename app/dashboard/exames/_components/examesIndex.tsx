'use client';
import React, { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { Edit, Plus, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Container } from '@/components/dashboard/container';

import { httpClient } from '@/services';
import { PrivateExamService } from '@/services/modules/privateExamService';

import { CreateForm } from './createForm';
import { EditForm } from './editForm';

const exameService = new PrivateExamService(httpClient);

export const ExamesIndex: React.FC = () => {
	const [Collection, setCollection] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const fetchUsers = async () => {
		try {
			const response = await exameService.getAll();
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
			await exameService.delete(id);
			toast.success('Item removido com sucesso!');
			setLoading(true);
			fetchUsers();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao remover Item!');
		}
	};

	if (error) return <p>{error}</p>;

	if (loading) {
		return (
			<Container>
				<div className="flex justify-between items-center mb-4">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-10 w-24" />
				</div>
				<div className="space-y-2">
					{Array.from({ length: 5 }).map((_, idx) => (
						<Skeleton key={idx} className="h-16 w-full" />
					))}
				</div>
			</Container>
		);
	}

	return (
		<Container>
			<div className="flex justify-between items-center mb-4">
				<h1 className="font-semibold text-xl">Exames</h1>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button className="cursor-pointer" onClick={() => setOpen(true)}>
							<Plus /> Novo Exame
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Novo Exame</DialogTitle>
						</DialogHeader>
						<CreateForm onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
					</DialogContent>
				</Dialog>

				<Dialog open={editOpen} onOpenChange={setEditOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Editar Exame</DialogTitle>
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
				<TableCaption>Lista de Exames</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Collection.map((Item) => (
						<TableRow key={Item.id}>
							<TableCell>{Item.name}</TableCell>
							<TableCell>
								<div className="flex w-full justify-end gap-2">
									<Button
										className="rounded-full cursor-pointer"
										size={'icon'}
										onClick={() => handleEdit(Item.id)}
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
												onClick={() => handleDelete(Item.id)}
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