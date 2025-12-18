import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from "react-resizable-panels";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import ProblemDescription from "../components/ProblemDescription";
import type { SupportedLanguage, Problem } from "../types";
import { executeCode } from "../lib/piston";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const ProblemDetailsPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [currentProblemId, setCurrentProblemId] = useState("two-sum");
    const [selectedLanguage, setSelectedLanguage] =
        useState<SupportedLanguage>("javascript");

    const [code, setCode] = useState(
        PROBLEMS["two-sum"].starterCode.javascript
    );
    const [output, setOutput] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const currentProblem = PROBLEMS[currentProblemId] as Problem;

    // Sync problem + starter code when route or language changes
    useEffect(() => {
        if (id && PROBLEMS[id]) {
            setCurrentProblemId(id);
            setCode(PROBLEMS[id].starterCode[selectedLanguage]);
            setOutput(null);
            return;
        }

        if (id) {
            navigate("/problems", { replace: true });
        }
    }, [id, selectedLanguage, navigate]);

    const handleLanguageChange = (lang: SupportedLanguage) => {
        setSelectedLanguage(lang);
        setCode(PROBLEMS[currentProblemId].starterCode[lang]);
        setOutput(null);
    };

    const handleProblemChange = (problemId: string) => {
        if (PROBLEMS[problemId]) {
            navigate(`/problem/${problemId}`);
        }
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 80,
            spread: 250,
            origin: { x: 0.2, y: 0.6 },
        });

        confetti({
            particleCount: 80,
            spread: 250,
            origin: { x: 0.8, y: 0.6 },
        });
    };

    const normalizeOutput = (raw: string): string => {
        return raw
            .trim()
            .split("\n")
            .map((line) =>
                line
                    .trim()
                    .replace(/\[\s+/g, "[")
                    .replace(/\s+\]/g, "]")
                    .replace(/\s*,\s*/g, ",")
            )
            .filter(Boolean)
            .join("\n");
    };

    const checkIfTestPass = (userOut: string, expectedOut: string): boolean => {
        return normalizeOutput(userOut) === normalizeOutput(expectedOut);
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput(null);

        try {
            const result = await executeCode(selectedLanguage, code);

            if (!result.success) {
                setOutput(result.output ?? result.error);
                toast.error('Code execution failed!');
                return;
            }

            setOutput(result.output);

            const expectedOutput =
                currentProblem.expectedOutput[selectedLanguage] ?? "";

            const testPassed = checkIfTestPass(result.output, expectedOutput);

            if (testPassed) {
                toast.success("All tests passed! Great job!");
                triggerConfetti();
            } else {
                toast.error("Tests failed. Check your output!");
            }
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unknown execution error.";
            setOutput(message);
            toast.error(message);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-base-100 flex flex-col">
            <Navbar />

            <div className="flex-1">
                <PanelGroup direction="horizontal">
                    {/* LEFT PANEL */}
                    <Panel defaultSize={40} minSize={30}>
                        <ProblemDescription
                            problem={currentProblem}
                            currentProblemId={currentProblemId}
                            onProblemChange={handleProblemChange}
                            allProblems={Object.values(PROBLEMS) as Problem[]}
                        />
                    </Panel>

                    <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

                    {/* RIGHT PANEL */}
                    <Panel defaultSize={60} minSize={30}>
                        <PanelGroup direction="vertical">
                            <Panel defaultSize={70} minSize={30}>
                                <CodeEditorPanel
                                    code={code}
                                    onChange={setCode}
                                    selectedLanguage={selectedLanguage}
                                    onLanguageChange={handleLanguageChange}
                                    isRunning={isRunning}
                                    onRunCode={handleRunCode}
                                />
                            </Panel>

                            <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                            <Panel defaultSize={30} minSize={20}>
                                <OutputPanel output={output} />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
};

export default ProblemDetailsPage;