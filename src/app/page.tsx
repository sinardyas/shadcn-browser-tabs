"use client";

import { Input } from "@/components/ui/input";
import { BrowserTabs, TabTitleInput, useTabs } from "@/components/ui/tabs";

export default function Home() {
  const {...tabs} = useTabs();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <BrowserTabs {...tabs}>
          <TabTitleInput title={tabs.tabTitle} setValue={tabs.setTabTitle} />
          <Input value={'wooow'} readOnly/>
        </BrowserTabs>
    </main>
  );
}
