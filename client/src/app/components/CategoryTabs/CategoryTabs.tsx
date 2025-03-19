'use client';
import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from 'react';
import { TabsContainer, Tab, CustomTabIndicator } from './CategoryTabs.style';
import {
  TAB_OPTIONS,
  TAB_TO_ENDPOINT,
  ENDPOINT_TO_TAB,
  Endpoint,
} from '@/app/constants/tabMappings';

// Type for custom tabs
export type CustomTabItem = {
  id: string;
  label: string;
};
interface DefaultCategoryTabsProps {
  onTabChange: (tabType: Endpoint) => void;
  activeTab: Endpoint;
  customTabs?: never;
}

interface CustomCategoryTabsProps {
  onTabChange: (tabType: string) => void;
  activeTab: string;
  customTabs: CustomTabItem[];
}

type CategoryTabsProps = DefaultCategoryTabsProps | CustomCategoryTabsProps;

export function CategoryTabs(props: CategoryTabsProps) {
  const { onTabChange, activeTab } = props;
  const isUsingCustomTabs = 'customTabs' in props && !!props.customTabs;
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const getInitialTabLabel = useCallback((): string => {
    if (isUsingCustomTabs) {
      const tab = props.customTabs.find((t) => t.id === activeTab);
      return tab ? tab.label : props.customTabs[0].label;
    } else {
      return Object.keys(ENDPOINT_TO_TAB).includes(activeTab as string)
        ? ENDPOINT_TO_TAB[activeTab as keyof typeof ENDPOINT_TO_TAB]
        : TAB_OPTIONS[0];
    }
  }, [isUsingCustomTabs, props.customTabs, activeTab]);

  const [activeTabLabel, setActiveTabLabel] =
    useState<string>(getInitialTabLabel());

  const displayTabs = isUsingCustomTabs
    ? props.customTabs.map((t) => t.label)
    : TAB_OPTIONS;

  useEffect(() => {
    const newLabel = getInitialTabLabel();
    if (newLabel !== activeTabLabel) {
      setActiveTabLabel(newLabel);
    }
  }, [activeTabLabel, getInitialTabLabel]);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeTabIndex = (displayTabs as string[]).indexOf(activeTabLabel);
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
  }, [activeTabLabel, displayTabs]);

  const handleTabClick = (tabLabel: string) => {
    setActiveTabLabel(tabLabel);

    if (isUsingCustomTabs) {
      // Find the corresponding ID in custom tabs
      const tab = props.customTabs.find((t) => t.label === tabLabel);
      if (tab) {
        onTabChange(tab.id);
      }
    } else {
      // Check if tabLabel is a key in TAB_TO_ENDPOINT
      if (tabLabel in TAB_TO_ENDPOINT) {
        const endpoint =
          TAB_TO_ENDPOINT[tabLabel as keyof typeof TAB_TO_ENDPOINT];
        onTabChange(endpoint as Endpoint);
      }
    }
  };

  return (
    <TabsContainer>
      {displayTabs.map((tabLabel, index) => (
        <Tab
          key={tabLabel}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          active={activeTabLabel === tabLabel}
          onClick={() => handleTabClick(tabLabel)}
        >
          {tabLabel}
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
