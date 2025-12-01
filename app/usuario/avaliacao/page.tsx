'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { httpClient } from '@/services';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2Icon, Star } from 'lucide-react';

export default function AvaliarConsultaPage() {
	const router = useRouter();
	const params = useParams();
	const appointmentId = params.id as string;

	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [comment, setComment] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (rating === 0) {
			toast.error('Por favor, selecione uma avaliação!');
			return;
		}

		if (!comment.trim()) {
			toast.error('Por favor, escreva um comentário!');
			return;
		}

		try {
			setLoading(true);

			// Pega o userId do token ou contexto (ajuste conforme sua autenticação)
			const userId = 'SEU_USER_ID_AQUI'; // TODO: pegar do contexto/token

			await httpClient.post('/public/agendamento-avaliacoes', {
				rating,
				comment,
				appointmentId,
				userId,
			});

			toast.success('Avaliação enviada com sucesso!');
			router.push('/meus-agendamentos'); // redireciona para lista de agendamentos
		} catch (error) {
			console.error(error);
			toast.error('Erro ao enviar avaliação!');
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="flex flex-col min-h-screen items-center justify-center p-6">
			<div className="w-full max-w-md bg-[#11182a] rounded-2xl p-8 border border-gray-800">
				<h1 className="text-2xl font-bold mb-2 text-gray-100">
					Como foi sua consulta?
				</h1>
				<p className="text-gray-400 mb-6">
					Sua opinião nos ajuda a melhorar nossos serviços
				</p>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Sistema de Estrelas */}
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-3">
							Avaliação
						</label>
						<div className="flex gap-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoverRating(star)}
									onMouseLeave={() => setHoverRating(0)}
									className="transition-transform hover:scale-110"
								>
									<Star
										size={40}
										className={
											star <= (hoverRating || rating) ?
												'fill-yellow-400 text-yellow-400' :
												'text-gray-600'
										}
									/>
								</button>
							))}
						</div>
						{rating > 0 && (
							<p className="text-sm text-gray-400 mt-2">
								{rating === 1 && 'Muito ruim'}
								{rating === 2 && 'Ruim'}
								{rating === 3 && 'Regular'}
								{rating === 4 && 'Bom'}
								{rating === 5 && 'Excelente'}
							</p>
						)}
					</div>

					{/* Campo de Comentário */}
					<div>
						<label
							htmlFor="comment"
							className="block text-sm font-medium text-gray-300 mb-2"
						>
							Comentário
						</label>
						<textarea
							id="comment"
							rows={5}
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder="Conte-nos sobre sua experiência..."
							className="w-full px-4 py-3 bg-[#1a2340] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>

					{/* Botões */}
					<div className="flex gap-3">
						<Button
							type="button"
							variant="outline"
							className="flex-1"
							onClick={() => router.back()}
							disabled={loading}
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							className="flex-1"
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader2Icon className="animate-spin mr-2" size={16} />
									Enviando...
								</>
							) : (
								'Enviar Avaliação'
							)}
						</Button>
					</div>
				</form>
			</div>
		</main>
	);
}