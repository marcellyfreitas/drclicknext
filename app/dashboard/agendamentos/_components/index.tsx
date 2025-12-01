'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { httpClient } from '@/services';
import { Container } from '@/components/dashboard/container';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { AgendamentosService } from '@/services/modules/agendamentosService';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/datepicker';
import { formatDate } from '@/utils/functions';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomPagination } from '@/components/global/custom-pagination';
import { usePagination } from '@/hooks/use-pagination';
import { DialogForm } from './dialogs/form-dialog';

const userService = new AgendamentosService(httpClient);

export const ModuleIndex: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const { pagination, handlePageChange, updatePaginationData } = usePagination();

	const [collection, setCollection] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchUser, setSearchUser] = useState('');
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

	const initRef = useRef(false);

	useEffect(() => {
		if (initRef.current) return;
		initRef.current = true;

		const userParam = searchParams.get('user') ?? '';
		const dateParam = searchParams.get('date');
		const pageParam = parseInt(searchParams.get('page') ?? '1', 10);
		const pageSizeParam = parseInt(searchParams.get('pageSize') ?? '10', 10);

		setSearchUser(userParam);
		setSelectedDate(dateParam ? new Date(dateParam) : undefined);

		fetchData(
			pageParam,
			pageSizeParam,
			userParam,
			dateParam ? new Date(dateParam) : undefined,
			false
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchData = async (
		page: number,
		pageSize: number,
		userName?: string,
		date?: Date,
		updateUrl = true
	) => {
		setLoading(true);

		try {
			const params: Record<string, any> = { page, pageSize };
			if (userName) params.userName = userName;
			if (date) params.date = date?.toISOString();

			const response = await userService.getFiltrados(params);
			setCollection(response.data.data.items);
			updatePaginationData(response.data.data.pagination);

			if (updateUrl) {
				const urlParams = new URLSearchParams();
				if (userName) urlParams.set('user', userName);
				if (date) urlParams.set('date', date.toISOString());
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
		fetchData(1, pagination.pageSize, searchUser, selectedDate, true);
		handlePageChange(1, undefined, { user: searchUser, date: selectedDate?.toISOString() ?? '' });
	};

	const handlePageChangeWrapper = (page: number) => {
		fetchData(page, pagination.pageSize, searchUser, selectedDate, true);
		handlePageChange(page, undefined, { user: searchUser, date: selectedDate?.toISOString() ?? '' });
	};

	const handleClearFilters = () => {
		setSearchUser('');
		setSelectedDate(undefined);
		router.replace(window.location.pathname, { scroll: false });
		fetchData(1, pagination.pageSize, '', undefined, false);
		handlePageChange(1);
	};

	function handleNew() {
		setIsModalOpen(true);
	}

	function handleEdit(id: string) {
		setSelectedId(id);
		setIsModalOpen(true);
	}

	const handleDelete = async (id: string) => {
		try {
			await userService.delete(id);
			toast.success('Item removido com sucesso!');
			fetchData(pagination.page, pagination.pageSize, searchUser, selectedDate, false);
		} catch (error) {
			console.error(error);
			toast.error('Erro ao remover!');
		}
	};

	function handleModalChange(open: boolean) {
		setSelectedId(undefined);
		setIsModalOpen(open);
	}

	if (error) return <p>{error}</p>;

	return (
		<Container>
			<DialogForm
				selectedId={selectedId}
				open={isModalOpen}
				onOpenChange={handleModalChange}
				onSuccess={() => fetchData(1, pagination.pageSize, '', undefined, false)}
			/>

			<div className="flex justify-between items-center mb-4">
				<h1 className="font-semibold text-xl">Agendamentos</h1>

				<Button onClick={handleNew} className="cursor-pointer"><Plus /> Novo agendamento</Button>
			</div>

			<form
				className="grid gap-2 grid-cols-[1fr] md:grid-cols-[2fr_1fr_auto]"
				onSubmit={(e) => {
					e.preventDefault();
					handleSearch();
				}}
			>
				<div>
					<Input
						placeholder="Pesquisar (usuário)"
						value={searchUser}
						onChange={(e) => setSearchUser(e.target.value)}
					/>
				</div>

				<div>
					<DatePicker value={selectedDate} onChange={setSelectedDate} />
				</div>

				<div className="flex gap-2">
					<Button size="icon" type="submit"><Search /></Button>
					{(searchUser || selectedDate) && (
						<Button variant="outline" size="icon" type="button" onClick={handleClearFilters}>
							<Trash />
						</Button>
					)}
				</div>
			</form>

			<Table>
				<TableCaption>Lista de agendamentos.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Usuário</TableHead>
						<TableHead>Data</TableHead>
						<TableHead>Status</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loading ?
						Array.from({ length: 10 }).map((_, idx) => (
							<TableRow key={idx}>
								<TableCell><Skeleton className="h-4 w-32" /></TableCell>
								<TableCell><Skeleton className="h-4 w-48" /></TableCell>
								<TableCell><Skeleton className="h-4 w-24" /></TableCell>
								<TableCell><Skeleton className="h-4 w-24" /></TableCell>
							</TableRow>
						)) :
						collection.map((model) => (
							<TableRow key={model.id}>
								<TableCell>{model?.user?.name}</TableCell>
								<TableCell>{formatDate(model.schedule.initialHour, 'dd/MM/yyyy \'às\' HH:mm')}</TableCell>
								<TableCell>{model.status}</TableCell>
								<TableCell>
									<div className="flex justify-end gap-2">
										<Button onClick={() => handleEdit(model.id)} className="cursor-pointer rounded-full" size="icon"><Edit /></Button>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button className="cursor-pointer rounded-full" variant="destructive" size="icon"><Trash /></Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => handleDelete(model.id)} className="text-red-600">Confirmar exclusão</DropdownMenuItem>
												<DropdownMenuItem>Cancelar</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
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
