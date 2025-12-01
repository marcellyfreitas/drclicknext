import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MedicalService } from '@/services/modules/medicalService';
import { httpClient } from '@/services';
import { Loader2Icon } from 'lucide-react';

const schema = z.object({
	name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
	email: z.string().email('Email inválido'),
	cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
	crm: z.string().min(1, 'CRM é obrigatório'),
	specializationId: z.string().min(1, 'Especialização é obrigatória'),
});

type FormData = z.infer<typeof schema>;

interface MedicalFormProps {
	onCancel?: () => void;
	onSuccess?: () => void;
}

const service = new MedicalService(httpClient);

export const CreateForm: React.FC<MedicalFormProps> = ({ onCancel, onSuccess }) => {
	const [loading, setLoading] = useState(false);
	const [specializations, setSpecializations] = useState<any[]>([]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: 'onChange',
	});

	useEffect(() => {
		// Buscar especializações do backend
		const fetchSpecializations = async () => {
			try {
				// Ajuste a URL conforme sua API de especializações
				const response = await httpClient.get('/private/especializacoes');
				setSpecializations(response.data.data);
			} catch (error) {
				console.error(error);
				toast.error('Erro ao buscar especializações!');
			}
		};
		fetchSpecializations();
	}, []);

	const onSubmit = async (data: FormData) => {
		try {
			setLoading(true);

			await service.create(data);

			toast.success('Médico cadastrado com sucesso!');

			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao cadastrar médico!');
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
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cpf">CPF</label>
							<input
								id="cpf"
								{...register('cpf')}
								placeholder="00000000000"
								maxLength={11}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="crm">CRM</label>
							<input
								id="crm"
								{...register('crm')}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{errors.crm && <p className="text-red-500 text-xs mt-1">{errors.crm.message}</p>}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="specializationId">Especialização</label>
						<select
							id="specializationId"
							{...register('specializationId')}
							className="w-full px-3 py-2 border rounded-lg bg-[#0f0f1a] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
						>
							<option value="">Selecione uma especialização</option>
							{specializations.map((spec) => (
								<option key={spec.id} value={spec.id}>
									{spec.name}
								</option>
							))}
						</select>
						{errors.specializationId && <p className="text-red-500 text-xs mt-1">{errors.specializationId.message}</p>}
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