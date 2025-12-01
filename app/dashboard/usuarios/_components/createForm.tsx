import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserService } from '@/services/modules/userService';
import { httpClient } from '@/services';
import { validateCpf } from '@/utils/functions';
import { Input } from '@/components/ui/input';
import { Loader2Icon } from 'lucide-react';
import { PasswordInput } from '../../../../components/ui/password';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;

const schema = z.object({
	name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
	email: z.string().email('Email inválido'),
	cpf: z.string()
		.refine((cpf) => cpfRegex.test(cpf), { message: 'CPF deve estar no formato 000.000.000-00 ou 11 dígitos' })
		.refine(validateCpf, { message: 'CPF inválido' }),
	password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'As senhas não conferem',
	path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

interface UserFormProps {
	onCancel?: () => void;
	onSuccess?: () => void;
}

const service = new UserService(httpClient);

function maskCpf(value: string) {
	return value
		.replace(/\D/g, '')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
		.slice(0, 14);
}

export const CreateForm: React.FC<UserFormProps> = ({ onCancel, onSuccess }) => {
	const [loading, setLoading] = useState(false);
	const [cpf, setCpf] = useState('');
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

			data.cpf = data.cpf.replace(/\D/g, '');

			await service.create(data);

			toast.success('Usuário cadastrado com sucesso!');

			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao cadastrar usuário!');
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
						<Input
							id="name"
							{...register('name')}
						/>
						{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
						<Input
							id="email"
							type="email"
							{...register('email')}
						/>
						{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cpf">CPF</label>
						<Input
							{...register('cpf')}
							value={cpf}
							onChange={e => setCpf(maskCpf(e.target.value))}
						/>
						{errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>}
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Senha</label>
							<PasswordInput
								id="password"
								type="password"
								autoComplete="new-password"
								{...register('password')}
							/>
							{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Confirma Senha</label>
							<PasswordInput
								id="confirmPassword"
								type="password"
								autoComplete="new-password"
								{...register('confirmPassword')}
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