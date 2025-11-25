import type { FC } from "react";
import type { ExecuteResult } from "../lib/piston";

interface OutputPanelProps {
    output: ExecuteResult | string | null;
}

const OutputPanel: FC<OutputPanelProps> = ({ output }) => {
    // Normalize non-object output (e.g., plain string errors)
    const isObj = output !== null && typeof output === "object";

    return (
        <div className="h-full bg-base-100 flex flex-col">
            <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm">
                Output
            </div>

            <div className="flex-1 overflow-auto p-4">
                {/* No output yet */}
                {output === null ? (
                    <p className="text-base-content/50 text-sm">
                        Click "Run Code" to see the output here...
                    </p>
                ) : isObj && output.success ? (
                    // SUCCESS CASE
                    <pre className="text-sm font-mono text-success whitespace-pre-wrap">
                        {output.output}
                    </pre>
                ) : (
                    // ERROR CASE (object or raw string)
                    <div>
                        {isObj && output.output && (
                            <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                                {output.output}
                            </pre>
                        )}

                        <pre className="text-sm font-mono text-error whitespace-pre-wrap">
                            {isObj ? output.error : output}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OutputPanel;