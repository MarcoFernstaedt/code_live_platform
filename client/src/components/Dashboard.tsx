import { useUser } from "@clerk/clerk-react";
import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import {
    useActiveSessions,
    useCreateSession,
    useRecentSessions,
} from "../hooks/useSessions";
import Navbar from "./Navbar";
import WelcomeSection from "./WelcomeSection";
import StatsCards from "./StatsCards";
import ActiveSessions from "./ActiveSessions";
import CreateSessionModal from "./CreateSessionModal";
import type { RoomConfig, Session } from "../types";
import RecentSessions from "./RecentSessions";

const Dashboard: FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roomConfig, setRoomConfig] = useState<RoomConfig>({
        problem: "",
        difficulty: "",
    });

    const createSessionMutation = useCreateSession();

    const {
        data: activeSessionsData,
        isLoading: isLoadingActiveSessions,
    } = useActiveSessions();

    const {
        data: recentSessionsData,
        isLoading: isLoadingRecentSessions,
    } = useRecentSessions();

    const activeSessions: Session[] = activeSessionsData ?? [];
    const recentSessions: Session[] = recentSessionsData ?? [];

    const handleCreateRoom = () => {
        if (!roomConfig.problem || !roomConfig.difficulty) return;

        createSessionMutation.mutate(
            {
                problem: roomConfig.problem,
                difficulty: roomConfig.difficulty, // already "easy" | "medium" | "hard"
            },
            {
                onSuccess: (data) => {
                    setShowCreateModal(false);
                    navigate(`/session/${data.session._id}`);
                },
            }
        );
    };

    const isUserInSession = (session: Session): boolean => {
        const clerkId = user?.id;
        if (!clerkId) return false;

        return (
            session.host?.clerkId === clerkId ||
            session.participant?.clerkId === clerkId
        );
    };

    return (
        <>
            <div className="min-h-screen bg-base-300">
                <Navbar />

                <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

                {/* GRID LAYOUT */}
                <div className="container mx-auto px-6 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <StatsCards
                            activeSessionsCount={activeSessions.length}
                            recentSessionsCount={recentSessions.length}
                        />
                        <ActiveSessions
                            sessions={activeSessions}
                            isLoading={isLoadingActiveSessions}
                            isUserInSession={isUserInSession}
                        />
                    </div>

                    <RecentSessions sessions={recentSessions} isLoading={isLoadingRecentSessions} />
                </div>
            </div>

            <CreateSessionModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                roomConfig={roomConfig}
                setRoomConfig={setRoomConfig}
                onCreateRoom={handleCreateRoom}
                isCreating={createSessionMutation.isPending}
            />
        </>
    );
};

export default Dashboard;