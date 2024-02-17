import { Chip } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { articleInterface } from '../Types/appTypes';
import QuillHtmlRenderer from './QuillHtmlRenderer';
import { useRouter } from 'next/navigation';

interface propsInterface {
  article: articleInterface
}

const ArticleResume = (props:propsInterface) => {
  const { article } = props
  const router= useRouter()
  return (
    <ArticleContainer>
      <div className='m-auto w-100' >
        <div className='d-flex'><h3>{article?.title}</h3>
        <span className='text-secondary ms-2'>{article?.publicationDate}</span>
        </div>
        
        <div> {article.content && (
                        <QuillHtmlRenderer htmlString={article.content} />
                    )}</div>
        <div className='d-flex gap-2' style={{overflow:'auto', width:'100%'}}>
          {/* <Chip label="Chip Filled" />
          <Chip label="Chip Filled" />
          <Chip label="Chip Filled" />
          <Chip label="Chip Filled" /> */}
        </div>
      </div>
    </ArticleContainer>

    
  );
};

export default ArticleResume;

const ArticleContainer = styled.div`
  margin-top: 3px;
  padding: 10px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  word-wrap: break-word;
    width: 100%;
    overflow: hidden;
  span {
    font-size: 11px;
    word-wrap: break-word;
  }

  h3 {
    font-size: 13px;
  }

  p {
    font-size: 12px;
    word-wrap: break-word;
  }
`;
