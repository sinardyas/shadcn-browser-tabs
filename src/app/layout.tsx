"use client";

import { Inter } from "next/font/google";
import "./globals.css";

import { ConfirmDialogProvider } from "@omit/react-confirm-dialog";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ConfirmDialogProvider>
			<html lang="en">
				<body className={inter.className}>{children}</body>
			</html>
		</ConfirmDialogProvider>
	);
}
