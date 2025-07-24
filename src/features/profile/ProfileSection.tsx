import React from "react";

interface ProfileSectionProps {
  children: React.ReactNode;
  minHeight?: string;
  className?: string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  children,
  minHeight = "min-h-[350px]",
  className = "",
}) => {
  return (
    <div className={`${minHeight} flex flex-col ${className}`}>{children}</div>
  );
};
