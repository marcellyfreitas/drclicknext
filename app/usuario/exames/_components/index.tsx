'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { httpClient } from '@/services';
import { Container } from '@/components/dashboard/container';
import { Calendar, Check, CircleX, Plus, Search, X } from 'lucide-react';
import { PublicExamService } from '@/services/modules/publicExamService';
import { formatDate } from '@/utils/functions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ShowDialog } from './show-dialog';
import { FormDialog } from './form-dialog';
import { Badge } from '@/components/ui/badge';

const exameService = new PublicExamService(httpClient);

export const ModuleIndex: React.FC = () => {
	const [collection, setCollection] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showDialog, setShowDialog] = useState(false);
	const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
	const [formDialog, setFormDialog] = useState(false);

	const initRef = useRef(false);

	useEffect(() => {
		if (initRef.current) return;
		initRef.current = true;

		fetchData();

	}, []);

	const fetchData = async () => {
		setLoading(true);

		try {
			const response = await exameService.getAll();
			setCollection(response.data.data);
		} catch (err) {
			console.error(err);
			setError('Erro ao buscar lista');
		} finally {
			setLoading(false);
		}
	};

	function handleShowDialog(id: string) {
		setSelectedId(id);
		setShowDialog(true);
	}

	function handleModalChange(open: boolean) {
		setSelectedId(undefined);
		setShowDialog(open);
	}

	function handleFormDialog() {
		setFormDialog(true);
	}

	function handleFormChange(open: boolean) {
		setFormDialog(open);
	}

	if (error) return <p>{error}</p>;

	return (
		<Container>
			<ShowDialog
				open={showDialog}
				selectedId={selectedId}
				onOpenChange={handleModalChange}
			/>

			<FormDialog
				open={formDialog}
				onOpenChange={handleFormChange}
				onSuccess={fetchData}
			/>

			<div className="flex justify-between items-center mb-4">
				<h1 className="font-semibold text-xl">Exames Diponíveis</h1>
			</div>

			<Table>
				<TableCaption>Lista de exames.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{collection.map((model) => (
						<TableRow key={model.id}>
							<TableCell>{model.name}</TableCell>
							<TableCell>
								<div className="flex justify-end gap-2">
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												onClick={() => handleShowDialog(model.id)}
												className="cursor-pointer rounded-full"
												size="icon">
												<Search />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Detalhes agendamento</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Container>
	);
};
