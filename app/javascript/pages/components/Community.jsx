import React from "react";
import CommunitySelector from "../containers/CommunitySelector";

class Community extends React.Component {
  render() {
    return (
      <div className="page-section page-section__map">
        <a name="community-profiles" />
        <CommunitySelector />
      </div>
    );
  }
}

export default Community;
