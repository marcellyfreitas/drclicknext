
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { PublicExamService } from '@/services/modules/publicExamService';
import { httpClient } from '@/services';
import { SkeletonCard } from '@/components/global/skeleton-card';
import { formatDate } from '@/utils/functions';

interface CreateFormPropsType {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedId?: string;
}

type Exame = {
	id: string
	name: string
	indication: string
	preparationRequired: string
	durationTime: string
	deliveryDeadline: string
	description: string
}

const service = new PublicExamService(httpClient);

export function ShowDialog({ open, onOpenChange, selectedId }: CreateFormPropsType) {
	const [exame, setExame] = useState<Exame | null>(null);
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

			setExame(response.data.data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	if (loading) return (<SkeletonCard />);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="!max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Detalhes Exame</DialogTitle>
				</DialogHeader>

				<div>
					<ul className="flex flex-col gap-4 py-5">
						<li className="grid grid-cols-[1fr_2fr] gap-4"><b>Nome: </b>{String(exame?.name)}</li>
						<li className="grid grid-cols-[1fr_2fr] gap-4"><b>Indicação: </b>{String(exame?.indication)}</li>
						<li className="grid grid-cols-[1fr_2fr] gap-4"><b>Pré-Requisitos: </b>{exame?.preparationRequired}</li>
						<li className="grid grid-cols-[1fr_2fr] gap-4"><b>Tempo de Duração: </b>{exame?.durationTime}</li>
						<li className="grid grid-cols-[1fr_2fr] gap-4"><b>Prazo de Entrega: </b>{exame?.deliveryDeadline}</li>
						<li className="grid grid-cols-[1fr_2fr] gap-4"><b>Descrição: </b>{exame?.description}</li>
					</ul>
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