import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ConvenioService } from '@/services/modules/convenioService';
import { httpClient } from '@/services';
import { Loader2Icon } from 'lucide-react';

const schema = z.object({
	name: z.string().min(3, 'Campo Obrigatório'),
});

type EditFormData = z.infer<typeof schema>;

interface EditFormProps {
	id: string;
	onCancel?: () => void;
	onSuccess?: () => void;
}

const service = new ConvenioService(httpClient);

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
				const convenio = response.data.data;
				reset({
					name: convenio.name,
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
			toast.success('Convênio atualizado com sucesso!');
			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao atualizar convênio!');
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
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
							Nome
						</label>
						<input
							id="name"
							{...register('name')}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							disabled={fetching}
						/>
						{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
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