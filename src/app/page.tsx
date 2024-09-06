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
	const { ...tabs } = useTabs();

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
					>
						<TabTitleInput title={tabs.tabTitle} setValue={tabs.setTabTitle} />

						{/* <FormField
              control={form.control}
              name={`products.${Number(tabs.activeTabId.split('-')[1])}.file`}
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
              name={`products.${Number(tabs.activeTabId.split('-')[1])}.name`}
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
              name={`products.${Number(tabs.activeTabId.split('-')[1])}.description`}
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
              name={`products.${Number(tabs.activeTabId.split('-')[1])}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 capitalize" />
                </FormItem>
              )}
            /> */}
					</BrowserTabs>

					<Button type="submit" className="!mt-10 w-full">
						Submit
					</Button>
				</form>
			</Form>
		</main>
	);
}
