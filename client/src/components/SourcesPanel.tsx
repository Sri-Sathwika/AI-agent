// "use client";

// import { useEffect, useState } from "react";
// import {
//   FileText,
//   BookOpen,
//   ChevronRight,
// } from "lucide-react";

// import { sourceStore } from "@/lib/sourceStore";

// interface Source {
//   source: string;
//   page: string;
//   content: string;
// }

// export default function SourcesPanel() {
//   const [sources, setSources] =
//     useState<Source[]>([]);

//   useEffect(() => {
//     const updateSources = () => {
//       setSources(
//         sourceStore.getSources()
//       );
//     };

//     updateSources();

//     const unsubscribe =
//       sourceStore.subscribe(
//         updateSources
//       );

//     return unsubscribe;
//   }, []);

//   return (
//     <div
//       className="
//       h-full
//       overflow-y-auto
//       px-5
//       py-6
//     "
//     >
//       {/* Header */}

//       <div className="mb-6">
//         <div
//           className="
//           flex
//           items-center
//           gap-3
//         "
//         >
//           <div
//             className="
//             h-12
//             w-12
//             rounded-2xl
//             glass
//             flex
//             items-center
//             justify-center
//           "
//           >
//             <BookOpen
//               size={22}
//               className="text-purple-400"
//             />
//           </div>

//           <div>
//             <h2
//               className="
//               text-xl
//               font-bold
//             "
//             >
//               Sources
//             </h2>

//             <p className="text-xs text-zinc-500">
//               Citation Explorer
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Empty State */}

//       {sources.length === 0 ? (
//         <div
//           className="
//           h-[80%]
//           flex
//           items-center
//           justify-center
//         "
//         >
//           <div className="text-center">
//             <div
//               className="
//               h-24
//               w-24
//               rounded-3xl
//               glass
//               mx-auto
//               mb-6
//               flex
//               items-center
//               justify-center
//             "
//             >
//               <FileText
//                 size={40}
//                 className="text-purple-400"
//               />
//             </div>

//             <h3
//               className="
//               text-xl
//               font-semibold
//               mb-2
//             "
//             >
//               No Sources Yet
//             </h3>

//             <p className="text-zinc-500 text-sm">
//               Ask a question and click
//               "View Sources" to inspect
//               citations.
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {sources.map(
//             (source, index) => (
//               <div
//                 key={index}
//                 className="
//                 glass
//                 rounded-3xl
//                 p-5
//               "
//               >
//                 <div
//                   className="
//                   flex
//                   items-start
//                   justify-between
//                   mb-3
//                 "
//                 >
//                   <div>
//                     <h3
//                       className="
//                       font-semibold
//                       text-purple-400
//                     "
//                     >
//                       {source.source}
//                     </h3>

//                     <p className="text-xs text-zinc-500 mt-1">
//                       Page {source.page}
//                     </p>
//                   </div>

//                   <ChevronRight
//                     size={18}
//                     className="text-zinc-500"
//                   />
//                 </div>

//                 <div
//                   className="
//                   text-sm
//                   text-zinc-300
//                   leading-6
//                   line-clamp-8
//                 "
//                 >
//                   {source.content}
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       )}
//     </div>
//   );
// }