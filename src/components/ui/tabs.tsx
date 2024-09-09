"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import {
	ChevronLeft,
	ChevronRight,
	PlusCircleIcon,
	TrashIcon,
} from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<React.Fragment>
		<TabsPrimitive.List
			ref={ref}
			className={cn(
				"inline-flex h-10 items-center text-muted-foreground bg-transparent overflow-x-scroll scroll-smooth overflow-y-hidden w-[70%]",
				className,
			)}
			{...props}
		/>
	</React.Fragment>
));
TabsList.displayName = TabsPrimitive.List.displayName;

type CustomTabTrigger = TabsPrimitive.TabsTriggerProps & {
	id: string;
	totalItems: number;
	onRemoveTab: (id: string) => void;
	isTabIntersectWithRootEl: boolean;
};

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	CustomTabTrigger
>(
	(
		{
			id,
			children,
			className,
			totalItems,
			onRemoveTab,
			isTabIntersectWithRootEl = false,
			...props
		},
		ref,
	) => {
		const isFirstElement = useMemo(() => Number(id) === 0, [id]);
		const isLastElement = useMemo(
			() => totalItems - 1 === Number(id),
			[totalItems, id],
		);
		const isRemoveable = totalItems > 1;
		return (
			<TabsPrimitive.Trigger
				ref={ref}
				className={cn(
					"bg-zinc-100 inline-flex items-center justify-center gap-2 whitespace-nowrap h-full px-3 py-1.5 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-[#0066FF] data-[state=active]:shadow-sm border border-[#EAEAEA]",
					!isTabIntersectWithRootEl && isFirstElement && "rounded-tl-md",
					!isTabIntersectWithRootEl && isLastElement && "rounded-tr-md",
					className,
				)}
				{...props}
			>
				<div className="w-[16px]" />
				{children}
				{/* Rule: disable if tabs contain just one item */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div onClick={totalItems === 1 ? undefined : () => onRemoveTab(id)} className="cursor-default">
					<TrashIcon size={16} color={isRemoveable ? "#696969" : "#B2B2B2"} />
				</div>
			</TabsPrimitive.Trigger>
		);
	},
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			className,
		)}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

interface TabsNavigationProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.TabsList> {
	totalItems: number;
	addTabTitle?: string;
	onAddNewTab?: () => void;
	isMaxItemReached: boolean;
	isTabIntersectWithRootEl: boolean;
}

const Nav = ({ direction = "left" }) => (
	<div
		className={cn(
			"bg-zinc-100 h-10 px-3 py-1.5 inline-flex items-center justify-center whitespace-nowrap p1 text-sm font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm border border-[#EAEAEA]",
			direction === "left" ? "rounded-tl-md" : "rounded-tr-md",
		)}
	>
		{direction === "left" ? (
			<ChevronLeft size={16} className="text-[#0066FF]" />
		) : (
			<ChevronRight size={16} className="text-[#0066FF]" />
		)}
	</div>
);

const TabsNavigation = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.TabsList>,
	TabsNavigationProps
>(
	(
		{
			children,
			addTabTitle = "Add new tab",
			onAddNewTab,
			isMaxItemReached,
			isTabIntersectWithRootEl,
		},
		ref,
	) => {
		if (isTabIntersectWithRootEl) {
			return (
				<div className="inline-flex items-center w-full justify-between">
					<Nav />
					{children}
					<Nav direction="right" />
					<Button
						onClick={onAddNewTab}
						size="sm"
						className="bg-[#0066FF] ml-2"
						disabled={isMaxItemReached}
					>
						<PlusCircleIcon size={16} />
						{addTabTitle}
					</Button>
				</div>
			);
		}

		return (
			<div className="inline-flex items-center w-full justify-between">
				{children}
				<Button
					size={"sm"}
					onClick={onAddNewTab}
					className="bg-[#0066FF] float-right"
					disabled={isMaxItemReached}
				>
					<PlusCircleIcon size={16} />
					{addTabTitle}
				</Button>
			</div>
		);
	},
);

interface Tab {
	title: string;
}

interface TabsAction {
	tabs: Array<Tab>;
	tabTitle: string;
	totalItems: number;
	activeTabId: string;
	addNewTab: () => void;
	isMaxItemReached: boolean;
	removeTab: (id: string) => void;
	isTabIntersectWithRootEl: boolean;
	setTabTitle: React.Dispatch<React.SetStateAction<string>>;
	setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
	tabListRootRef: React.MutableRefObject<HTMLDivElement | null>;
	activeTabRef: React.MutableRefObject<HTMLButtonElement | null>;
}

type BrowserTabsProps = TabsPrimitive.TabsProps & TabsAction;

const BrowserTabs = React.forwardRef<
	React.ElementRef<typeof Tabs>,
	BrowserTabsProps
>(
	(
		{
			tabs,
			children,
			removeTab,
			addNewTab,
			totalItems,
			activeTabId,
			activeTabRef,
			tabListRootRef,
			setActiveTabId,
			isMaxItemReached,
			isTabIntersectWithRootEl,
		},
		ref,
	) => {
		return (
			<Tabs value={activeTabId} onValueChange={setActiveTabId}>
				<TabsNavigation
					onAddNewTab={addNewTab}
					totalItems={totalItems}
					isTabIntersectWithRootEl={isTabIntersectWithRootEl}
					isMaxItemReached={isMaxItemReached}
				>
					<TabsList ref={tabListRootRef}>
						{tabs.map(({ title }: { title: string }, i) => (
							<TabsTrigger
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={i}
								id={String(i)}
								value={`tab-${i}`}
								totalItems={totalItems}
								onRemoveTab={removeTab}
								isTabIntersectWithRootEl={isTabIntersectWithRootEl}
								ref={totalItems - 1 === i ? activeTabRef : undefined}
							>
								{title}
							</TabsTrigger>
						))}
					</TabsList>
				</TabsNavigation>
				{tabs.map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<TabsContent value={`tab-${i}`} key={i}>
						{children}
					</TabsContent>
				))}
			</Tabs>
		);
	},
);

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	title: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
}

const TabTitleInput = React.forwardRef<HTMLInputElement, InputProps>(
	({
		title,
		setValue,
		...props
	}: {
		title: string;
		setValue: React.Dispatch<React.SetStateAction<string>>;
	}) => {
		const [temp, setTemp] = React.useState(title);

		const onChange: React.ChangeEventHandler<HTMLInputElement> = ({
			currentTarget,
		}) => {
			setTemp(currentTarget.value);
			setValue(currentTarget.value);
		};

		return <Input value={temp} onChangeCapture={onChange} {...props} />;
	},
);

const useTabs = ({ maxItems = 5 }: { maxItems?: number }): TabsAction => {
	const [tabs, setTabs] = useState<Array<Tab>>([{ title: "New Tab" }]);
	const [tabTitle, setTabTitle] = useState<string>("New Tab");
	const [activeTabId, setActiveTabId] = useState<string>("tab-0");
	const activeTabRef = React.useRef<HTMLButtonElement | null>(null);
	const tabListRootRef = React.useRef<HTMLDivElement | null>(null);
	const [isMaxItemReached, setMaxItemReached] = useState<boolean>(false);

	const debouncedTabTitle = useDebounce(tabTitle, 500);
	const debouncedTabs = useDebounce(tabs, 100);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const isTabIntersectWithRootEl = useMemo(
		() =>
			tabs.length * (activeTabRef.current?.clientWidth ?? 0) >
			(tabListRootRef.current?.clientWidth ?? 0),
		[tabs, activeTabRef, tabListRootRef],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect only run when `debouncedTabTitle` changed
	useEffect(() => {
		// Get current active tab id
		const [_, id] = activeTabId.split("-");

		const currentTabs = tabs;

		if (debouncedTabTitle) {
			currentTabs[Number(id)].title = debouncedTabTitle;
		}

		// Update division
		setTabs([...currentTabs]);
	}, [debouncedTabTitle]);

	// Side effect to scroll and focus to last added tabs
	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect will run when `debouncedTabs` and `activeTabRef` changed
	useEffect(
		() => activeTabRef.current?.scrollIntoView({ behavior: "smooth" }),
		[debouncedTabs, activeTabRef],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const currentTabTitle = useMemo(
		() => tabs[Number(activeTabId?.split("-")[1])].title,
		[activeTabId],
	);

	const totalItems = useMemo(() => tabs.length, [tabs]);

	const addNewTab = useCallback(() => {
		if (isMaxItemReached) return;

		const _tabs = [...tabs, { title: "New Tab" }];
		setTabs(_tabs);
		setActiveTabId(`tab-${_tabs.length - 1}`);

		if (_tabs.length === maxItems) {
			setMaxItemReached(true);
		}
	}, [tabs, maxItems, isMaxItemReached]);

	const removeTab = useCallback(
		(id: string) => {
			const _tabs = tabs;

			_tabs.splice(Number(id), 1);
			setTabs([..._tabs]);
			setActiveTabId(`tab-${_tabs.length - 1}`);

			if (_tabs.length < maxItems) {
				setMaxItemReached(false);
			}
		},
		[tabs, maxItems],
	);

	return {
		totalItems,
		activeTabId,
		setActiveTabId,
		isMaxItemReached,
		tabs,
		setTabTitle,
		addNewTab,
		removeTab,
		activeTabRef,
		tabListRootRef,
		tabTitle: currentTabTitle,
		isTabIntersectWithRootEl,
	};
};

export {
	// Default Tabs component
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
	// Browser tabs
	TabsNavigation,
	BrowserTabs,
	useTabs,
	TabTitleInput,
};
