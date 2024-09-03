"use client"

import * as React from "react"
import { useState } from  'react';
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input";
import { useDebounce } from "@/hooks/use-debounce";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "./label";
import { UseFieldArrayReturn } from "react-hook-form";

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (<React.Fragment>
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center rounded-md p-1 text-muted-foreground bg-transparent w-[350px] overflow-x-scroll scroll-smooth overflow-y-hidden",
      className
    )}
    {...props}
  />
  </React.Fragment>
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm border border-[#F6F6F6]",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName;

interface TabsNavigationProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.TabsList> {
  onAddNewTab?: () => void;
  onCloseTab?: () => void;
  addTabTitle?: string;
  totalItems: number;
}

const TabsNavigation = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.TabsList>,
  TabsNavigationProps
>(({className, children, onAddNewTab, addTabTitle = 'Add new tab', totalItems = 1}, ref) => {
  if (totalItems < 4) {
    return <React.Fragment>
      {children}
      <Button onClick={onAddNewTab}>{addTabTitle}</Button>
    </React.Fragment>
  }

  return <React.Fragment>
    <a className={cn(
      "h-10 w-10 p-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm p1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}><ChevronLeft size={16}/></a>
    {children}
    <a className={cn(
      "h-10 w-10 p-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm p1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )} href=""><ChevronRight size={16}/></a>
    <Button onClick={onAddNewTab}>{addTabTitle}</Button>
  </React.Fragment>
})

interface TabsAction {
  activeTabId: string; 
  setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
  totalItems: number; 
  tabs: { title: string }[], 
  tabTitle: string;
  setTabTitle: React.Dispatch<React.SetStateAction<string>>;
  addNewTab: () => void;
}

const useTabs = (): TabsAction => {
  const [tabs, setTabs] = useState<{ title: string; }[]>([{ title: 'New Tab' }]);
  const [tabTitle, setTabTitle] = useState('New Tab');
  const [activeTabId, setActiveTabId] = useState('tab-0');

  const debouncedTabTitle = useDebounce(tabTitle, 500);

  React.useEffect(() => {
    // Get current active tab id
    const [_, id] = activeTabId?.split('-');
    
    const currentTabs = tabs;

    if (debouncedTabTitle) {
      currentTabs[Number(id)].title = debouncedTabTitle;
    }

    // Update division
    setTabs([...currentTabs]);
  }, [debouncedTabTitle]);

  const currentTabTitle = React.useMemo(() => tabs[Number(activeTabId?.split('-')[1])].title, [activeTabId]);
  
  const totalItems = React.useMemo(() => tabs.length, [tabs]);

  const addNewTab = React.useCallback(() => setTabs([...tabs, { title: 'New Tab' }]), [tabs]);

  return {
    totalItems,
    activeTabId,
    setActiveTabId,
    tabs,
    setTabTitle,
    addNewTab,
    tabTitle: currentTabTitle
  }
}

type BrowserTabsProps = TabsPrimitive.TabsProps & TabsAction;

const BrowserTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>, 
  BrowserTabsProps
>(({ children, activeTabId, setActiveTabId, totalItems, tabs, addNewTab }, ref) => {
  return <Tabs value={activeTabId} onValueChange={setActiveTabId}>
      <TabsNavigation onAddNewTab={addNewTab} totalItems={totalItems}>
        <TabsList>
          {tabs.map(({ title }, i) => <TabsTrigger value={`tab-${i}`} key={i} id={String(i)}>{title}</TabsTrigger>)}
        </TabsList>
      </TabsNavigation>
      {tabs.map(({ title }, i) => <TabsContent value={`tab-${i}`} key={i}>
        {children}
      </TabsContent>)}
    </Tabs>;
});

const TabTitleInput = ({ title, setValue }: { title: string; setValue: (s: string) => void }) => {
  const [temp, setTemp] = React.useState(title);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = ({ currentTarget }) => {
    setTemp(currentTarget.value);
    setValue(currentTarget.value);
  }

  return <div className="grid w-full max-w-sm items-center gap-1.5">
    <Label htmlFor="email">Tab name</Label>
    <Input value={temp} onChange={onChange}/>
  </div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsNavigation, BrowserTabs, useTabs, TabTitleInput }
