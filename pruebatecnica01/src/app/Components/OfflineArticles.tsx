import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ArticleResume from './ArticleResume';
import { articleInterface } from '../Types/appTypes';
import { isEmpty, isNil } from 'lodash';
import ErrorPlaceHolder from '../placeholders/ErrorPlaceHolder';
import NoDataPlaceholder from '../placeholders/NoDataPlaceholder';
import localforage from 'localforage';
import { Spin } from 'antd';

const OfflineArticles = () => {
  const [data, setData] = useState<null | articleInterface[]>(null);
  const [loading, setLoading] = useState(false);
  const [errorData, setErrorData] = useState(false);

  useEffect(() => {
    getAllArticlesFn();
  }, []);

  const getAllArticlesFn = async () => {
    setData(null);
    setLoading(true);
    setErrorData(false);
    try {
      // Obtén los artículos desde localforage
      const storedArticles:articleInterface[]|null = await localforage.getItem('storedArticles')

      if (storedArticles) {
        setData(storedArticles);
      }
    } catch (error) {
      setErrorData(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      {isNil(data) === true && loading === false && errorData === true && (
        <div className='col-8 m-auto pt-5'>
          <ErrorPlaceHolder />
        </div>
      )}


      {isNil(data) === true && loading === true && errorData === false && (
        <div className='col-12 d-flex justify-content-center'>
          <Spin className='pt-5 mt-5' size='large' />
        </div>
      )}

      {isNil(data) === false && isEmpty(data) === false && loading === false && errorData === false && (
        <>
          <RecentsContainer >
            <h4>Offline</h4>
            {data?.map((element: articleInterface) => (
              <ArticleResume key={element.articleId} article={element} />
            ))}
          </RecentsContainer>
        </>
      )}
    </>
  );
};

export default OfflineArticles;

const RecentsContainer = styled.div`
  max-height: 35vh;
  padding: 0px 20px;
  overflow: auto;
`;
