import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PrivateExamService } from '@/services/modules/privateExamService';
import { httpClient } from '@/services';
import { Loader2Icon } from 'lucide-react';

const schema = z.object({
	Name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
	Indication: z.string().min(10, 'Nome deve ter pelo menos 10 caracteres'),
	PreparationRequired: z.string().min(10, 'Pré-requisitos deve ter pelo menos 10 caracteres'),
	DurationTime: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
	DeliveryDeadline: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
	Description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
});

type FormData = z.infer<typeof schema>;

interface AdminFormProps {
	onCancel?: () => void;
	onSuccess?: () => void;
}

const service = new PrivateExamService(httpClient);

export const CreateForm: React.FC<AdminFormProps> = ({ onCancel, onSuccess }) => {
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: 'onChange',
	});

	const onSubmit = async (data: FormData) => {
		try {
			setLoading(true);

			await service.create(data);

			toast.success('Exame cadastrado com sucesso!');

			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao cadastrar exame!');
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
								{...register('Name')}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{errors.Name && <p className="text-red-500 text-xs mt-1">{errors.Name.message}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Indicação</label>
							<input
								id="indicacao"
								type="indicacao"
								{...register('Indication')}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{errors.Indication && <p className="text-red-500 text-xs mt-1">{errors.Indication.message}</p>}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Pré-Requisitos</label>
						<input
							id="preRequisitos"
							{...register('PreparationRequired')}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
						/>
						{errors.PreparationRequired && <p className="text-red-500 text-xs mt-1">{errors.PreparationRequired.message}</p>}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Duração</label>
							<input
								id="duracao"
								type="duracao"
								{...register('DurationTime')}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{errors.DurationTime && <p className="text-red-500 text-xs mt-1">{errors.DurationTime.message}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Prazo de Entrega</label>
							<input
								id="prazoEntrega"
								type="prazoEntrega"
								{...register('DeliveryDeadline')}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{errors.DeliveryDeadline && <p className="text-red-500 text-xs mt-1">{errors.DeliveryDeadline.message}</p>}
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Descrição</label>
						<input
							id="descricao"
							{...register('Description')}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
						/>
						{errors.Description && <p className="text-red-500 text-xs mt-1">{errors.Description.message}</p>}
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2">
					<Button
						type="button"
						variant={'outline'}
						className="w-full cursor-pointer"
						onClick={onCancel}
					>
						Cancelar
					</Button>
					<Button
						disabled={loading}
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