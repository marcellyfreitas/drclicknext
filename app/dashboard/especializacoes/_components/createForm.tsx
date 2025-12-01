import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { httpClient } from '@/services';
import { Input } from '@/components/ui/input';
import { Loader2Icon } from 'lucide-react';
import { EspecializacoesService } from '@/services/modules/especializacoesService';

const schema = z.object({
	name: z.string().min(1, 'Campo obrigatório'),
	description: z.string().min(1, 'Campo obrigatório'),
});

type FormData = z.infer<typeof schema>;

interface FormPropsType {
	onCancel?: () => void;
	onSuccess?: () => void;
}

const service = new EspecializacoesService(httpClient);

export const CreateForm: React.FC<FormPropsType> = ({ onCancel, onSuccess }) => {
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

			toast.success('Registrado com sucesso!');

			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao cadastrar!');
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
					<Input
						id="name"
						{...register('name')}
					/>
					{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">Descrição</label>
					<Input
						id="description"
						{...register('description')}
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
		</form>
	);
};