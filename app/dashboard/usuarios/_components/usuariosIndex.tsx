'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

import { httpClient } from '@/services';
import { UserService } from '@/services/modules/userService';
import { Container } from '@/components/dashboard/container';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { CreateForm } from './createForm';
import { EditForm } from './editForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePagination } from '@/hooks/use-pagination';
import { CustomPagination } from '@/components/global/custom-pagination';
import { Input } from '@/components/ui/input';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';

const EMAILMASTER = 'user@email.com';
const userService = new UserService(httpClient);

export const UsuariosIndex: React.FC = () => {
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
	const [searchName, setSearchName] = useState('');

	const initRef = useRef(false);

	useEffect(() => {
		if (initRef.current) return;
		initRef.current = true;

		const emailParam = searchParams.get('email') ?? '';
		const nameParam = searchParams.get('name') ?? '';
		const pageParam = parseInt(searchParams.get('page') ?? '1', 10);
		const pageSizeParam = parseInt(searchParams.get('pageSize') ?? '10', 10);

		setSearchEmail(emailParam);
		setSearchName(nameParam);

		fetchData(
			pageParam,
			pageSizeParam,
			emailParam,
			nameParam,
			false
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchData = async (
		page: number,
		pageSize: number,
		email?: string,
		name?: string,
		updateUrl = true
	) => {
		setLoading(true);
		try {
			const params: Record<string, any> = { page, pageSize };
			if (email) params.email = email;
			if (name) params.name = name;

			const response = await userService.getAll(params);
			setCollection(response.data.data.items);
			updatePaginationData(response.data.data.pagination);

			if (updateUrl) {
				const urlParams = new URLSearchParams();
				if (email) urlParams.set('email', email);
				if (name) urlParams.set('name', name);
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
		fetchData(1, pagination.pageSize, searchEmail, searchName, true);
		handlePageChange(1, undefined, { email: searchEmail, name: searchName });
	};

	const handlePageChangeWrapper = (page: number) => {
		fetchData(page, pagination.pageSize, searchEmail, searchName, true);
		handlePageChange(page, undefined, { email: searchEmail, name: searchName });
	};

	const handleClearFilters = () => {
		setSearchEmail('');
		setSearchName('');
		router.replace(window.location.pathname, { scroll: false });
		fetchData(1, pagination.pageSize, '', '', false);
		handlePageChange(1);
	};

	const handleSuccess = () => {
		setOpen(false);
		fetchData(pagination.page, pagination.pageSize, searchEmail, searchName, false);
	};

	const handleEdit = (id: string) => {
		setSelectedId(id);
		setEditOpen(true);
	};

	const handleEditSuccess = () => {
		setEditOpen(false);
		setSelectedId(null);
		fetchData(pagination.page, pagination.pageSize, searchEmail, searchName, false);
	};

	const handleDelete = async (id: string) => {
		try {
			await userService.delete(id);
			toast.success('Usuário removido com sucesso!');
			fetchData(pagination.page, pagination.pageSize, searchEmail, searchName, false);
		} catch (error) {
			console.error(error);
			toast.error('Erro ao remover usuário!');
		}
	};

	if (error) return <p>{error}</p>;

	return (

		<Container>

			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Editar Usuário</DialogTitle>
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
				<h1 className="font-semibold text-xl">Usuários</h1>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button className="cursor-pointer"><Plus /> Novo</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Novo Usuário</DialogTitle>
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
						<BreadcrumbPage>Usuários</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<form
				className="grid gap-2 grid-cols-1 md:grid-cols-[1fr_1fr_auto] mb-4"
				onSubmit={(e) => {
					e.preventDefault();
					handleSearch();
				}}
			>
				<div>
					<Input
						placeholder="Pesquisar (nome)"
						value={searchName}
						onChange={(e) => setSearchName(e.target.value)}
					/>
				</div>
				<div>
					<Input
						placeholder="Pesquisar (email)"
						value={searchEmail}
						onChange={(e) => setSearchEmail(e.target.value)}
					/>
				</div>
				<div className="flex gap-2">
					<Button size="icon" type="submit"><Search /></Button>
					{(searchEmail || searchName) && (
						<Button variant="outline" size="icon" type="button" onClick={handleClearFilters}>
							<Trash />
						</Button>
					)}
				</div>
			</form>

			<Table>
				<TableCaption>Lista de usuários.</TableCaption>
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
									<div className="flex w-full justify-end gap-2">
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