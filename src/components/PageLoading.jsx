import React from 'react';

function PageLoading({classNames}) {

    const isClassNames = classNames ? classNames : ""

  return (
    <div className={`site-preloader ${isClassNames}`}>
    </div>
  )
}

export default PageLoading
