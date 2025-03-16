'use client';
import { useState, useRef, useLayoutEffect } from 'react';
import { TabsContainer, Tab, CustomTabIndicator } from './CategoryTabs.style';

type TabOption = '거래대금' | '거래량' | '급상승' | '급하락';

export function CategoryTabs() {
  const [activeTab, setActiveTab] = useState<TabOption>('거래대금');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs: TabOption[] = ['거래대금', '거래량', '급상승', '급하락'];

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeTabIndex = tabs.indexOf(activeTab);
      const activeTabElement = tabRefs.current[activeTabIndex];

      if (activeTabElement) {
        const tabRect = activeTabElement.getBoundingClientRect();
        const containerRect =
          activeTabElement.parentElement?.getBoundingClientRect();

        if (containerRect) {
          const left = tabRect.left - containerRect.left;
          const width = activeTabElement.offsetWidth;

          setIndicatorStyle((prevStyle) => {
            if (prevStyle.left !== left || prevStyle.width !== width) {
              return { left, width };
            }
            return prevStyle;
          });
        }
      }
    };

    updateIndicator();

    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab, tabs]);

  return (
    <TabsContainer>
      {tabs.map((tab, index) => (
        <Tab
          key={tab}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          active={activeTab === tab}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </Tab>
      ))}
      <CustomTabIndicator
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
    </TabsContainer>
  );
}
