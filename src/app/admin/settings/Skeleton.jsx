export default function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-[#FCFAEF] pb-20 animate-pulse">
      <div className="max-w-7xl mx-auto pt-16 px-6">
        {/* HEADER SECTION SKELETON */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-gray-200 rounded-md"></div>
            <div className="h-4 w-96 bg-gray-200 rounded-md max-w-full"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
        </div>

        {/* MAIN GRID SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN (Span 4) */}
          <div className="lg:col-span-4 space-y-8">
            {/* ADD ADMIN CARD SKELETON */}
            <div className="bg-white rounded-xl border border-[#EADCC9] p-7">
              <div className="h-8 w-48 bg-gray-200 rounded-md mb-8"></div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-12 w-full bg-[#FCFAEF] rounded-md border border-[#EADCC9]"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  <div className="h-12 w-full bg-[#FCFAEF] rounded-md border border-[#EADCC9]"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-28 bg-gray-200 rounded"></div>
                  <div className="h-12 w-full bg-[#FCFAEF] rounded-md border border-[#EADCC9]"></div>
                </div>
                <div className="h-12 w-full bg-gray-200 rounded-md mt-4"></div>
              </div>
            </div>

            {/* AUDIT LOGS CARD SKELETON */}
            <div className="bg-white rounded-xl border border-[#EADCC9] p-7">
              <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-32 bg-gray-200 rounded-md"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>

              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 w-full bg-[#FCFAEF] border-l-2 border-gray-200 rounded-r-md"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Span 8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* ACTIVE STEWARDS TABLE SKELETON */}
            <div className="bg-white rounded-xl border border-[#EADCC9] flex flex-col">
              <div className="p-7 border-b border-[#EADCC9] flex justify-between items-end">
                <div className="space-y-2">
                  <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded-md"></div>
                </div>
                <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
              </div>

              {/* Table Header Row */}
              <div className="h-12 bg-[#FAF2E8] border-b border-[#EADCC9] w-full"></div>

              {/* Table Body Rows */}
              <div className="flex flex-col">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-5 border-b border-gray-50 px-7"
                  >
                    <div className="flex items-center gap-4 w-1/3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
                      <div className="space-y-2 w-full">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-3 w-48 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="w-1/6">
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-1/6">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-1/6 flex justify-end gap-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-sm"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded-sm"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Footer */}
              <div className="h-14 bg-[#FAF2E8]/40 border-t border-[#EADCC9] w-full"></div>
            </div>

            {/* AESTHETIC BANNER SKELETON */}
            <div className="h-48 rounded-xl bg-gray-200 border border-[#EADCC9]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
