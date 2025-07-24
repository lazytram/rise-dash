import { memo } from "react";
import Image from "next/image";

export const WelcomeLogo = memo(function WelcomeLogo() {
  return (
    <div className="mb-8">
      <div className="w-28 h-28 bg-gradient-to-br from-purple-400 via-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl mb-6 mx-auto p-2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-purple-900/50 rounded-full" />
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-400/40 to-transparent rounded-full" />
        <Image
          src="/pfp.png"
          alt="Rise Dash Logo"
          width={96}
          height={96}
          className="rounded-full object-cover relative z-10"
          priority
        />
      </div>
    </div>
  );
});
