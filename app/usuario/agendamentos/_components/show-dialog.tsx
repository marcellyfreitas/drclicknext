import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { AgendamentosService } from '@/services/modules/agendamentosService';
import { AppointmentRatingService } from '@/services/modules/appointmentRatingService';
import { httpClient } from '@/services';
import { SkeletonCard } from '@/components/global/skeleton-card';
import { formatDate } from '@/utils/functions';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CreateFormPropsType {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedId?: string;
}

type Agendamento = {
	id: string
	description: string
	status: string
	schedule: {
		id: string
		initialHour: string
		finalHour: string
		medical: {
			id: string
			name: string
			cpf: string
			email: string
			crm: string
		}
	}
}

type Rating = {
	id: string;
	rating: number;
	comment: string;
	appointmentId: string;
}

const service = new AgendamentosService(httpClient, '/public/agendamentos');
const ratingService = new AppointmentRatingService(httpClient);

export function ShowDialog({ open, onOpenChange, selectedId }: CreateFormPropsType) {
	const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
	const [rating, setRating] = useState<Rating | null>(null);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open && selectedId) {
			fetchData(selectedId as string);
		}
	}, [open, selectedId]);

	async function fetchData(id: string) {
		setLoading(true);

		try {
			const response = await service.getById(id);
			const appointmentData = response.data.data;
			setAgendamento(appointmentData);

			// Buscar avaliação se existir
			if (appointmentData.status.toLowerCase() === 'concluído') {
				await fetchRating(id);
			}

		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	async function fetchRating(appointmentId: string) {
		try {
			const response = await ratingService.getAll({ appointmentId });
			const ratings = response.data.data;

			if (ratings && ratings.length > 0) {
				setRating(ratings[0]);
			} else {
				setRating(null);
			}
		} catch (error) {
			console.error('Erro ao buscar avaliação:', error);
			setRating(null);
		}
	}

	const ratingLabels = [
		'Péssimo',
		'Ruim',
		'Regular',
		'Bom',
		'Excelente',
	];

	if (loading) return (<SkeletonCard />);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="!max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Agendamento <small>({String(agendamento?.id).toUpperCase()})</small></DialogTitle>
				</DialogHeader>
				<div>
					<ul className="flex flex-col gap-4 py-5">
						<li className="grid grid-cols-[1fr_2fr] gap-4"><b>Data da consulta: </b>{formatDate(agendamento?.schedule?.initialHour, 'dd/MM/yyyy \'às\' HH:mm')}</li>
						<li className="grid grid-cols-[1fr_2fr] gap-4"><b>Protocolo de atendimento: </b>{String(agendamento?.id).toUpperCase()}</li>
						<li className="grid grid-cols-[1fr_2fr] gap-4"><b>Status: </b>{agendamento?.status}</li>
						<li className="grid grid-cols-[1fr_2fr] gap-4"><b>Médico responsável: </b>{agendamento?.schedule?.medical?.name}</li>
						<li className="grid grid-cols-[1fr_2fr] gap-4"><b>Médico email: </b>{agendamento?.schedule?.medical?.email}</li>
						<li className="grid grid-cols-[1fr_2fr] gap-4"><b>Descrição: </b>{agendamento?.description}</li>
					</ul>

					{/* Seção de Avaliação */}
					{agendamento?.status.toLowerCase() === 'concluído' && (
						<div className="border-t pt-4 mt-4">
							<h3 className="font-semibold text-lg mb-3">Avaliação da Consulta</h3>

							{rating ? (
								<div className="space-y-3 border border-white/20 p-4 rounded-lg bg-transparent">
									<div className="flex items-center gap-3">
										<div className="flex gap-1">
											{Array.from({ length: 5 }).map((_, index) => (
												<Star
													key={index}
													className={`h-5 w-5 ${
														index < rating.rating ?
															'fill-yellow-400 text-yellow-400' :
															'text-gray-300'
													}`}
												/>
											))}
										</div>
										<Badge variant="secondary">
											{ratingLabels[rating.rating - 1]}
										</Badge>
									</div>

									{rating.comment && (
										<div>
											<p className="text-sm font-medium mb-1">Comentário:</p>
											<p className="text-sm p-3 rounded-lg border border-white/20 bg-transparent">
												{rating.comment}
											</p>
										</div>
									)}
								</div>
							) : (
								<div className="text-center py-6 border border-white/20 rounded-lg bg-transparent">
									<Star className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
									<p className="text-muted-foreground">Nenhuma avaliação foi feita para esta consulta.</p>
								</div>
							)}
						</div>
					)}
				</div>
				<DialogFooter>
					<div className="w-full flex justify-center items-center">
						<Button
							className="cursor-pointer"
							type="button"
							onClick={() => onOpenChange(false)}
						>
							Fechar
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}