// components/ui/autocomplete.tsx
import { cn } from '@/lib/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';

export type AutoCompleteItem<T extends string> = {
	value: T;
	label: string;
};

type Props<T extends string> = {
	selectedValue: T | undefined; // Agora aceita undefined
	onSelectedValueChange: (value: T | undefined) => void; // Também aceita undefined
	searchValue: string;
	onSearchValueChange: (value: string) => void;
	items: AutoCompleteItem<T>[];
	isLoading?: boolean;
	emptyMessage?: string;
	placeholder?: string;
};

export function AutoComplete<T extends string>({
	selectedValue,
	onSelectedValueChange,
	searchValue,
	onSearchValueChange,
	items,
	isLoading,
	emptyMessage = 'No items.',
	placeholder = 'Search...',
}: Props<T>) {
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [isInitialMount, setIsInitialMount] = useState(true);

	// Controla o comportamento inicial
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsInitialMount(false);
		}, 100);
		return () => clearTimeout(timer);
	}, []);

	const labels = useMemo(
		() =>
			items.reduce((acc, item) => {
				acc[item.value] = item.label;
				return acc;
			}, {} as Record<string, string>),
		[items]
	);

	const reset = () => {
		onSelectedValueChange(undefined);
		onSearchValueChange('');
	};

	const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		// Só fecha o popover no blur
		setTimeout(() => {
			setOpen(false);
		}, 150);
	};

	const onSelectItem = (inputValue: string) => {
		if (inputValue === selectedValue) {
			reset();
		} else {
			onSelectedValueChange(inputValue as T);
			onSearchValueChange(labels[inputValue] ?? '');
		}
		setOpen(false);
	};

	const handleInputFocus = () => {
		if (!isInitialMount || !searchValue) {
			setOpen(true);
		}
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			setOpen(false);
			inputRef.current?.blur();
		} else if (e.key === 'ArrowDown' && !open) {
			setOpen(true);
			e.preventDefault();
		}
	};

	const handleSearchChange = (value: string) => {
		onSearchValueChange(value);
		if (value && !open) {
			setOpen(true);
		} else if (!value) {
			setOpen(false);
		}
	};

	const handleInputClick = () => {
		if (!open) {
			setOpen(true);
		}
	};

	return (
		<div className="flex items-center w-full">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverAnchor asChild>
					<Input
						ref={inputRef}
						value={searchValue}
						onChange={(e) => handleSearchChange(e.target.value)}
						onKeyDown={handleInputKeyDown}
						onFocus={handleInputFocus}
						onBlur={onInputBlur}
						onClick={handleInputClick}
						placeholder={placeholder}
						autoFocus={false}
						className="w-full"
					/>
				</PopoverAnchor>

				<PopoverContent
					onOpenAutoFocus={(e) => e.preventDefault()}
					onCloseAutoFocus={(e) => e.preventDefault()}
					className="p-0 w-full min-w-[var(--radix-popover-trigger-width)]"
					align="start"
					sideOffset={4}
				>
					<Command shouldFilter={false} className="w-full">
						<CommandList className="w-full">
							{isLoading && (
								<CommandPrimitive.Loading>
									<div className="p-2">
										<Skeleton className="h-4 w-full" />
									</div>
								</CommandPrimitive.Loading>
							)}
							{items.length > 0 && !isLoading ? (
								<CommandGroup className="w-full">
									{items.map((option) => (
										<CommandItem
											key={option.value}
											value={option.value}
											onMouseDown={(e) => e.preventDefault()}
											onSelect={onSelectItem}
											className="px-3 py-2 text-sm cursor-pointer flex items-center gap-2 w-full"
										>
											<Check
												className={cn(
													'h-4 w-4 shrink-0',
													selectedValue === option.value ?
														'opacity-100' :
														'opacity-0'
												)}
											/>
											<span className="flex-1 truncate">{option.label}</span>
										</CommandItem>
									))}
								</CommandGroup>
							) : null}
							{!isLoading && items.length === 0 && searchValue && (
								<CommandEmpty className="py-3 px-3 text-sm text-center text-muted-foreground">
									{emptyMessage}
								</CommandEmpty>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}