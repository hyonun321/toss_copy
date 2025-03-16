'use client';
import { useState } from 'react';
import { TabsContainer, Tab, TabIndicator } from './CategoryTabs.style';

type TabOption = '거래대금' | '거래량' | '급상승' | '급하락';

export function CategoryTabs() {
  const [activeTab, setActiveTab] = useState<TabOption>('거래대금');

  const tabs: TabOption[] = ['거래대금', '거래량', '급상승', '급하락'];

  return (
    <TabsContainer>
      {tabs.map((tab) => (
        <Tab
          key={tab}
          active={activeTab === tab}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </Tab>
      ))}
      <TabIndicator position={tabs.indexOf(activeTab)} />
    </TabsContainer>
  );
}
