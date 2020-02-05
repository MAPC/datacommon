import React from 'react';
import PropTypes from 'prop-types';

const CallToAction = ({ link, text }) => (
  <div className="cta__wrapper">
    <a href={link} className="cta__content">{text}</a>
    <div className="cta__shadow" />
  </div>
);

CallToAction.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default CallToAction;
