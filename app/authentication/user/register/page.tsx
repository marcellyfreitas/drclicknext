import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';
import { RegisterForm } from '@/components/authentication/register-form';

export default function RegisterPage() {
	return (
		<div className="grid min-h-svh">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link href="/" className="flex items-center gap-2 font-medium">
						<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
							<GalleryVerticalEnd className="size-4" />
						</div>
						DR. CLICK.
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<RegisterForm
							routeName="/api/authentication/user/register"
							redirectTo="/usuario"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
