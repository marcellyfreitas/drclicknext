import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AdministratorService } from '@/services/modules/administratorService';
import { httpClient } from '@/services';
import { Loader2Icon } from 'lucide-react';

const schema = z.object({
	name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
	email: z.string().email('Email inválido'),
	password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'As senhas não conferem',
	path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

interface AdminFormProps {
	onCancel?: () => void;
	onSuccess?: () => void;
}

const service = new AdministratorService(httpClient);

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

			toast.success('Administrador cadastrado com sucesso!');

			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao cadastrar administrador!');
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
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Nome</label>
						<input
							id="name"
							{...register('name')}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
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
						/>
						{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Senha</label>
							<input
								id="password"
								type="password"
								autoComplete="new-password"
								{...register('password')}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Confirma Senha</label>
							<input
								id="confirmPassword"
								type="password"
								autoComplete="new-password"
								{...register('confirmPassword')}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
						</div>
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