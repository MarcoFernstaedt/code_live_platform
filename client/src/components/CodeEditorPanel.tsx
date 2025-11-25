import type { FC } from "react";
import { Editor } from "@monaco-editor/react";
import { LoaderIcon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";
import type { SupportedLanguage } from "../types";

type LanguageConfigMap = typeof LANGUAGE_CONFIG;

interface CodeEditorPanelProps {
    code: string;
    onChange: (value: string) => void;
    selectedLanguage: SupportedLanguage;
    onLanguageChange: (lang: SupportedLanguage) => void;
    isRunning: boolean;
    onRunCode: () => void;
}

const CodeEditorPanel: FC<CodeEditorPanelProps> = ({
    code,
    onChange,
    selectedLanguage,
    onLanguageChange,
    isRunning,
    onRunCode,
}) => {
    const langConfig = LANGUAGE_CONFIG[selectedLanguage as keyof LanguageConfigMap];

    return (
        <div className="h-full bg-base-300 flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-b border-base-300">
                <div className="flex items-center gap-3">
                    <img
                        src={langConfig.icon}
                        alt={langConfig.name}
                        className="size-6"
                    />

                    <select
                        className="select select-sm"
                        value={selectedLanguage}
                        onChange={(e) =>
                            onLanguageChange(e.target.value as SupportedLanguage)
                        }
                        aria-label="Select language"
                    >
                        {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                            <option key={key} value={key}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="btn btn-sm btn-primary gap-2"
                    onClick={onRunCode}
                    disabled={isRunning}
                    aria-busy={isRunning}
                >
                    {isRunning ? (
                        <>
                            <LoaderIcon className="size-4 animate-spin" />
                            Running
                        </>
                    ) : (
                        <>
                            <PlayIcon className="size-4" />
                            Run Code
                        </>
                    )}
                </button>
            </div>

            {/* Editor */}
            <div className="flex-1">
                <Editor
                    height="100%"
                    language={langConfig.monacoLang}
                    value={code}
                    onChange={(value) => onChange(value ?? "")}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        tabSize: 2,
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditorPanel;