'use client';

import { useState } from 'react';
import { httpClient } from '@/services';

// Define as propriedades que o modal irá receber
interface NovaCampanhaModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void; // Função para atualizar a lista no pai
}

export default function NovaCampanhaModal({ isOpen, onClose, onSuccess }: NovaCampanhaModalProps) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	if (!isOpen) return null; // Não renderiza se não estiver aberto

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		try {
			const response = await httpClient.post('/private/campanhas', {
				title,
				description,
				startDate,
				endDate,
			});

			if (response.status === 201 || response.status === 200) {
				// Limpa os campos e fecha o modal
				setTitle('');
				setDescription('');
				setStartDate('');
				setEndDate('');
				onSuccess(); // Chama a função para o pai recarregar a lista
				onClose();
			}
		} catch (error: any) {
			console.error(error);
			setMessage('Erro ao criar campanha. Verifique as informações.');
		} finally {
			setLoading(false);
		}
	};

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

	return (
		// Overlay escuro
		<div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50">
			{/* Container do Modal */}
			<form
				onSubmit={handleSubmit}
				className="bg-gray-100 text-white rounded-2xl p-8 shadow-lg w-full max-w-lg relative"
			>
				{/* Botão de fechar 'X' no canto superior direito */}
				<button type="button" onClick={handleCancel} className="absolute top-4 right-4 text-[#1e1e2e] text-xl font-bold">
					&times;
				</button>

				<h1 className="text-2xl font-bold mb-6 text-[#1e1e2e]">
					Nova Campanha
				</h1>
				{/* Campos do formulário - Mantidos de 'criar/page.tsx' */}
				<label className="block mb-4">
					<span className="font-bold text-[#1e1e2e]">Título da campanha</span>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						className="w-full p-2 mt-1 rounded text-[#1e1e2e] bg-white border border-gray-300 shadow-md focus:shadow-lg focus:border-[#1e1e2e] focus:ring-1 focus:ring-[#1e1e2e]/40 transition"
					/>
				</label>

				<label className="block mb-4">
					<span className="font-bold text-[#1e1e2e]">Descrição</span>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
						className="w-full p-2 mt-1 rounded text-[#1e1e2e] bg-white border border-gray-300 h-24 shadow-md focus:shadow-lg focus:border-[#1e1e2e] focus:ring-1 focus:ring-[#1e1e2e]/40 transition"
					/>
				</label>

				<div className="grid grid-cols-2 gap-4 mb-6">
					<label className="block">
						<span className="font-bold text-[#1e1e2e]">Data de Início</span>
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							required
							className="w-full p-2 mt-1 rounded text-[#1e1e2e] bg-white border border-gray-300 shadow-md focus:shadow-lg focus:border-[#1e1e2e] focus:ring-1 focus:ring-[#1e1e2e]/40 transition"
						/>
					</label>

					<label className="block">
						<span className="font-bold text-[#1e1e2e]">Data de Término</span>
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							required
							className="w-full p-2 mt-1 rounded text-[#1e1e2e] bg-white border border-gray-300 shadow-md focus:shadow-lg focus:border-[#1e1e2e] focus:ring-1 focus:ring-[#1e1e2e]/40 transition"
						/>
					</label>
				</div>

				<div className="flex justify-end gap-3 mt-4">
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
						disabled={loading}
						className="flex-1 bg-[#1e1e2e] hover:bg-[#3c3c5c] text-white font-bold px-4 py-3 rounded-lg transition"
					>
						{loading ? 'Salvando...' : 'Salvar'}
					</button>
				</div>

				{message && (
					<p className="mt-4 text-center text-sm text-red-500">{message}</p>
				)}
			</form>
		</div>
	);
}