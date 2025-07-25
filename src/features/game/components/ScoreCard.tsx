import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";

interface ScoreCardProps {
  distance: number;
  title: string;
  subtitle?: string;
  variant?: "default" | "success";
  className?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  distance,
  title,
  subtitle,
  variant = "default",
  className = "",
}) => {
  const { t } = useTranslations();

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          background:
            "bg-gradient-to-br from-green-600/90 via-emerald-600/90 to-teal-600/90",
          border: "border-green-400/40",
          hoverBorder: "group-hover:border-green-300/60",
          shadow: "group-hover:shadow-green-500/30",
          glow: "from-green-500/30 via-emerald-500/20 to-teal-500/30",
          textGradient: "from-white to-green-100",
          decorative1: "bg-green-300/60",
          decorative2: "bg-emerald-300/60",
        };
      default:
        return {
          background:
            "bg-gradient-to-br from-violet-600/90 via-purple-600/90 to-indigo-600/90",
          border: "border-violet-400/40",
          hoverBorder: "group-hover:border-violet-300/60",
          shadow: "group-hover:shadow-violet-500/30",
          glow: "from-violet-500/30 via-purple-500/20 to-indigo-500/30",
          textGradient: "from-white to-violet-100",
          decorative1: "bg-violet-300/60",
          decorative2: "bg-purple-300/60",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`flex flex-col items-center w-full h-full ${className}`}>
      {/* Title */}
      <div className="mb-3 sm:mb-4 text-center">
        <Text
          variant="subtitle"
          size="lg"
          className="text-white/90 font-semibold tracking-wider uppercase text-xs sm:text-sm"
        >
          {title}
        </Text>
        <div
          className={`w-6 sm:w-8 h-0.5 bg-gradient-to-r ${
            variant === "success"
              ? "from-green-400 to-emerald-400"
              : "from-violet-400 to-purple-400"
          } mx-auto mt-1 sm:mt-2 rounded-full`}
        ></div>
      </div>

      {/* Score Card */}
      <div className="relative group w-full max-w-xs mb-4 sm:mb-6">
        <div
          className={`relative ${styles.background} rounded-lg p-4 sm:p-5 shadow-xl border ${styles.border} backdrop-blur-md transform transition-all duration-500 group-hover:scale-105 ${styles.shadow} ${styles.hoverBorder}`}
        >
          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            {/* Score Display */}
            <div className="flex items-baseline space-x-2">
              <Text
                variant="title"
                size="2xl"
                className={`sm:text-3xl text-white font-bold tracking-wide drop-shadow-lg bg-gradient-to-r ${styles.textGradient} bg-clip-text text-transparent`}
              >
                {distance}
              </Text>
              <Text
                variant="body"
                className="text-white/80 font-medium text-xs sm:text-sm tracking-wide"
              >
                {t("features.gameplay.meters")}
              </Text>
            </div>

            {/* Subtitle */}
            {subtitle && (
              <Text
                variant="body"
                className="text-white/70 font-medium text-xs tracking-wide uppercase"
              >
                {subtitle}
              </Text>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-300"></div>
          <div
            className={`absolute top-1/2 left-1.5 w-0.5 h-0.5 ${styles.decorative1} rounded-full animate-pulse delay-700`}
          ></div>
          <div
            className={`absolute top-1/2 right-1.5 w-0.5 h-0.5 ${styles.decorative2} rounded-full animate-pulse delay-1000`}
          ></div>
        </div>

        {/* Glow Effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${styles.glow} rounded-lg blur-lg -z-10 group-hover:blur-xl transition-all duration-500`}
        ></div>
      </div>
    </div>
  );
};
