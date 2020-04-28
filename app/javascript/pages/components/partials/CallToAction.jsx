import React from 'react';
import PropTypes from 'prop-types';

const CallToAction = ({
  link, text, extraClassNames, isDefaultLength,
}) => {
  let contentClasses = 'call-to-action__content';
  let shadowClasses = 'call-to-action__shadow';
  if (isDefaultLength === false) {
    contentClasses = 'call-to-action__content call-to-action__content--long';
    shadowClasses = 'call-to-action__shadow call-to-action__shadow--long';
  }
  return (
    <div className={`call-to-action__wrapper ${extraClassNames}`}>
      <a href={link} className={contentClasses}>{text}</a>
      <div className={shadowClasses} />
    </div>
  );
};

CallToAction.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  extraClassNames: PropTypes.string,
  isDefaultLength: PropTypes.bool,
};

CallToAction.defaultProps = {
  extraClassNames: '',
  isDefaultLength: true,
};

export default CallToAction;
