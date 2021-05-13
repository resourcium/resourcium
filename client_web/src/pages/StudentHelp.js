import React, { useMemo } from 'react';
import Tabs from 'src/components/Tabs';
import MSLearnContainer from 'src/components/Embeds/MSLearnContainer';
import LinkedinLearningContainer from 'src/components/Embeds/LinkedinLearningContainer';
import Chatbotv1 from 'src/components/Embeds/Chatbot';
import { QNA_BOT_TOKEN } from 'src/common/config';

function StudentHelpTabs() {
    const tabs = useMemo(() => {
        const MSLearn = {
            content: <MSLearnContainer />,
            label: 'Microsoft Learn',
        };

        const LinkedinLearning = {
            content: <LinkedinLearningContainer />,
            label: 'Linkedin Learning',
        };

        const Chatbot = QNA_BOT_TOKEN ? {
            content: <Chatbotv1 />,
            label: 'QnABot V1',
        } : null;
        return { MSLearn, LinkedinLearning, Chatbot };
    }, []);

    return <Tabs tabs={tabs} />;
}

export default function StudentHelp() {
    return (
        <>
            <div className="StudentHelp page">
                <h2>Student Help page</h2>
                <StudentHelpTabs />
            </div>
        </>
    );
}
