/**
 * FBChat component.
 */
import React from 'react';

class FBChat extends React.PureComponent {

  render() {
    const fbChatHtml = `<div class="fb-customerchat"
                      attribution=setup_tool
                      page_id="151321802225149"
                      theme_color="#3291fa"
                      greeting_dialog_display="show"
                      greeting_dialog_delay="10"
                      logged_in_greeting="Hi! I'm Hoa, recruiter of Autonomous. How can I help you? Please let me know!"
                      logged_out_greeting="Hi! I'm Hoa, recruiter of Autonomous. How can I help you? Please let me know!"
                      ></div>`;

    return <div key={Date()} dangerouslySetInnerHTML={{__html: fbChatHtml}} />;
  }
}

export default FBChat;
