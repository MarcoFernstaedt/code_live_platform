import type { FC, ChangeEvent } from "react";
import { getDifficultyBadgeClass } from "../lib/utils";
import type { Problem } from "../types";

interface ProblemDescriptionProps {
    problem: Problem;
    currentProblemId: string;
    onProblemChange: (problemId: string) => void;
    allProblems: Problem[];
}

const ProblemDescription: FC<ProblemDescriptionProps> = ({
    problem,
    currentProblemId,
    onProblemChange,
    allProblems,
}) => {
    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onProblemChange(e.target.value);
    };

    return (
        <div className="h-full overflow-y-auto bg-base-200">
            {/* HEADER SECTION */}
            <header className="p-6 bg-base-100 border-b border-base-300">
                <div className="flex items-start justify-between mb-3 gap-4">
                    <h1 className="text-3xl font-bold text-base-content">
                        {problem.title}
                    </h1>

                    <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                        {problem.difficulty}
                    </span>
                </div>

                <p className="text-base-content/60">{problem.category}</p>

                {/* Problem selector */}
                <div className="mt-4">
                    <select
                        className="select select-sm w-full"
                        value={currentProblemId}
                        onChange={handleSelectChange}
                        aria-label="Select problem"
                    >
                        {allProblems.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.title} — {p.difficulty}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="p-6 space-y-6">
                {/* DESCRIPTION */}
                <section className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                    <h2 className="text-xl font-bold text-base-content mb-3">
                        Description
                    </h2>

                    <div className="space-y-3 text-base leading-relaxed">
                        <p className="text-base-content/90">
                            {problem.description.text}
                        </p>

                        {problem.description.notes?.map((note, idx) => (
                            <p key={`${problem.id}-note-${idx}`} className="text-base-content/90">
                                {note}
                            </p>
                        ))}
                    </div>
                </section>

                {/* EXAMPLES */}
                <section className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                    <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>

                    <div className="space-y-4">
                        {problem.examples?.map((example, idx) => (
                            <article key={`${problem.id}-ex-${idx}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="badge badge-sm">{idx + 1}</span>
                                    <p className="font-semibold text-base-content">
                                        Example {idx + 1}
                                    </p>
                                </div>

                                <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                                    <div className="flex gap-2">
                                        <span className="text-primary font-bold min-w-[70px]">
                                            Input:
                                        </span>
                                        <span>{example.input}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <span className="text-secondary font-bold min-w-[70px]">
                                            Output:
                                        </span>
                                        <span>{example.output}</span>
                                    </div>

                                    {example.explanation && (
                                        <div className="pt-2 border-t border-base-300 mt-2">
                                            <span className="text-base-content/60 font-sans text-xs">
                                                <span className="font-semibold">Explanation:</span>{" "}
                                                {example.explanation}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* CONSTRAINTS */}
                <section className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                    <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>

                    <ul className="space-y-2 text-base-content/90">
                        {problem.constraints?.map((constraint, idx) => (
                            <li key={`${problem.id}-c-${idx}`} className="flex gap-2">
                                <span className="text-primary">•</span>
                                <code className="text-sm">{constraint}</code>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default ProblemDescription;