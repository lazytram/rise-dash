import React from "react";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";

export const ProfileAchievements: React.FC = () => {
  return (
    <Box variant="centered" className="py-12">
      <Text variant="title" size="2xl" className="mb-4">
        Achievements
      </Text>
      <Text variant="subtitle" size="lg">
        Coming soon
      </Text>
    </Box>
  );
};
