
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { AutoComplete, AutoCompleteItem } from '@/components/ui/autocomplete';
import { DatePicker } from '@/components/ui/datepicker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { AgendamentosService } from '@/services/modules/agendamentosService';
import { httpClient } from '@/services';
import { HorariosService } from '@/services/modules/horariosService';
import { MedicosService } from '@/services/modules/medicosService';
import { Textarea } from '@/components/ui/textarea';
import { useUserAuthentication } from '@/contexts/user-authentication-context';

interface CreateFormPropsType {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedId?: string;
	onSuccess?: () => void;
}

type ItemType = string;

const agendamentoSchema = z.object({
	medico: z.string().min(1, 'Selecione um médico'),
	data: z.date({ message: 'Selecione uma data válida' }),
	horario: z.string().min(1, 'Selecione um horário'),
	description: z.string().optional(),
});

type FormData = z.infer<typeof agendamentoSchema>;

interface AvailableDate {
	date: Date;
	availableHours: string[];
}

const service = new AgendamentosService(httpClient, '/public/agendamentos');
const horariosService = new HorariosService(httpClient, '/public/horarios');
const medicosService = new MedicosService(httpClient, '/public/medicos');

export function FormDialog({ open, onOpenChange, selectedId, onSuccess }: CreateFormPropsType) {
	const [medicoSearch, setMedicoSearch] = useState('');
	const [medicoItems, setMedicoItems] = useState<AutoCompleteItem<ItemType>[]>([]);
	const [medicoLoading, setMedicoLoading] = useState(false);
	const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
	const [loadingDates, setLoadingDates] = useState(false);
	const [scheduleMap, setScheduleMap] = useState<Record<string, string>>({});

	const { user } = useUserAuthentication();

	const {
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
		reset,
		trigger,
	} = useForm<FormData>({
		resolver: zodResolver(agendamentoSchema),
		mode: 'onChange',
		defaultValues: {
			medico: '',
			horario: '',
			description: '',
		},
	});

	const watchedMedico = watch('medico');
	const watchedData = watch('data');
	const watchedHorario = watch('horario');

	useEffect(() => {
		if (!open) {
			resetForm();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	useEffect(() => {
		if (watchedMedico) {
			fetchAvailableDates();
		} else {
			setAvailableDates([]);
			setValue('data', undefined as any);
			setValue('horario', '');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watchedMedico]);

	const resetForm = () => {
		reset({
			medico: '',
			data: undefined,
			horario: '',
		});
		setMedicoSearch('');
		setMedicoItems([]);
		setAvailableDates([]);
	};

	async function fetchMedicos(query: string): Promise<AutoCompleteItem<ItemType>[]> {
		const response = await medicosService.getAll({ name: query });

		const collection = response.data.data.items;

		return collection.map((item: any) => ({ value: item.id, label: item.name }));
	}

	async function fetchAvailableDates() {
		setLoadingDates(true);
		try {
			if (!watchedMedico) return;

			const response = await horariosService.getAll({
				medicalId: watchedMedico,
				page: 1,
				pageSize: 1000,
			});

			const items = response.data.data.items;
			const grouped: Record<string, string[]> = {};
			const map: Record<string, string> = {};

			items.forEach((schedule: any) => {
				const dateObj = new Date(schedule.initialHour);
				const dateStr = dateObj.toISOString().split('T')[0];
				const hourStr = dateObj.toLocaleTimeString('pt-BR', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: false,
				});

				if (!grouped[dateStr]) grouped[dateStr] = [];
				grouped[dateStr].push(hourStr);

				map[`${dateStr}_${hourStr}`] = schedule.id;
			});

			const available: AvailableDate[] = Object.entries(grouped)
				.map(([date, availableHours]) => ({
					date: new Date(date),
					availableHours,
				}))
				.filter(a => {
					const today = new Date();
					const isFuture = a.date > today;
					const day = a.date.getDay();
					const isWeekday = day !== 0 && day !== 6;
					return isFuture && isWeekday;
				})
				.sort((a, b) => a.date.getTime() - b.date.getTime());

			setAvailableDates(available);
			setScheduleMap(map);
		} catch (error) {
			console.error('Erro ao buscar datas:', error);
		} finally {
			setLoadingDates(false);
		}
	}

	const isDateAvailable = (date: Date) => {
		const isAvailable = availableDates.some(available =>
			available.date.toDateString() === date.toDateString()
		);
		return isAvailable;
	};

	const getAvailableHours = () => {
		if (!watchedData) return [];
		const availableDate = availableDates.find(date =>
			date.date.toDateString() === watchedData.toDateString()
		);
		return availableDate ? availableDate.availableHours : [];
	};

	const onSubmit = async (data: FormData) => {
		try {
			if (!watchedData || !watchedHorario) return;

			const dateStr = watchedData.toISOString().split('T')[0];
			const scheduleId = scheduleMap[`${dateStr}_${watchedHorario}`];

			await service.create({
				userId: user.id,
				scheduleId,
				status: 'Agendado',
				description: data.description || '',
			});

			toast.success(selectedId ? 'Agendamento atualizado com sucesso!' : 'Agendamento criado com sucesso!');
			if (onSuccess) onSuccess();
			onOpenChange(false);
			resetForm();
		} catch (error) {
			console.error(error);
			toast.error('Erro ao salvar agendamento!');
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{selectedId ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
					<DialogDescription>
						Selecione o médico, usuário, data e horário para o agendamento.
					</DialogDescription>
				</DialogHeader>

				<form id="agendamento-form" onSubmit={handleSubmit(onSubmit)}>
					<div className="grid gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Médico *</label>
							<AutoComplete<ItemType>
								selectedValue={watchedMedico}
								onSelectedValueChange={async (value) => {
									setValue('medico', value || '');
									await trigger('medico');
								}}
								searchValue={medicoSearch}
								onSearchValueChange={async (value) => {
									setMedicoSearch(value);
									if (!value) {
										setMedicoItems([]);
										return;
									}
									setMedicoLoading(true);
									const results = await fetchMedicos(value);
									setMedicoItems(results);
									setMedicoLoading(false);
								}}
								items={medicoItems}
								isLoading={medicoLoading}
								placeholder="Buscar médicos..."
								emptyMessage="Nenhum médico encontrado"
							/>
							{errors.medico && (
								<p className="text-red-500 text-xs mt-1">{errors.medico.message}</p>
							)}
						</div>

						{watchedMedico && (
							<div className="space-y-2">
								<label className="text-sm font-medium">Data do Agendamento *</label>
								{loadingDates ? (
									<div className="flex justify-center py-4">
										<Loader2Icon className="animate-spin h-6 w-6" />
									</div>
								) : (
									<DatePicker
										value={watchedData}
										onChange={(date) => setValue('data', date as Date)}
										disabled={(date) => !isDateAvailable(date)}
										fromDate={new Date()}
									/>
								)}
								{errors.data && (
									<p className="text-red-500 text-xs mt-1">{errors.data.message}</p>
								)}
							</div>
						)}

						{watchedData && (
							<div className="space-y-2">
								<label className="text-sm font-medium">Horário *</label>
								<div className="grid grid-cols-3 gap-2">
									{getAvailableHours().map((hour) => (
										<Button
											key={hour}
											type="button"
											variant={watchedHorario === hour ? 'default' : 'outline'}
											onClick={() => setValue('horario', hour)}
											className="h-10"
										>
											{hour}
										</Button>
									))}
								</div>
								{errors.horario && (
									<p className="text-red-500 text-xs mt-1">{errors.horario.message}</p>
								)}
							</div>
						)}

						<div className="space-y-2">
							<label className="text-sm font-medium">Descrição</label>
							<Textarea
								value={watch('description')}
								onChange={(e) => setValue('description', e.target.value)}
								placeholder="Digite uma descrição (opcional)"
							/>
						</div>
					</div>
				</form>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						form="agendamento-form"
						disabled={isSubmitting}
						className="min-w-20"
					>
						{isSubmitting && <Loader2Icon className="animate-spin h-4 w-4 mr-2" />}
						{isSubmitting ? 'Salvando...' : 'Salvar'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}