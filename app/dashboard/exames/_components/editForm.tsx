import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PrivateExamService } from '@/services/modules/privateExamService';
import { httpClient } from '@/services';
import { Loader2Icon } from 'lucide-react';

const schema = z.object({
	name: z.string().min(3, 'Campo Obrigatório'),
	indication: z.string().min(10, 'Campo Obrigatório'),
	preparationRequired: z.string().min(10, 'Campo Obrigatório'),
	durationTime: z.string().min(3, 'Campo Obrigatório'),
	deliveryDeadline: z.string().min(3, 'Campo Obrigatório'),
	description: z.string().min(10, 'Campo Obrigatório'),
});

type EditFormData = z.infer<typeof schema>;

interface EditFormProps {
	id: string;
	onCancel?: () => void;
	onSuccess?: () => void;
}

const service = new PrivateExamService(httpClient);

export const EditForm: React.FC<EditFormProps> = ({ id, onCancel, onSuccess }) => {
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<EditFormData>({
		resolver: zodResolver(schema),
		mode: 'onChange',
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setFetching(true);
				const response = await service.getById(id);
				const exame = response.data.data;
				reset({
					name: exame.name,
					indication: exame.indication,
					preparationRequired: exame.preparationRequired,
					durationTime: exame.durationTime,
					deliveryDeadline: exame.deliveryDeadline,
					description: exame.description,
				});
			} catch (error) {
				console.error(error);
				toast.error('Erro ao buscar dados!');
			} finally {
				setFetching(false);
			}
		};
		if (id) fetchData();
	}, [id, reset]);

	const onSubmit = async (data: EditFormData) => {
		try {
			setLoading(true);
			await service.update(id, data);
			toast.success('Exame atualizado com sucesso!');
			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao atualizar exame!');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			className="space-y-4 mt-4"
			onSubmit={handleSubmit(onSubmit)}
			autoComplete="off"
		>
			<div className="grid gap-6">
				<div className="grid gap-4 p-4 border border-slate-100 rounded-lg">

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Nome</label>
							<input
								id="nome"
								type="nome"
								{...register('name')}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Indicação</label>
							<input
								id="indicacao"
								type="indicacao"
								{...register('indication')}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{errors.indication && <p className="text-red-500 text-xs mt-1">{errors.indication.message}</p>}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Pré-Requisitos</label>
						<input
							id="preRequisitos"
							{...register('preparationRequired')}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
						/>
						{errors.preparationRequired && <p className="text-red-500 text-xs mt-1">{errors.preparationRequired.message}</p>}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Duração</label>
							<input
								id="duracao"
								type="duracao"
								{...register('durationTime')}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{errors.durationTime && <p className="text-red-500 text-xs mt-1">{errors.durationTime.message}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Prazo de Entrega</label>
							<input
								id="prazoEntrega"
								type="prazoEntrega"
								{...register('deliveryDeadline')}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{errors.deliveryDeadline && <p className="text-red-500 text-xs mt-1">{errors.deliveryDeadline.message}</p>}
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Descrição</label>
						<input
							id="descricao"
							{...register('description')}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
						/>
						{errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
					</div>

				</div>

				<div className="grid grid-cols-2 gap-2">
					<Button
						type="button"
						variant={'outline'}
						className="w-full cursor-pointer"
						onClick={onCancel}
						disabled={loading}
					>
						Cancelar
					</Button>
					<Button
						disabled={loading || fetching}
						type="submit"
						className="w-full cursor-pointer"
					>
						{loading && (<Loader2Icon className="animate-spin" />)}
						{loading ? 'Salvando...' : 'Salvar'}
					</Button>
				</div>
			</div>
		</form>
	);
};