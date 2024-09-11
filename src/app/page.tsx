"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardProgressBar,
	CardTitle,
} from "@/components/ui/card";
import { FancyMultiSelect } from "@/components/ui/fancy-multi-select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BrowserTabs, TabTitleInput, useTabs } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConfirm } from "@omit/react-confirm-dialog";
import { useState } from "react";
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

const frameworksList = [
	{ value: "react", label: "React" },
	{ value: "angular", label: "Angular" },
	{ value: "vue", label: "Vue" },
	{ value: "svelte", label: "Svelte" },
	{ value: "ember", label: "Ember" },
];

type FormValues = z.infer<typeof validationSchema>;

export default function Home() {
	const tabs = useTabs({ maxItems: 5 });
	const confirm = useConfirm();
	const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([
		"react",
		"angular",
	]);

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
			<Card className="w-[50vw] overflow-hidden">
				<CardProgressBar totalStep={5} currentStep={1} />
				<CardHeader className="pt-0">
					<CardTitle>Identity</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							action=""
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col w-full"
						>
							<FormField
								control={form.control}
								name={"email"}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Select onValueChange={field.onChange} defaultValue={field.value}>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Theme" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="light">Light</SelectItem>
													<SelectItem value="dark">Dark</SelectItem>
													<SelectItem value="system">System</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage className="text-red-500 capitalize" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name={"email"}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<MultiSelect
												options={frameworksList}
												onValueChange={setSelectedFrameworks}
												defaultValue={selectedFrameworks}
												placeholder="Select frameworks"
												variant="inverted"
												animation={2}
												maxCount={3}
											/>
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
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="flex flex-row gap-2"
											>
												<FormItem className="flex items-center space-x-3 space-y-0 bg-[#EFF5FF] px-4 py-2 rounded-md h-10 border-[1px] border-input w-1/2">
													<FormControl>
														<RadioGroupItem value="all" />
													</FormControl>
													<FormLabel className="font-normal">All new messages</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0 bg-[#EFF5FF] px-4 py-2 rounded-md h-10 border-[1px] border-input w-1/2">
													<FormControl>
														<RadioGroupItem value="mentions" />
													</FormControl>
													<FormLabel className="font-normal">
														Direct messages and mentions
													</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormControl>
										<FormMessage className="text-red-500 capitalize" />
									</FormItem>
								)}
							/>

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
								<FormField
									control={form.control}
									name={`products.${Number(tabs.activeTabId.split("-")[1])}.name`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Product Name</FormLabel>
											<FormControl>
												<TabTitleInput
													{...field}
													title={tabs.tabTitle}
													setValue={tabs.setTabTitle}
												/>
											</FormControl>
											<FormMessage className="text-red-500 capitalize" />
										</FormItem>
									)}
								/>

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
				</CardContent>
			</Card>
		</main>
	);
}
