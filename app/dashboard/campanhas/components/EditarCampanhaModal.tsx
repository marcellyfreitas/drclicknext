'use client';

import { useEffect, useState } from 'react';
import { httpClient } from '@/services';

interface EditarCampanhaModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void; // Para recarregar a lista no pai
	campanhaId: string | null; // O ID da campanha a ser editada
}

export default function EditarCampanhaModal({ isOpen, onClose, onSuccess, campanhaId }: EditarCampanhaModalProps) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(true); // Para carregar os dados iniciais
	const [loadingSubmit, setLoadingSubmit] = useState(false); // Para o envio do formulário
	const [message, setMessage] = useState('');

	useEffect(() => {
		if (isOpen && campanhaId) {
			setLoadingData(true);
			setMessage('');
			const fetchData = async () => {
				try {
					const res = await httpClient.get(`/private/campanhas/${campanhaId}`);
					const c = res.data;
					setTitle(c.title);
					setDescription(c.description);
					// Formata a data para o input type="date"
					setStartDate(c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '');
					setEndDate(c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : '');
				} catch (err) {
					console.error('Erro ao carregar dados da campanha:', err);
					setMessage('Erro ao carregar dados da campanha.');
				} finally {
					setLoadingData(false);
				}
			};
			fetchData();
		} else if (!isOpen) {
			// Limpa o estado quando o modal é fechado
			setTitle('');
			setDescription('');
			setStartDate('');
			setEndDate('');
			setMessage('');
			setLoadingData(true);
			setLoadingSubmit(false);
		}
	}, [isOpen, campanhaId]);

	if (!isOpen) return null; // Não renderiza se não estiver aberto

	// Função para fechar e limpar o estado do formulário
	const handleCancel = () => {
		setTitle('');
		setDescription('');
		setStartDate('');
		setEndDate('');
		setMessage('');
		setLoading(false);
		onClose();
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoadingSubmit(true);
		setMessage('');

		try {
			await httpClient.put(`/private/campanhas/${campanhaId}`, {
				title,
				description,
				startDate,
				endDate,
			});
			setMessage('Campanha atualizada com sucesso!');
			onSuccess(); // Recarrega a lista
			onClose(); // Fecha o modal após o sucesso
		} catch (err) {
			console.error('Erro ao atualizar campanha:', err);
			setMessage('Erro ao atualizar campanha.');
		} finally {
			setLoadingSubmit(false);
		}
	};

	return (
		// Overlay escuro
		<div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50">
			{/* Container do Modal */}
			<form
				onSubmit={handleUpdate}
				className="bg-gray-100 text-white rounded-2xl p-8 shadow-lg w-full max-w-lg relative" // Cor de fundo ajustada para dark
			>
				{/* Botão de fechar 'X' no canto superior direito */}
				<button type="button" onClick={onClose} className="absolute top-4 right-4 text-[#1e1e2e] text-xl font-bold">
					&times;
				</button>

				<h1 className="text-2xl font-bold mb-6 text-[#1e1e2e]">Editar Campanha</h1>

				{loadingData ? (
					<p className="text-center text-gray-400">Carregando dados da campanha...</p>
				) : (
					<>
						<label className="block mb-4">
							<span className="text-[#1e1e2e] font-bold">Título</span>
							<input
								type="text"
								value={title ?? ''}
								onChange={(e) => setTitle(e.target.value)}
								className="w-full p-2 mt-1 rounded bg-white border border-gray-300 text-[#1e1e2e] shadow-md focus:shadow-lg focus:border-[#1e1e2e] focus:ring-1 focus:ring-[#1e1e2e]/40 transition"
							/>
						</label>

						<label className="block mb-4">
							<span className="text-[#1e1e2e] font-bold">Descrição</span>
							<textarea
								value={description ?? ''}
								onChange={(e) => setDescription(e.target.value)}
								className="w-full p-2 mt-1 rounded bg-white border border-gray-300 h-24 text-[#1e1e2e] shadow-md focus:shadow-lg focus:border-[#1e1e2e] focus:ring-1 focus:ring-[#1e1e2e]/40 transition"
							/>
						</label>

						<div className="grid grid-cols-2 gap-4 mb-6">
							<label className="block">
								<span className="text-[#1e1e2e] font-bold">Data de Início</span>
								<input
									type="date"
									value={startDate ?? ''}
									onChange={(e) => setStartDate(e.target.value)}
									className="w-full p-2 mt-1 rounded bg-white border border-gray-300 text-[#1e1e2e] shadow-md focus:shadow-lg focus:border-[#1e1e2e] focus:ring-1 focus:ring-[#1e1e2e]/40 transition"
								/>
							</label>

							<label className="block">
								<span className="text-[#1e1e2e] font-bold">Data de Término</span>
								<input
									type="date"
									value={endDate ?? ''}
									onChange={(e) => setEndDate(e.target.value)}
									className="w-full p-2 mt-1 rounded bg-white border border-gray-300 text-[#1e1e2e] shadow-md focus:shadow-lg focus:border-[#1e1e2e] focus:ring-1 focus:ring-[#1e1e2e]/40 transition"
								/>
							</label>
						</div>

						<div className="flex justify-center gap-3 mt-4">
							<button
								type="button"
								onClick={handleCancel}
								disabled={loading}
								className="flex-1 bg-gray-400 text-[#1e1e2e] font-bold px-4 py-3 rounded-lg transition hover:bg-gray-500"
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={loadingSubmit}
								className="flex-1 bg-[#1e1e2e] hover:bg-[#3c3c5c] text-white font-bold px-4 py-3 rounded-lg transition"
							>
								{loadingSubmit ? 'Salvando Alterações...' : 'Salvar Alterações'}
							</button>
						</div>
					</>
				)}

				{message && (
					<p className="mt-4 text-center text-sm text-red-500">{message}</p>
				)}
			</form>
		</div>
	);
}