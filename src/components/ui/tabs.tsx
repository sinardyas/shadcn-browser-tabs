"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ChevronLeft, ChevronRight, PlusCircleIcon } from "lucide-react";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

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

type CustomTabTrigger = TabsPrimitive.TabsTriggerProps & { totalItems: number };

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	CustomTabTrigger
>(({ className, totalItems, id, ...props }, ref) => {
	const isTotalItemMoreThan4 = useMemo(() => totalItems > 4, [totalItems]);
	const isFirstElement = useMemo(() => Number(id) === 0, [id]);
	const isLastElement = useMemo(
		() => totalItems - 1 === Number(id),
		[totalItems, id],
	);
	return (
		<TabsPrimitive.Trigger
			ref={ref}
			className={cn(
				"bg-zinc-100 inline-flex items-center justify-center whitespace-nowrap h-full px-3 py-1.5 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-[#0066FF] data-[state=active]:shadow-sm border border-[#EAEAEA]",
				!isTotalItemMoreThan4 && isFirstElement && "rounded-tl-md",
				!isTotalItemMoreThan4 && isLastElement && "rounded-tr-md",
				className,
			)}
			{...props}
		/>
	);
});
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
	onAddNewTab?: () => void;
	onCloseTab?: () => void;
	addTabTitle?: string;
	totalItems: number;
	isTabNotVisible: boolean;
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
		{ children, onAddNewTab, addTabTitle = "Add new tab", isTabNotVisible },
		ref,
	) => {
		if (isTabNotVisible) {
			return (
				<div className="inline-flex items-center w-full justify-between">
					<Nav />
					{children}
					<Nav direction="right" />
					<Button onClick={onAddNewTab} size="sm" className="bg-[#0066FF] ml-2">
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
					onClick={onAddNewTab}
					size={"sm"}
					className="bg-[#0066FF] float-right"
				>
					<PlusCircleIcon size={16} />
					{addTabTitle}
				</Button>
			</div>
		);
	},
);

interface TabsAction {
	tabTitle: string;
	isTabNotVisible: boolean;
	totalItems: number;
	activeTabId: string;
	addNewTab: () => void;
	tabs: Array<{ title: string }>;
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
			children,
			activeTabId,
			setActiveTabId,
			totalItems,
			tabs,
			addNewTab,
			activeTabRef,
			tabListRootRef,
			isTabNotVisible,
		},
		ref,
	) => {
		return (
			<Tabs value={activeTabId} onValueChange={setActiveTabId}>
				<TabsNavigation
					onAddNewTab={addNewTab}
					totalItems={totalItems}
					isTabNotVisible={isTabNotVisible}
				>
					<TabsList ref={tabListRootRef}>
						{tabs.map(({ title }, i) => (
							<TabsTrigger
								value={`tab-${i}`}
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={i}
								id={String(i)}
								totalItems={totalItems}
								ref={totalItems - 1 === i ? activeTabRef : undefined}
							>
								{title}
							</TabsTrigger>
						))}
					</TabsList>
				</TabsNavigation>
				{tabs.map(({ title }, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<TabsContent value={`tab-${i}`} key={i}>
						{children}
					</TabsContent>
				))}
			</Tabs>
		);
	},
);

const TabTitleInput = ({
	title,
	setValue,
}: { title: string; setValue: (s: string) => void }) => {
	const [temp, setTemp] = React.useState(title);

	const onChange: React.ChangeEventHandler<HTMLInputElement> = ({
		currentTarget,
	}) => {
		setTemp(currentTarget.value);
		setValue(currentTarget.value);
	};

	return (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor="email">Tab name</Label>
			<Input value={temp} onChange={onChange} />
		</div>
	);
};

const useTabs = (): TabsAction => {
	const [tabs, setTabs] = useState<{ title: string }[]>([{ title: "New Tab" }]);
	const [tabTitle, setTabTitle] = useState("New Tab");
	const [activeTabId, setActiveTabId] = useState("tab-0");
	const activeTabRef = React.useRef<HTMLButtonElement | null>(null);
	const tabListRootRef = React.useRef<HTMLDivElement | null>(null);

	const debouncedTabTitle = useDebounce(tabTitle, 500);
	const debouncedTabs = useDebounce(tabs, 100);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const isTabNotVisible = useMemo(
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

	const addNewTab = React.useCallback(() => {
		const _tabs = [...tabs, { title: "New Tab" }];
		setTabs(_tabs);
		setActiveTabId(`tab-${_tabs.length - 1}`);
	}, [tabs]);

	return {
		totalItems,
		activeTabId,
		setActiveTabId,
		tabs,
		setTabTitle,
		addNewTab,
		activeTabRef,
		tabListRootRef,
		tabTitle: currentTabTitle,
		isTabNotVisible,
	};
};

export {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
	TabsNavigation,
	BrowserTabs,
	useTabs,
	TabTitleInput,
};
