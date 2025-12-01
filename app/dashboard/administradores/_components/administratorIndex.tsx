'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateForm } from './createForm';
import { EditForm } from './editForm';
import { httpClient } from '@/services';
import { AdministratorService } from '@/services/modules/administratorService';
import { toast } from 'sonner';
import { Container } from '@/components/dashboard/container';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { usePagination } from '@/hooks/use-pagination';
import { CustomPagination } from '@/components/global/custom-pagination';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../../../components/ui/breadcrumb';
import Link from 'next/link';

const EMAILMASTER = 'admin@email.com';
const administratorService = new AdministratorService(httpClient);

export const AdministradoresIndex: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const { pagination, handlePageChange, updatePaginationData } = usePagination();

	const [collection, setCollection] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [searchEmail, setSearchEmail] = useState('');

	const initRef = useRef(false);

	useEffect(() => {
		if (initRef.current) return;
		initRef.current = true;

		const emailParam = searchParams.get('email') ?? '';
		const pageParam = parseInt(searchParams.get('page') ?? '1', 10);
		const pageSizeParam = parseInt(searchParams.get('pageSize') ?? '10', 10);

		setSearchEmail(emailParam);

		fetchData(
			pageParam,
			pageSizeParam,
			emailParam,
			false
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchData = async (
		page: number,
		pageSize: number,
		email?: string,
		updateUrl = true
	) => {
		setLoading(true);
		try {
			const params: Record<string, any> = { page, pageSize };
			if (email) params.email = email;

			const response = await administratorService.getAll(params);
			setCollection(response.data.data.items);
			updatePaginationData(response.data.data.pagination);

			if (updateUrl) {
				const urlParams = new URLSearchParams();
				if (email) urlParams.set('email', email);
				if (page !== 1) urlParams.set('page', page.toString());
				if (pageSize !== 10) urlParams.set('pageSize', pageSize.toString());

				router.replace(
					urlParams.toString() ? `?${urlParams.toString()}` : window.location.pathname,
					{ scroll: false }
				);
			}
		} catch (err) {
			console.error(err);
			setError('Erro ao buscar lista');
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = () => {
		fetchData(1, pagination.pageSize, searchEmail, true);
		handlePageChange(1, undefined, { email: searchEmail });
	};

	const handlePageChangeWrapper = (page: number) => {
		fetchData(page, pagination.pageSize, searchEmail, true);
		handlePageChange(page, undefined, { email: searchEmail });
	};

	const handleClearFilters = () => {
		setSearchEmail('');
		router.replace(window.location.pathname, { scroll: false });
		fetchData(1, pagination.pageSize, '', false);
		handlePageChange(1);
	};

	const handleSuccess = () => {
		setOpen(false);
		fetchData(pagination.page, pagination.pageSize, searchEmail, false);
	};

	const handleEdit = (id: string) => {
		setSelectedId(id);
		setEditOpen(true);
	};

	const handleEditSuccess = () => {
		setEditOpen(false);
		setSelectedId(null);
		fetchData(pagination.page, pagination.pageSize, searchEmail, false);
	};

	const handleDelete = async (id: string) => {
		try {
			await administratorService.delete(id);
			toast.success('Administrador removido com sucesso!');
			fetchData(pagination.page, pagination.pageSize, searchEmail, false);
		} catch (error) {
			console.error(error);
			toast.error('Erro ao remover administrador!');
		}
	};

	if (error) return <p>{error}</p>;

	return (
		<Container>
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Editar Administrador</DialogTitle>
					</DialogHeader>
					{selectedId && (
						<EditForm
							id={selectedId}
							onCancel={() => {
								setEditOpen(false);
								setSelectedId(null);
							}}
							onSuccess={handleEditSuccess}
						/>
					)}
				</DialogContent>
			</Dialog>

			<div className="flex justify-between items-center">
				<h1 className="font-semibold text-xl">Administradores</h1>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button className="cursor-pointer"><Plus /> Novo administrador</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Novo Administrador</DialogTitle>
						</DialogHeader>
						<CreateForm onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
					</DialogContent>
				</Dialog>

			</div>

			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/dashboard">Home</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Administradores</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<form
				className="grid gap-2 grid-cols-[1fr_auto]"
				onSubmit={(e) => {
					e.preventDefault();
					handleSearch();
				}}
			>
				<div>
					<Input
						placeholder="Pesquisar (email)"
						value={searchEmail}
						onChange={(e) => setSearchEmail(e.target.value)}
					/>
				</div>

				<div className="flex gap-2">
					<Button size="icon" type="submit"><Search /></Button>
					{searchEmail && (
						<Button variant="outline" size="icon" type="button" onClick={handleClearFilters}>
							<Trash />
						</Button>
					)}
				</div>
			</form>

			<Table>
				<TableCaption>Lista de administradores.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>Email</TableHead>
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
							</TableRow>
						)) :
						collection.map((model) => (
							<TableRow key={model.id}>
								<TableCell>{model.name}</TableCell>
								<TableCell>{model.email}</TableCell>
								<TableCell>
									<div className="flex justify-end gap-2">
										{model.email !== EMAILMASTER && (
											<>
												<Button
													className="rounded-full cursor-pointer"
													size={'icon'}
													onClick={() => handleEdit(model.id)}
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
															onClick={() => handleDelete(model.id)}
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

			<CustomPagination
				pagination={pagination}
				onPageChange={handlePageChangeWrapper}
				className="mt-4"
			/>
		</Container>
	);
};