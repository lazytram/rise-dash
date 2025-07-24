export const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold";
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-white font-bold";
    case 3:
      return "bg-gradient-to-r from-amber-600 to-amber-800 text-white font-bold";
    default:
      return "bg-white/10 text-white";
  }
};
