// // app/hydration-fix.tsx
// "use client";

// import { useEffect } from "react";

// export function HydrationFix() {
//   useEffect(() => {
//     // Store original console.error
//     const originalError = console.error;
    
//     // Override console.error to filter out hydration warnings
//     console.error = (...args) => {
//       // Check if this is a hydration warning about fdprocessedid
//       if (args.length > 0 && typeof args[0] === 'string') {
//         const errorMessage = args[0];
        
//         // Suppress all fdprocessedid related errors
//         if (errorMessage.includes('fdprocessedid') || 
//             errorMessage.includes('data-') && errorMessage.includes('did not match') ||
//             errorMessage.includes('Prop `') && errorMessage.includes('did not match')) {
//           return;
//         }
        
//         // Suppress the specific hydration error pattern
//         if (errorMessage.includes('A tree hydrated but some attributes of the server rendered HTML didn\'t match')) {
//           return;
//         }
//       }
      
//       // Pass through all other errors
//       originalError.apply(console, args);
//     };

//     // Also suppress the React devtools warning about extensions
//     const originalWarn = console.warn;
//     console.warn = (...args) => {
//       if (args.length > 0 && typeof args[0] === 'string') {
//         if (args[0].includes('browser extension') || 
//             args[0].includes('fdprocessedid')) {
//           return;
//         }
//       }
//       originalWarn.apply(console, args);
//     };

//     // Cleanup
//     return () => {
//       console.error = originalError;
//       console.warn = originalWarn;
//     };
//   }, []);

//   return null;
// }