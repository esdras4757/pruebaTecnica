import React from 'react';
import Editor from './Editor';

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
    <Editor readOnly={true} onChange={()=>{}} value={complete?htmlString:extractedText}/>
  );
};

export default QuillHtmlRenderer;
