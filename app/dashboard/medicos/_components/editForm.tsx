import React, { useEffect, useState } from 'react';
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
	crm: z.string().min(1, 'CRM é obrigatório'),
	specializationId: z.string().min(1, 'Especialização é obrigatória'),
});

type EditFormData = z.infer<typeof schema>;

interface EditFormProps {
	id: string;
	onCancel?: () => void;
	onSuccess?: () => void;
}

const service = new MedicalService(httpClient);

export const EditForm: React.FC<EditFormProps> = ({ id, onCancel, onSuccess }) => {
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [specializations, setSpecializations] = useState<any[]>([]);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<EditFormData>({
		resolver: zodResolver(schema),
		mode: 'onChange',
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setFetching(true);

				// Buscar especializações
				const specResponse = await httpClient.get('/private/especializacoes');
				setSpecializations(specResponse.data.data);

				// Buscar dados do médico
				const response = await service.getById(id);
				const medical = response.data.data;

				setValue('name', medical.name);
				setValue('email', medical.email);
				setValue('crm', medical.crm);
				setValue('specializationId', medical.specializationId);
			} catch (error) {
				console.error(error);
				toast.error('Erro ao buscar dados!');
			} finally {
				setFetching(false);
			}
		};

		if (id) {
			fetchData();
		}
	}, [id, setValue]);

	const onSubmit = async (data: EditFormData) => {
		try {
			setLoading(true);
			await service.update(id, data);
			toast.success('Médico atualizado com sucesso!');
			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao atualizar médico!');
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

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="crm">CRM</label>
						<input
							id="crm"
							{...register('crm')}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
							disabled={fetching}
						/>
						{errors.crm && <p className="text-red-500 text-xs mt-1">{errors.crm.message}</p>}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="specializationId">Especialização</label>
						<select
							id="specializationId"
							{...register('specializationId')}
							className="w-full px-3 py-2 border rounded-lg bg-[#0f0f1a] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
							disabled={fetching}
						>
							<option value="">Selecione uma especialização</option>
							{specializations.map((spec) => (
								<option key={spec.id} value={spec.id} className="bg-[#0f0f1a] text-white">
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