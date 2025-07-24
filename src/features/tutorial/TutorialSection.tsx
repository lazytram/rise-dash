import React from "react";

interface TutorialSectionProps {
  title: string;
  children: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
}

export const TutorialSection: React.FC<TutorialSectionProps> = ({
  title,
  children,
  gradientFrom,
  gradientTo,
  borderColor,
}) => {
  return (
    <div
      className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-4 rounded-lg border-l-4 ${borderColor}`}
    >
      <h3 className="font-bold text-lg mb-3">{title}</h3>
      {children}
    </div>
  );
};
