import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from './ui/skeleton';

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6" data-testid="loading-skeleton">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: item * 0.05 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32 bg-white/10" />
              <Skeleton className="h-6 w-6 rounded-full bg-white/10" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-3/4 bg-white/10" />
              <Skeleton className="h-4 w-1/2 bg-white/10" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;