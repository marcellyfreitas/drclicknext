import { GalleryVerticalEnd } from 'lucide-react';
import { LoginForm } from '@/components/authentication/login-form';
import Link from 'next/link';

export default function LoginPage() {
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
						<LoginForm
							routeName="/api/authentication/user/login"
							redirectTo="/usuario"
							registerPath="/authentication/user/register"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
