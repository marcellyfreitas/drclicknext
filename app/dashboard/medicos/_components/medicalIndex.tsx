
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateForm } from './createForm';
import { EditForm } from './editForm';
import { httpClient } from '@/services';
import { MedicalService } from '@/services/modules/medicalService';
import { toast } from 'sonner';
import { Container } from '@/components/dashboard/container';
import { Edit, Plus, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

const EMAILMASTER = 'admin@email.com';
const medicalService = new MedicalService(httpClient);

export const MedicalIndex: React.FC = () => {
	const [medicals, setMedicals] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const fetchMedicals = async () => {
		try {
			const response = await medicalService.getAll();
			setMedicals(response.data.data);
		} catch (error) {
			console.error(error);
			setError('Erro ao buscar médicos');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMedicals();
	}, []);

	const handleSuccess = () => {
		setOpen(false);
		setLoading(true);
		fetchMedicals();
	};

	const handleEdit = (id: string) => {
		setSelectedId(id);
		setEditOpen(true);
	};

	const handleEditSuccess = () => {
		setEditOpen(false);
		setLoading(true);
		fetchMedicals();
	};

	const handleDelete = async (id: string) => {
		try {
			await medicalService.delete(id);
			toast.success('Médico removido com sucesso!');
			setLoading(true);
			fetchMedicals();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao remover médico!');
		}
	};

	if (error) return <p>{error}</p>;

	return (
		<Container>
			<div className="flex justify-between items-center mb-4">
				<h1 className="font-semibold text-xl">Médicos</h1>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button className="cursor-pointer" onClick={() => setOpen(true)}><Plus /> Novo</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Novo Médico</DialogTitle>
						</DialogHeader>
						<CreateForm onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
					</DialogContent>
				</Dialog>

				<Dialog open={editOpen} onOpenChange={setEditOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Editar Médico</DialogTitle>
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
				<TableCaption>Lista de médicos.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>CPF</TableHead>
						<TableHead>CRM</TableHead>
						<TableHead>Especialização</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loading ?
						Array.from({ length: 5 }).map((_, idx) => (
							<TableRow key={idx}>
								<TableCell><Skeleton className="h-4 w-32" /></TableCell>
								<TableCell><Skeleton className="h-4 w-48" /></TableCell>
								<TableCell><Skeleton className="h-4 w-24" /></TableCell>
								<TableCell><Skeleton className="h-4 w-24" /></TableCell>
								<TableCell><Skeleton className="h-4 w-32" /></TableCell>
								<TableCell><Skeleton className="h-4 w-24" /></TableCell>
							</TableRow>
						)) :
						medicals.map((medical) => (
							<TableRow key={medical.id}>
								<TableCell>{medical.name}</TableCell>
								<TableCell>{medical.email}</TableCell>
								<TableCell>{medical.cpf}</TableCell>
								<TableCell>{medical.crm}</TableCell>
								<TableCell>{medical.specialization?.name || '-'}</TableCell>
								<TableCell>
									<div className="flex w-full justify-end gap-2">
										{medical.email !== EMAILMASTER && (
											<>
												<Button
													className="rounded-full cursor-pointer"
													size={'icon'}
													onClick={() => handleEdit(medical.id)}
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
															onClick={() => handleDelete(medical.id)}
															className="text-red-600 cursor-pointer"
														>
															Confirmar exclusão
														</DropdownMenuItem>
														<DropdownMenuItem className="cursor-pointer">
															Cancelar
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</>
										)}
									</div>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</Container>
	);
};