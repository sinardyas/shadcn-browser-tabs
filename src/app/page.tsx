"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BrowserTabs, TabTitleInput, useTabs } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConfirm } from "@omit/react-confirm-dialog";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const validationSchema = z.object({
	name: z.string(),
	email: z.string(),
	products: z
		.array(
			z.object({
				file: z.any(),
				name: z.string().min(1, { message: "Product Name is required" }),
				description: z.string().min(1, {
					message: "Product Description is required",
				}),
				price: z.coerce.number(),
			}),
		)
		.nonempty({ message: "Product is required" }),
});

type FormValues = z.infer<typeof validationSchema>;

export default function Home() {
	const tabs = useTabs();
	const confirm = useConfirm();

	const form = useForm<FormValues>({
		resolver: zodResolver(validationSchema),
		mode: "onBlur",
		defaultValues: {
			name: "",
			email: "",
			products: [
				{
					file: "New Tab",
					name: "",
					description: "",
					price: 0,
				},
			],
		},
	});

	const browserTabControl = useFieldArray({
		name: "products",
		control: form.control,
	});

	const onSubmit = (values: FormValues) => {
		console.log("submitted value ::", values);
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<Form {...form}>
				<form
					action=""
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col w-1/2"
				>
					<FormField
						control={form.control}
						name={"email"}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage className="text-red-500 capitalize" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name={"name"}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage className="text-red-500 capitalize" />
							</FormItem>
						)}
					/>

					<Separator className="my-10" />

					<BrowserTabs
						{...tabs}
						addNewTab={() => {
							tabs.addNewTab();
							browserTabControl.append({
								file: "New Tab",
								name: "",
								description: "",
								price: 0,
							});
						}}
						removeTab={async (id: string) => {
							const result = await confirm({
								title: "Do you want to delete the tab?",
								description:
									"If you delete the tab, you will lost the entire datas under the tab. ",
								alertDialogContent: {
									className: "w-[870px] max-w-none",
								},
								alertDialogHeader: {
									className: "!text-center",
								},
								alertDialogDescription: {
									className: "text-black text-sm",
								},
								alertDialogFooter: {
									className: "!justify-center gap-10",
								},
								confirmText: "Yes",
								cancelText: "No",
								confirmButton: {
									className: "bg-[#0066FF] w-[140px]",
								},
								cancelButton: {
									className:
										"bg-[#F6F6F6] w-[140px] border-none text-[#0066FF] px-6 py-3",
								},
							});

							if (!result) return;

							tabs.removeTab(id);
						}}
					>
						<TabTitleInput title={tabs.tabTitle} setValue={tabs.setTabTitle} />

						<FormField
							control={form.control}
							name={`products.${Number(tabs.activeTabId.split("-")[1])}.file`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product File</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage className="text-red-500 capitalize" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name={`products.${Number(tabs.activeTabId.split("-")[1])}.name`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage className="text-red-500 capitalize" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name={`products.${Number(tabs.activeTabId.split("-")[1])}.description`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product Desc</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage className="text-red-500 capitalize" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name={`products.${Number(tabs.activeTabId.split("-")[1])}.price`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product Price</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage className="text-red-500 capitalize" />
								</FormItem>
							)}
						/>
					</BrowserTabs>

					<Button type="submit" className="!mt-10 w-full">
						Submit
					</Button>
				</form>
			</Form>
		</main>
	);
}
