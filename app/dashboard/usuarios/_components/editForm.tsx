import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserService } from '@/services/modules/userService';
import { httpClient } from '@/services';
import { Loader2Icon } from 'lucide-react';

const schema = z.object({
	name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
	email: z.string().email('Email inválido'),
});

type EditFormData = z.infer<typeof schema>;

interface EditFormProps {
	id: string;
	onCancel?: () => void;
	onSuccess?: () => void;
}

const service = new UserService(httpClient);

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
		const fetchUser = async () => {
			try {
				setFetching(true);
				const response = await service.getById(id);
				const user = response.data.data;
				reset({
					name: user.name,
					email: user.email,
				});
			} catch (error) {
				console.error(error);
				toast.error('Erro ao buscar usuário!');
			} finally {
				setFetching(false);
			}
		};
		if (id) fetchUser();
	}, [id, reset]);

	const onSubmit = async (data: EditFormData) => {
		try {
			setLoading(true);
			await service.update(id, data);
			toast.success('Usuário atualizado com sucesso!');
			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao atualizar usuário!');
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
				<div className="grid-gap-4 p-4 border border-slate-100 rounded-lg">
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
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
						<input
							id="email"
							type="email"
							{...register('email')}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							disabled={fetching}
						/>
						{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
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