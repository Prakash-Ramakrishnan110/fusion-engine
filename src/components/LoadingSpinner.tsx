import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "medium" }: { size?: "small" | "medium" | "large" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} border-4 border-primary border-t-transparent rounded-full`}
      >
        <div className="w-full h-full border-2 border-primary border-t-transparent rounded-full animate-pulse">
          <div className="w-full h-full border-2 border-primary/30 border-t-transparent rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
