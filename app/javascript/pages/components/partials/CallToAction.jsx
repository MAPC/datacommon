import React from 'react';
import PropTypes from 'prop-types';

const CallToAction = ({ link, text, extraClassNames }) => (
  <div className={`call-to-action__wrapper ${extraClassNames}`}>
    <a href={link} className="call-to-action__content">{text}</a>
    <div className="call-to-action__shadow" />
  </div>
);

CallToAction.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  extraClassNames: PropTypes.string,
};

CallToAction.defaultProps = {
  extraClassNames: '',
};

export default CallToAction;
