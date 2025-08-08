import { memo } from "react";
import Image from "next/image";

export const WelcomeLogo = memo(function WelcomeLogo() {
  return (
    <div className="mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-[#7967e5] via-[#99eafc] to-[#7967e5] rounded-full flex items-center justify-center shadow-2xl mb-6 mx-auto p-2 relative group hover:scale-105 transition-transform duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-[#3a1344]/30 rounded-full" />
        <div className="absolute inset-0 bg-gradient-to-tl from-[#99eafc]/30 to-transparent rounded-full" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#7967e5]/20 to-[#99eafc]/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300" />
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
