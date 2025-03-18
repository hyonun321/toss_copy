'use client';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { TabsContainer, Tab, CustomTabIndicator } from './CategoryTabs.style';
import {
  TAB_OPTIONS,
  TAB_TO_ENDPOINT,
  ENDPOINT_TO_TAB,
  Endpoint,
} from '@/app/constants/tabMappings';

type TabOption = '거래대금' | '거래량' | '급상승' | '급하락';

interface CategoryTabsProps {
  onTabChange?: (tabType: Endpoint) => void;
  activeTab?: Endpoint;
}

export function CategoryTabs({
  onTabChange,
  activeTab = 'domestic/trade-value',
}: CategoryTabsProps) {
  // 내부 상태와 외부 상태 동기화
  const [activeTabState, setActiveTabState] = useState<TabOption>(
    ENDPOINT_TO_TAB[activeTab] || '거래대금',
  );
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 외부 activeTab 변경 시 내부 상태 업데이트
  useEffect(() => {
    const mappedTab = ENDPOINT_TO_TAB[activeTab];
    if (mappedTab && mappedTab !== activeTabState) {
      setActiveTabState(mappedTab as TabOption);
    }
  }, [activeTab, activeTabState]);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeTabIndex = TAB_OPTIONS.indexOf(activeTabState);
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
  }, [activeTabState]);

  const handleTabClick = (tab: TabOption) => {
    setActiveTabState(tab);

    // 상위 컴포넌트에 탭 변경 알림
    if (onTabChange) {
      onTabChange(TAB_TO_ENDPOINT[tab]);
    }
  };

  return (
    <TabsContainer>
      {TAB_OPTIONS.map((tab, index) => (
        <Tab
          key={tab}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          active={activeTabState === tab}
          onClick={() => handleTabClick(tab as TabOption)}
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
