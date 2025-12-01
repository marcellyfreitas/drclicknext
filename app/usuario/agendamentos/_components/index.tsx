'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { httpClient } from '@/services';
import { Container } from '@/components/dashboard/container';
import { Calendar, Check, CircleX, Plus, Search, Star, X } from 'lucide-react';
import { AgendamentosService } from '@/services/modules/agendamentosService';
import { AppointmentRatingService } from '@/services/modules/appointmentRatingService';
import { formatDate } from '@/utils/functions';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ShowDialog } from './show-dialog';
import { FormDialog } from './form-dialog';
import { RatingDialog } from './rating-dialog';
import { Badge } from '@/components/ui/badge';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { CancelDialog } from './cancel-dialog';

type StatusTypes = 'Concluído' | 'Agendado' | 'Cancelado';

const agendamentosService = new AgendamentosService(httpClient, '/public/agendamentos');
const ratingService = new AppointmentRatingService(httpClient);

const statusMap: Record<StatusTypes, { icon: JSX.Element, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
	'Concluído': { icon: <Check className="h-3 w-3" />, variant: 'default' },
	'Agendado': { icon: <Calendar className="h-3 w-3" />, variant: 'secondary' },
	'Cancelado': { icon: <X className="h-3 w-3" />, variant: 'destructive' },
};

const RatingButton = ({ appointment, rating, onRate }: { appointment: any; rating?: any; onRate: (appointmentId: string) => void }) => {
	const hasRating = !!rating;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					onClick={() => onRate(appointment.id)}
					className="cursor-pointer rounded-full"
					variant={hasRating ? 'secondary' : 'outline'}
					size="icon"
				>
					<Star className={hasRating ? 'fill-yellow-400' : ''} />
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>{hasRating ? `Ver avaliação (${rating.rating} estrelas)` : 'Avaliar consulta'}</p>
			</TooltipContent>
		</Tooltip>
	);
};

const RatingStars = ({ rating, onRate }: { rating?: any; onRate?: () => void }) => {
	if (!rating) {
		return <span className="text-gray-400 text-sm">-</span>;
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div
					className={`flex gap-1 ${onRate ? 'cursor-pointer' : 'cursor-default'}`}
					onClick={onRate}
				>
					{Array.from({ length: 5 }).map((_, index) => (
						<Star
							key={index}
							className={`h-4 w-4 ${index < rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
						/>
					))}
				</div>
			</TooltipTrigger>
			<TooltipContent>
				<p>{rating.rating} estrelas{rating.comment && ` - ${rating.comment}`}</p>
			</TooltipContent>
		</Tooltip>
	);
};

export const ModuleIndex: React.FC = () => {
	const [collection, setCollection] = useState<any[]>([]);
	const [ratings, setRatings] = useState<Record<string, any>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showDialog, setShowDialog] = useState(false);
	const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
	const [formDialog, setFormDialog] = useState(false);
	const [cancelDialog, setCancelDialog] = useState(false);
	const [appointmentToCancel, setAppointmentToCancel] = useState<string | undefined>(undefined);

	const [ratingDialog, setRatingDialog] = useState<{
		open: boolean;
		appointmentId?: string;
		existingRating?: any;
	}>({
		open: false,
		appointmentId: undefined,
		existingRating: null,
	});

	const initRef = useRef(false);

	useEffect(() => {
		if (initRef.current) return;
		initRef.current = true;

		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading(true);

		try {
			const response = await agendamentosService.getAll();
			const appointments = response.data.data;
			setCollection(appointments);

			await fetchRatings();
		} catch (err) {
			console.error(err);
			setError('Erro ao buscar lista');
		} finally {
			setLoading(false);
		}
	};

	const fetchRatings = async () => {
		try {
			const response = await ratingService.getAll();
			const allRatings = response.data.data;

			// Criar um mapa de appointmentId -> rating
			const ratingsMap: Record<string, any> = {};
			allRatings.forEach((rating: any) => {
				// Use rating.appointment.id em vez de rating.appointmentId
				if (rating.appointment && rating.appointment.id) {
					ratingsMap[rating.appointment.id] = rating;
				}
			});

			setRatings(ratingsMap);
		} catch (err) {
			console.error('Erro ao buscar avaliações:', err);
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

	// Função única para abrir o rating dialog - compatível com seu RatingDialog
	function handleRatingDialog(appointmentId: string) {
		const existingRating = ratings[appointmentId];
		setRatingDialog({
			open: true,
			appointmentId,
			existingRating,
		});
	}

	// Função única para fechar o rating dialog - compatível com seu RatingDialog
	function handleRatingChange(open: boolean) {
		setRatingDialog(prev => ({
			...prev,
			open,
		}));

		// Se está fechando, limpa os dados após um delay para animação
		if (!open) {
			setTimeout(() => {
				setRatingDialog({
					open: false,
					appointmentId: undefined,
					existingRating: null,
				});
			}, 300);
		}
	}

	function handleRatingSuccess() {
		// Recarrega os dados para atualizar as avaliações
		fetchData();
	}

	function handleOpenCancelDialog(appointmentId: string) {
		setAppointmentToCancel(appointmentId);
		setCancelDialog(true);
	}

	function handleCancelDialogChange(open: boolean) {
		setCancelDialog(open);
		if (!open) {
			setAppointmentToCancel(undefined);
		}
	}

	async function handleConfirmCancel() {
		if (!appointmentToCancel) return;

		const appointment = collection.find(item => item.id === appointmentToCancel);
		if (!appointment) return;

		try {
			await agendamentosService.update(appointmentToCancel, {
				'userId': appointment?.user?.id,
				'scheduleId': appointment?.schedule?.id,
				'description': appointment?.description || '',
				'status': 'Cancelado',
			});
			await fetchData();
			setCancelDialog(false);
			setAppointmentToCancel(undefined);

		} catch (err) {
			console.error('Erro ao cancelar agendamento:', err);
		}
	}

	function canCancelAppointment(appointment: any) {
		if (['concluído', 'cancelado'].includes(String(appointment.status).toLowerCase())) {
			return false;
		}

		const appointmentDate = parseISO(appointment?.schedule?.initialHour ?? '');
		const today = new Date();
		const diffInDays = differenceInCalendarDays(appointmentDate, today);
		return diffInDays >= 2;
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

			{/* RatingDialog compatível com suas props existentes */}
			<RatingDialog
				open={ratingDialog.open}
				onOpenChange={handleRatingChange}
				appointmentId={ratingDialog.appointmentId}
				existingRating={ratingDialog.existingRating}
				onSuccess={handleRatingSuccess}
			/>

			<CancelDialog
				open={cancelDialog}
				onOpenChange={handleCancelDialogChange}
				onConfirm={handleConfirmCancel}
				title="Cancelar agendamento"
				description="Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita."
				confirmText="Sim, cancelar"
				cancelText="Manter agendamento"
			/>

			<div className="flex justify-between items-center mb-4">
				<h1 className="font-semibold text-xl">Meus agendamentos</h1>

				<Button onClick={() => handleFormDialog()} className="cursor-pointer"><Plus /> Novo agendamento</Button>
			</div>

			<Table>
				<TableCaption>Lista de agendamentos.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-4/10">Data</TableHead>
						<TableHead className="w-3/10">Status</TableHead>
						<TableHead className="w-2/10">Avaliação</TableHead>
						<TableHead className="w-2/10"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loading ?
						Array.from({ length: 10 }).map((_, idx) => (
							<TableRow key={idx}>
								<TableCell><Skeleton className="h-4 w-48" /></TableCell>
								<TableCell><Skeleton className="h-4 w-24" /></TableCell>
								<TableCell><Skeleton className="h-4 w-24" /></TableCell>
								<TableCell><Skeleton className="h-4 w-24" /></TableCell>
							</TableRow>
						)) :
						collection.map((model) => (
							<TableRow key={model.id}>
								<TableCell>{formatDate(model.schedule.initialHour, 'dd/MM/yyyy \'às\' HH:mm')}</TableCell>
								<TableCell>
									<Badge
										variant={statusMap[model.status as StatusTypes]?.variant || 'outline'} className="flex gap-1 items-center w-fit">
										{statusMap[model.status as StatusTypes]?.icon}
										<small>{String(model.status).toUpperCase()}</small>
									</Badge>
								</TableCell>
								<TableCell>
									{model.status.toLowerCase() === 'concluído' ? (
										<RatingStars
											rating={ratings[model.id]}
											onRate={() => handleRatingDialog(model.id)}
										/>
									) : (
										<span className="text-gray-400 text-sm">-</span>
									)}
								</TableCell>
								<TableCell>
									<div className="flex justify-end gap-2">
										{/* Botão de avaliação - só aparece para agendamentos concluídos */}
										{model.status.toLowerCase() === 'concluído' && (
											<RatingButton
												appointment={model}
												rating={ratings[model.id]}
												onRate={handleRatingDialog}
											/>
										)}

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

										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													disabled={!canCancelAppointment(model)}
													className="cursor-pointer rounded-full"
													onClick={() => handleOpenCancelDialog(model.id)}
													variant="destructive"
													size="icon">
													<CircleX />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Cancelar agendamento</p>
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