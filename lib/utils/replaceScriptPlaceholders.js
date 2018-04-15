function replaceScript(element) {
  const script = document.createElement('script');
  script.setAttribute('async', element.getAttribute('async'));
  script.setAttribute('defer', element.getAttribute('defer'));
  script.setAttribute('src', element.getAttribute('src'));
  element.appendChild(script);
}

const scriptsToReplace = document.querySelectorAll('script-placeholder');
[].forEach.call(scriptsToReplace, replaceScript);
