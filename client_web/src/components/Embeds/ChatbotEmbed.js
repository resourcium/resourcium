import React, { useMemo } from 'react';
import ReactWebChat, { createDirectLine, createStyleSet } from 'botframework-webchat';
import { QNA_BOT_TOKEN } from 'src/common/config';

export default function ChatbotEmbed(){
    const directLine = useMemo(() => createDirectLine({ token: QNA_BOT_TOKEN }), []);
    const styleSet = useMemo(
        () =>
            createStyleSet({
                backgroundColor: 'grey',
            }),
        []
    );
    return(
        <ReactWebChat directLine={directLine} userID="user" styleSet={styleSet}/>
    );
}
