import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { AppointmentRatingService } from '@/services/modules/appointmentRatingService';
import { httpClient } from '@/services';
import { toast } from 'sonner';
import { Star, Loader2Icon } from 'lucide-react';
import { useUserAuthentication } from '@/contexts/user-authentication-context';

interface RatingDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	appointmentId?: string;
	existingRating?: any;
	onSuccess?: () => void;
}

const ratingService = new AppointmentRatingService(httpClient);

export function RatingDialog({ open, onOpenChange, appointmentId, existingRating, onSuccess }: RatingDialogProps) {
	const [rating, setRating] = useState(0);
	const [hoveredRating, setHoveredRating] = useState(0);
	const [comment, setComment] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isViewMode, setIsViewMode] = useState(false);

	const { user } = useUserAuthentication();

	useEffect(() => {
		if (open) {
			if (existingRating) {
				// Modo visualização - já existe avaliação
				setRating(existingRating.rating);
				setComment(existingRating.comment || '');
				setIsViewMode(true);
			} else {
				// Modo criação - nova avaliação
				setRating(0);
				setComment('');
				setIsViewMode(false);
			}
		}
	}, [open, existingRating]);

	const handleStarClick = (starValue: number) => {
		if (!isViewMode) {
			setRating(starValue);
		}
	};

	const handleSubmit = async () => {
		if (!appointmentId) {
			toast.error('ID do agendamento não encontrado');
			return;
		}

		if (rating === 0) {
			toast.error('Por favor, selecione uma avaliação');
			return;
		}

		setIsSubmitting(true);

		try {
			if (existingRating) {
				// Atualizar avaliação existente
				await ratingService.update(existingRating.id, {
					rating,
					comment,
					appointmentId,
					userId: user.id,
				});
				toast.success('Avaliação atualizada com sucesso!');
			} else {
				// Criar nova avaliação
				await ratingService.create({
					rating,
					comment,
					appointmentId,
					userId: user.id,
				});
				toast.success('Avaliação enviada com sucesso!');
			}

			if (onSuccess) onSuccess();
			onOpenChange(false);
		} catch (error: any) {
			console.error(error);
			const msg = error?.response?.data?.message || 'Erro ao salvar avaliação';
			toast.error(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = () => {
		setIsViewMode(false);
	};

	const ratingLabels = [
		'Péssimo',
		'Ruim',
		'Regular',
		'Bom',
		'Excelente',
	];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{isViewMode ? 'Sua Avaliação' : existingRating ? 'Editar Avaliação' : 'Avaliar Consulta'}
					</DialogTitle>
					<DialogDescription>
						{isViewMode ?
							'Visualize sua avaliação ou clique em "Editar" para modificá-la.' :
							'Sua opinião é muito importante para melhorarmos nossos serviços.'
						}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Estrelas de avaliação */}
					<div className="space-y-3">
						<Label>
							Avaliação {!isViewMode && '*'}
						</Label>
						<div className="flex flex-col items-center gap-3">
							<div className="flex gap-2">
								{Array.from({ length: 5 }).map((_, index) => {
									const starValue = index + 1;
									const isFilled = starValue <= (hoveredRating || rating);

									return (
										<button
											key={index}
											type="button"
											disabled={isViewMode}
											onClick={() => handleStarClick(starValue)}
											onMouseEnter={() => !isViewMode && setHoveredRating(starValue)}
											onMouseLeave={() => !isViewMode && setHoveredRating(0)}
											className={`transition-all ${!isViewMode ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
										>
											<Star
												className={`h-10 w-10 ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
											/>
										</button>
									);
								})}
							</div>
							{rating > 0 && (
								<p className="text-sm font-medium text-muted-foreground">
									{ratingLabels[rating - 1]}
								</p>
							)}
						</div>
					</div>

					{/* Comentário */}
					<div className="space-y-2">
						<Label htmlFor="comment">
							Comentário <span className="text-muted-foreground text-xs">(opcional)</span>
						</Label>
						<Textarea
							id="comment"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder="Conte-nos mais sobre sua experiência..."
							rows={4}
							disabled={isViewMode}
							className={isViewMode ? 'bg-gray-50' : ''}
						/>
					</div>
				</div>

				<DialogFooter>
					<div className="flex w-full justify-between">
						{isViewMode && existingRating ? (
							<Button
								type="button"
								variant="outline"
								onClick={handleEdit}
							>
								Editar
							</Button>
						) : (
							<div />
						)}

						<div className="flex gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								{isViewMode ? 'Fechar' : 'Cancelar'}
							</Button>

							{!isViewMode && (
								<Button
									type="button"
									onClick={handleSubmit}
									disabled={isSubmitting || rating === 0}
									className="min-w-24"
								>
									{isSubmitting && <Loader2Icon className="animate-spin h-4 w-4 mr-2" />}
									{isSubmitting ? 'Enviando...' : existingRating ? 'Atualizar' : 'Enviar'}
								</Button>
							)}
						</div>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}