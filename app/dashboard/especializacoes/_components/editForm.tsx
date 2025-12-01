import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { httpClient } from '@/services';
import { Loader2Icon } from 'lucide-react';
import { EspecializacoesService } from '@/services/modules/especializacoesService';

const schema = z.object({
	name: z.string().min(1, 'Campo obrigatório'),
	description: z.string().min(1, 'Campo obrigatório'),
});

type EditFormType = z.infer<typeof schema>;

interface EditFormProps {
	id: string;
	onCancel?: () => void;
	onSuccess?: () => void;
}

const service = new EspecializacoesService(httpClient);

export const EditForm: React.FC<EditFormProps> = ({ id, onCancel, onSuccess }) => {
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<EditFormType>({
		resolver: zodResolver(schema),
		mode: 'onChange',
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setFetching(true);
				const response = await service.getById(id);
				const model = response.data.data;
				reset({
					name: model.name,
					description: model.description,
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

	const onSubmit = async (data: EditFormType) => {
		try {
			setLoading(true);
			await service.update(id, data);
			toast.success('Registro atualizado com sucesso!');
			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao atualizar!');
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
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Nome</label>
					<input
						id="name"
						{...register('name')}
						className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
						disabled={fetching}
					/>
					{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Descrição</label>
					<input
						id="description"
						{...register('description')}
						className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
						disabled={fetching}
					/>
					{errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
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