import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ConvenioService } from '@/services/modules/convenioService';
import { httpClient } from '@/services';
import { Input } from '@/components/ui/input';
import { Loader2Icon } from 'lucide-react';

const schema = z.object({
	name: z.string().trim().min(3, 'Campo Obrigatório'),
});
type FormData = z.infer<typeof schema>;

interface UserFormProps {
	onCancel?: () => void;
	onSuccess?: () => void;
}

const service = new ConvenioService(httpClient);

export const CreateForm: React.FC<UserFormProps> = ({ onCancel, onSuccess }) => {
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
					<label
						className="block text-sm font-medium text-gray-700 mb-1"
						htmlFor="name"
					>
						Nome
					</label>
					<Input id="name" {...register('name')} />
					{errors.name && (
						<p className="text-red-500 text-xs mt-1">
							{errors.name.message}
						</p>
					)}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-2">
				<Button
					type="button"
					variant="outline"
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
					{loading && <Loader2Icon className="animate-spin mr-2" />}
					{loading ? 'Salvando...' : 'Salvar'}
				</Button>
			</div>
		</form>
	);
};
