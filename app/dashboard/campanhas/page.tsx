'use client';

import { useEffect, useState } from 'react';
import { httpClient } from '@/services';
import Link from 'next/link';
import NovaCampanhaModal from './components/NovaCampanhaModal';
import EditarCampanhaModal from './components/EditarCampanhaModal';

export default function CampanhasPage() {
	const [campanhas, setCampanhas] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// Estados para criação do modal
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Estados para edição do modal
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedCampanhaId, setSelectedCampanhaId] = useState<string | null>(null);

	const fetchCampanhas = async () => {
		try {
			const response = await httpClient.get('/private/campanhas');
			setCampanhas(response.data.data || []);
		} catch (err: any) {
			console.error(err);
			setError('Erro ao carregar campanhas.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCampanhas();
	}, []);

	const handleDelete = async (id: string) => {
		if (!confirm('Deseja realmente excluir esta campanha?')) return;
		try {
			await httpClient.delete(`/private/campanhas/${id}`);
			fetchCampanhas(); // Recarrega a lista
		} catch (err) {
			console.error(err);
			alert('Erro ao excluir campanha.');
		}
	};

	// Função para abrir o modal de edição
	const handleEditClick = (id: string) => {
		setSelectedCampanhaId(id);
		setIsEditModalOpen(true);
	};

	if (loading) return <p className="p-10 text-white">Carregando...</p>;
	if (error) return <p className="p-10 text-red-400">{error}</p>;

	return (
		<main className="p-10 min-h-screen bg-white">

			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-black">Campanhas de Prevenção</h1>
				<button
					onClick={() => setIsCreateModalOpen(true)}
					className="bg-[#1e1e2e] hover:bg-[#3c3c5c] px-4 py-2 rounded-lg text-white"
				>
					+ Nova Campanha
				</button>
			</div>

			<div className="space-y-4">
				{campanhas.length === 0 ? (
					<p className="text-black">Nenhuma campanha cadastrada.</p>
				) : (
					campanhas.map((campanha) => (
						<div
							key={campanha.id}
							className="bg-gray-200 hover:bg-gray-300 transition p-6 rounded-xl shadow flex justify-between items-center"
						>
							<div>
								<h2 className="text-xl font-semibold text-[#1e1e2e]">{campanha.title}</h2>
								<p className="text-[#1e1e2e]">{campanha.description}</p>
								<p className="text-[#1e1e2e] text-sm mt-1">
									{new Date(campanha.startDate).toLocaleDateString()} —{' '}
									{new Date(campanha.endDate).toLocaleDateString()}
								</p>
							</div>

							<div className="flex gap-3">
								<button
									onClick={() => handleEditClick(campanha.id)}
									className="bg-[#1e1e2e] text-white font-bold hover:bg-[#3c3c5c] px-3 py-1 rounded"
								>
									Editar
								</button>
								<button
									onClick={() => handleDelete(campanha.id)}
									className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded"
								>
									Excluir
								</button>
							</div>
						</div>
					))
				)}
			</div>

			<NovaCampanhaModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSuccess={fetchCampanhas}
			/>
			<EditarCampanhaModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				onSuccess={fetchCampanhas}
				campanhaId={selectedCampanhaId}
			/>
		</main>
	);
}