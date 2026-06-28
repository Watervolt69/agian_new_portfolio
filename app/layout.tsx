import type { Metadata } from "next";
import '@fontsource-variable/plus-jakarta-sans';
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/NavBar";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
	title: "Portfolio",
	description: "Aryan a full stack ai developer and a software engineer",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn("h-full antialiased selection:bg-black selection:text-white", "font-sans", geist.variable)}
		>
			<body className="min-h-full flex flex-col font-sans bg-[#F7F7F7] text-black">
				<Navbar />
				{children}
			</body>
		</html>
	);
}

