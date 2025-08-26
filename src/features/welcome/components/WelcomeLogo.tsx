import { memo } from "react";
import Image from "next/image";

export const WelcomeLogo = memo(function WelcomeLogo() {
  return (
    <div className="mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-primary via-primary-hover to-primary rounded-full flex items-center justify-center shadow-2xl mb-6 mx-auto p-2 relative group hover:scale-105 transition-transform duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-primary/20 rounded-full" />
        <div className="absolute inset-0 bg-gradient-to-tl from-primary-light/40 to-transparent rounded-full" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300" />
        <Image
          src="/pfp.png"
          alt="Rise Dash Logo"
          width={112}
          height={112}
          className="rounded-full object-cover relative z-10"
          priority
        />
      </div>
    </div>
  );
});
