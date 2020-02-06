import React from 'react';
import PropTypes from 'prop-types';

const CallToAction = ({ link, text }) => (
  <div className="call-to-action__wrapper">
    <a href={link} className="call-to-action__content">{text}</a>
    <div className="call-to-action__shadow" />
  </div>
);

CallToAction.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default CallToAction;
