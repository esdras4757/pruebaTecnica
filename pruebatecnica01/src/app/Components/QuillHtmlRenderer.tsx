import React from 'react';

interface QuillHtmlRendererProps {
  htmlString: string | undefined;
  complete?:boolean
}   

const QuillHtmlRenderer: React.FC<QuillHtmlRendererProps> = ({ htmlString, complete=false }) => {

  if (typeof htmlString !== 'string') {
    return null;
  }
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlString;
  let extractedText = tempElement.innerText.slice(0, 70);

  if (extractedText.length>69) {
    extractedText=extractedText+'...'
    }

  return (
    <div>{complete===false?extractedText:tempElement.innerText}</div>
  );
};

export default QuillHtmlRenderer;
