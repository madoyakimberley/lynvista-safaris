const Skeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen bg-white">
      {/* LEFT CARD (Detailed Layout) */}
      <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-4 animate-pulse border border-gray-100">
        {/* Main Image Block */}
        <div className="w-full aspect-video bg-gray-200 rounded-md mb-6"></div>

        {/* Middle Row: Text + Button shape */}
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2 w-1/3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
        </div>

        <hr className="border-gray-100 mb-6" />

        {/* Content Lines */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-10/12"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>

      {/* RIGHT CARD (Feed/Social Layout) */}
      <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-4 animate-pulse border border-gray-100">
        {/* Header Row: Text + Avatar */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2 w-2/3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>

        <hr className="border-gray-100 mb-4" />

        {/* Large Media Block */}
        <div className="w-full h-100 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};

export default Skeleton;
