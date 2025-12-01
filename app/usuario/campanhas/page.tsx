'use client';

import { useEffect, useState } from 'react';
import { httpClient } from '@/services'; // importa o httpClient já configurado

interface Campaign {
	id: string;
	title: string;
	description: string;
	startDate?: string;
	endDate?: string;
}

export default function CampanhasUsuarioPage() {
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCampaigns = async () => {
			try {
				// rota pública, não precisa enviar token manualmente
				const response = await httpClient.get('/public/campanhas');
				setCampaigns(response.data.data);
			} catch (err) {
				setError('Erro ao carregar campanhas.');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchCampaigns();
	}, []);

	if (loading) return <p>Carregando campanhas...</p>;
	if (error) return <p>{error}</p>;

	return (
		<main className="flex flex-col min-h-screen p-10">
			<h1 className="text-3xl font-bold mb-6 text-primary">
				Campanhas de Prevenção
			</h1>

			{campaigns.length === 0 ? (
				<p>Nenhuma campanha encontrada.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{campaigns.map((c) => (
						<div
							key={c.id}
							className="bg-[#11182a] rounded-2xl p-6 shadow-sm border border-gray-800 hover:bg-[#1a2340] transition"
						>
							<h2 className="text-xl font-semibold mb-2 text-gray-400">{c.title}</h2>
							<p className="text-gray-300 mb-3">{c.description}</p>
							{c.startDate && (
								<p className="text-sm text-gray-400">
									{new Date(c.startDate).toLocaleDateString()} –{' '}
									{c.endDate ?
										new Date(c.endDate).toLocaleDateString() :
										'data não informada'}
								</p>
							)}
						</div>
					))}
				</div>
			)}
		</main>
	);
}