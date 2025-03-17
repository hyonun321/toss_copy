'use client';
import { useState, useRef, useLayoutEffect } from 'react';
import { TabsContainer, Tab, CustomTabIndicator } from './CategoryTabs.style';

type TabOption = '거래대금' | '거래량' | '급상승' | '급하락';

interface CategoryTabsProps {
  onTabChange?: (tabType: string) => void;
  activeTab?: string;
}

export function CategoryTabs({
  onTabChange,
  activeTab = 'domestic/trade-value',
}: CategoryTabsProps) {
  const getInitialTab = () => {
    const endpointToTab = {
      'domestic/trade-value': '거래대금',
      'domestic/volume': '거래량',
      'domestic/rising': '급상승',
      'domestic/falling': '급하락',
    };

    return endpointToTab[activeTab] || '거래대금';
  };

  // 내부 상태와 외부 상태 동기화
  const [activeTabState, setActiveTabState] =
    useState<TabOption>(getInitialTab());
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs: TabOption[] = ['거래대금', '거래량', '급상승', '급하락'];

  // 탭 매핑 (UI 표시용 탭 -> API 요청용 타입)
  const tabTypeMapping = {
    거래대금: 'domestic/trade-value',
    거래량: 'domestic/volume',
    급상승: 'domestic/rising',
    급하락: 'domestic/falling',
  };

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeTabIndex = tabs.indexOf(activeTabState);
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
  }, [activeTabState, tabs]);

  const handleTabClick = (tab: TabOption) => {
    setActiveTabState(tab);

    // 상위 컴포넌트에 탭 변경 알림
    if (onTabChange) {
      onTabChange(tabTypeMapping[tab]);
    }
  };

  return (
    <TabsContainer>
      {tabs.map((tab, index) => (
        <Tab
          key={tab}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          active={activeTabState === tab}
          onClick={() => handleTabClick(tab)}
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
