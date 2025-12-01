'use client';
import React, { useEffect, useState } from 'react';

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Container } from '@/components/dashboard/container';

import { httpClient } from '@/services';
import { PublicConvenioService } from '@/services/modules/publicConvenioService';

const publicConvenioService = new PublicConvenioService(httpClient);

const ConveniosIndex = () => {
	const [collection, setCollection] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchConvenios = async () => {
		try {
			const response = await publicConvenioService.getAll();

			if (!response.data) {
				throw new Error('Resposta da API não contém dados');
			}

			const data = response.data?.data || [];
			if (!Array.isArray(data)) {
				throw new Error('Dados da API não estão no formato esperado');
			}

			setCollection(data);
		} catch (error: any) {
			console.error('Erro detalhado:', error);
			setError(error.message || 'Erro ao buscar lista de convênios');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchConvenios();
	}, []);

	if (error) {
		return (
			<Container>
				<p className="text-red-500 text-center p-4">{error}</p>
			</Container>
		);
	}

	if (loading) {
		return (
			<Container>
				<div className="mb-4">
					<Skeleton className="h-8 w-48" />
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
			<div className="mb-4">
				<h1 className="font-semibold text-xl">Convênios Disponíveis</h1>
			</div>

			<Table>
				<TableCaption>Lista de Convênios disponíveis.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{collection.length === 0 ? (
						<TableRow>
							<TableCell className="text-center text-gray-500 py-8">
								Nenhum convênio disponível no momento.
							</TableCell>
						</TableRow>
					) : (
						collection.map((item) => (
							<TableRow key={item.id}>
								<TableCell className="font-medium">{item.name}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</Container>
	);
};

export default ConveniosIndex;
