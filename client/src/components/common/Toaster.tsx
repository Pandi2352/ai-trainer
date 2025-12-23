import { message } from 'antd';

// Initialize message configuration
message.config({
  top: 60,
  duration: 3,
  maxCount: 3,
});

export const requestMessage = {
  success: (content: string) => message.success(content),
  error: (content: string) => message.error(content),
  warning: (content: string) => message.warning(content),
  info: (content: string) => message.info(content),
  loading: (content: string) => message.loading(content),
};

// Simple Component wrapper if needed for context, though Antd message is static
export const ToasterContext = () => null;
