'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CancelDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
}

export function CancelDialog({
	open,
	onOpenChange,
	onConfirm,
	title = 'Confirmar cancelamento',
	description = 'Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.',
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
}: CancelDialogProps) {
	const handleConfirm = () => {
		onConfirm();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{description}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<div className="w-full grid grid-cols-2 gap-4">
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							type="button"
						>
							{cancelText}
						</Button>
						<Button
							variant="destructive"
							onClick={handleConfirm}
							type="button"
						>
							{confirmText}
						</Button>
					</div>

				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}