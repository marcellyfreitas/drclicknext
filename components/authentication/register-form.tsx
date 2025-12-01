'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { validateCpf } from '@/utils/functions';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;

const schema = z.object({
	name: z.string().min(1, 'Campo obrigatório'),
	email: z.string().email('Email inválido'),
	cpf: z.string()
		.refine((cpf) => cpfRegex.test(cpf), { message: 'CPF deve estar no formato 000.000.000-00 ou 11 dígitos' })
		.refine(validateCpf, { message: 'CPF inválido' }),
	password: z.string().min(3, 'Senha deve ter pelo menos 3 caracteres'),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'As senhas não conferem',
	path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;
type UserLoginFormProps = React.ComponentProps<'form'> & {
	routeName: string
	redirectTo: string
};

function maskCpf(value: string) {
	return value
		.replace(/\D/g, '')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
		.slice(0, 14);
}

export function RegisterForm({
	className,
	routeName,
	redirectTo,
	...props
}: UserLoginFormProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [cpf, setCpf] = useState('');

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: 'onChange',
	});

	useEffect(() => {
		reset({
			name: 'Usuário Externo',
			email: 'usuarioexterno@email.com',
			cpf: maskCpf('84112342900'),
			password: 'senha',
			confirmPassword: 'senha',
		});
	}, [reset]);

	const onSubmit = async (data: FormData) => {
		setLoading(true);

		const payload = { ...data };

		payload.cpf = data.cpf.replace(/\D/g, '');

		try {
			await axios.post(routeName, payload);
			router.push(redirectTo);
			toast.success('Usuário cadastrado com sucesso!');
		} catch (error: any) {
			console.error(error);
			const message = error?.response?.data?.message ?? 'Tente novamente mais tarde.';
			toast.error(`Erro ao cadastrar! ${message}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			autoComplete="off"
			className={cn('flex flex-col gap-6', className)}
			{...props}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Precisa de uma conta?</h1>
				<p className="text-muted-foreground text-sm text-balance">
					Entre com seus dados abaixo para continuar.
				</p>
			</div>
			<div className="grid gap-2">
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

			<Button
				disabled={loading}
				type="submit"
				className="w-full cursor-pointer"
			>
				{loading && (<Loader2Icon className="animate-spin" />)}
				{loading ? 'Salvando...' : 'Salvar'}
			</Button>
		</form>
	);
}
