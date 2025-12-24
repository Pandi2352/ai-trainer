import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <motion.span
          className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 rounded-full"
          style={{ borderTopColor: 'var(--color-primary-600)' }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Inner Pulse */}
        <motion.div
           className="absolute top-1/2 left-1/2 w-8 h-8 bg-primary-500 rounded-full -translate-x-1/2 -translate-y-1/2"
           animate={{
             scale: [0.8, 1.2, 0.8],
             opacity: [0.5, 1, 0.5]
           }}
           transition={{
             duration: 1.5,
             repeat: Infinity,
             ease: "easeInOut"
           }}
        />
      </div>
    </div>
  );
};

export default Loader;
