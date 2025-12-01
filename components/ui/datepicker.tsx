// components/ui/datepicker.tsx
'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { ptBR } from 'date-fns/locale';

interface DatePickerProps {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
	disabled?: ((date: Date) => boolean) | boolean;
	fromDate?: Date;
	toDate?: Date;
}

export function DatePicker({ value, onChange, disabled, fromDate, toDate }: DatePickerProps) {
	const [open, setOpen] = React.useState(false);

	const handleSelect = (selectedDate: Date | undefined) => {
		onChange?.(selectedDate);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					id="date"
					className="w-full justify-between font-normal" // ← mudou para w-full
				>
					{value ? value.toLocaleDateString('pt-BR') : 'Selecione uma data'}
					<ChevronDownIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-full p-0" // ← mudou para w-full e removeu align="start"
				align="start"
			>
				<Calendar
					mode="single"
					selected={value}
					captionLayout="dropdown"
					onSelect={handleSelect}
					locale={ptBR}
					disabled={disabled}
					fromDate={fromDate}
					toDate={toDate}
					className="w-full" // ← adiciona className w-full no Calendar
				/>
			</PopoverContent>
		</Popover>
	);
}