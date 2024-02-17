import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Article from './Article'
import ArticleResume from './ArticleResume'
import { articleInterface } from '../Types/appTypes'
import { isEmpty, isNil } from 'lodash'
import ErrorPlaceHolder from '../placeholders/ErrorPlaceHolder'
import NoDataPlaceholder from '../placeholders/NoDataPlaceholder'
import { ApiConstants } from '../utils/constants/ApiConstants'
import { useApi } from '@/customHooks/useApi'
import { Spin } from 'antd'
import OfflineArticles from './OfflineArticles'
import { useRouter } from 'next/navigation'
interface interfaceProps {
  data: articleInterface[]
  loading?: boolean
  errorData?: boolean
}

const Recents = () => {
  const [data, setData] = useState<null | articleInterface[]>(null)
  const [loading, setLoading] = useState(false)
  const [errorData, setErrorData] = useState(false)
  const router=useRouter()
  useEffect(() => {
    getAllArticlesFn();
  }, []);

  const getAllArticlesFn = async () => {
    setData(null);
    setLoading(true);
    setErrorData(false);
    try {
      const response = await useApi(ApiConstants.POST_APP_GETRECENTS, 'post', {});
      if (response && response.data && response.data.articles) {
        setData(response.data.articles);
      }
    } catch (error) {
      setErrorData(true);
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
      {isNil(data) === true && loading === false && errorData === true && <div className='col-8 m-auto pt-3 mb-3'>
        <ErrorPlaceHolder />
      </div>}

      {isNil(data) === false && isEmpty(data) === true && loading === false && errorData === false &&
        <div className='col-8 m-auto pt-3 mb-3'>
          <NoDataPlaceholder />
        </div>
      }
      {isNil(data) === true && loading === true && errorData === false && (
        <div className='col-12 d-flex justify-content-center'>
          <Spin className='pt-5 mt-5' size='large' />
        </div>
      )}

      {isNil(data) === false && isEmpty(data) === false && loading === false && errorData === false && (
        <>
          <RecentsContainer>
            <h4>
              Recientes
            </h4>
            {data?.map((element: articleInterface) => (
              <div key={element.articleId} className='pointer' onClick={e=>{router.push(`/detail?id=${element.articleId}`)}}>
              <ArticleResume key={element.articleId} article={element} />
              </div>
            ))}
            <hr />
          </RecentsContainer>

        </>
      )}
    </>

  )
}

export default Recents

const RecentsContainer = styled.div`
max-height: 100vh;
padding: 0px 20px;
overflow: hidden;
`