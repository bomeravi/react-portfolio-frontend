import { type PropsWithChildren, useEffect, useState } from "react";
import { ErrorBoundary as RErrorBoundary } from "react-error-boundary";

const ErrorBoundary = (props: PropsWithChildren) => {
  const [error, setError] = useState<{ error: Error; info: string } | null>(
    null
  );

  // Close modal with ESC key (DEV mode only)
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setError(null);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Copy Stack Trace
  const copyStack = () => {
    if (!error) return;
    navigator.clipboard.writeText(error.error.stack || "");
  };

  return (
    <RErrorBoundary
      onError={(err, info) => {
        setError({ error: err, info: info.componentStack ?? "" });
        console.error(err, info);
      }}
      fallback={
        <>
          {/* DEV MODE DEBUG MODAL */}
          {error && import.meta.env.DEV ? (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 z-10 bg-[#242c38] bg-opacity-70"
                onClick={() => setError(null)}
              />

              {/* Error Panel */}
              <div className="fixed inset-0 z-20 h-screen w-full overflow-auto p-20">
                <div className="relative mx-auto max-w-4xl rounded-xl bg-[#18212e] bg-opacity-95 p-6 shadow-2xl">
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setError(null)}
                    className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-red-700 hover:text-white"
                    aria-label="Close error message"
                  >
                    X
                  </button>

                  {/* Header */}
                  <div className="mb-6 border-b border-red-800 pb-3">
                    <h1 className="text-red-400 font-extrabold text-4xl">
                      Compiled with Errors
                    </h1>
                    <p className="text-red-500 text-xl mt-2">
                      [{error?.error.name}] {error.error?.message}
                    </p>
                  </div>

                  {/* Component Stack */}
                  <div className="mb-5">
                    <h2 className="text-gray-300 font-semibold mb-2">
                      Component Stack:
                    </h2>
                    <div className="overflow-auto rounded-lg bg-[#24354b] p-4 text-gray-200 text-sm max-h-40">
                      <pre>
                        <code>{error.info}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Error Stack Trace */}
                  <div className="mb-4">
                    <h2 className="text-gray-300 font-semibold mb-2">
                      Stack Trace:
                    </h2>

                    <div className="overflow-auto rounded-lg bg-[#24354b] p-4 text-gray-200 text-sm max-h-80">
                      <pre>
                        <code>{error.error.stack}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={copyStack}
                      className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 transition"
                    >
                      Copy Stack
                    </button>

                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-600 transition"
                    >
                      Reload Page
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {/* PRODUCTION FALLBACK UI */}
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#2d0000] text-white">
            <h1 className="text-5xl font-bold mb-8">Something Went Wrong</h1>
            <button
              className="bg-[#e90030] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#c80029] transition-colors duration-200"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </>
      }
    >
      {props.children}
    </RErrorBoundary>
  );
};

export default ErrorBoundary;
