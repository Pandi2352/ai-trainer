import React from 'react';
import { Tooltip as AntTooltip } from 'antd';
import type { TooltipProps } from 'antd/es/tooltip';

interface CustomTooltipProps extends TooltipProps {
  children: React.ReactNode;
}

export const Tooltip: React.FC<CustomTooltipProps> = ({ children, ...props }) => {
  return <AntTooltip {...props}>{children}</AntTooltip>;
};
