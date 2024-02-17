import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Article from './Article';
import styled from 'styled-components';
import { Button, Spin, Upload, message } from 'antd';
import ErrorPlaceHolder from '../placeholders/ErrorPlaceHolder';
import NoDataPlaceholder from '../placeholders/NoDataPlaceholder';
import { isEmpty, isNil } from 'lodash';
import { articleInterface } from '../Types/appTypes';
import localforage from 'localforage';
import QuillHtmlRenderer from './QuillHtmlRenderer';

type mainProps={
    offlineMode:boolean
    setOfflineMode:Dispatch<SetStateAction<boolean>>
}
const OfflineView = (props:mainProps) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<null | articleInterface[]>(null);
    const [errorData, setErrorData] = useState(false);
    const [detailSelected, setDetailSelected] = useState<null | articleInterface>(null)
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


      if (isNil(detailSelected)===false) {
        return(
                <div style={{ height: '80hv', overflow: 'auto' }}>
                    {isNil(detailSelected) === true && loading === false && errorData === true && <div className='col-8 m-auto pt-5'>
                        <ErrorPlaceHolder />
                    </div>}
                    {isNil(detailSelected) === true && loading === true && errorData === false && (
                        <div className='col-12 d-flex justify-content-center'>
                            <Spin className='pt-5 mt-5' size='large' />
                        </div>
                    )}
        
                    {isNil(detailSelected) === false && isEmpty(detailSelected) === false && loading === false && errorData === false && (
                        <><div className='d-flex justify-content-between mb-2' >
                            <i
                                onClick={() => setDetailSelected(null)}
                                className="col-auto fas fa-chevron-left m-3 fs-3 pointer" style={{ justifySelf: 'start' }}></i>
                            <h2 className='mt-2'>{detailSelected?.title}</h2>
                            <i className="col-auto m-3 fs-3 pointer" style={{ justifySelf: 'start' }}></i>
                        </div>
        
                            <div style={{ overflow: 'auto', height: 'calc(100vh - 120px)' }}>
                                <div className='bg-dark d-flex justify-content-center mb-3'>
                                    <img
                                        className='col-6 col-md-2' style={{ maxHeight: 500 }}
                                        src={detailSelected?.imageUrl !== '' && detailSelected?.imageUrl ? detailSelected.imageUrl : '/images/imgPlaceholder.jpg'}
                                        alt={detailSelected?.title}
        
                                    />
                                </div>
                                <DetailContainer style={{ height: '65%' }}>
                                    <div className='text-center mt-4'>
                                        <div>
                                            {detailSelected?.content && (
                                                <QuillHtmlRenderer complete={true} htmlString={detailSelected.content} />
                                            )}
                                        </div>
                                    </div>
                                </DetailContainer>
                            </div></>)}
        
        
        
                </div>
        )
      }
      else{
    return (
        <BlogContentContainer className='d-flex m-auto px-0 px-md-4'>
            <div className='col-12 pe-0 pe-md-4 br' style={{ position: 'relative' }}>
                <div className='col-12 text-center bold text-danger'>No estas conectado a internet se muestra el contenido descargado</div>

                <div className='pb-5' style={{ overflow: 'auto', height: '82vh' }}>

                    {isNil(data) === true && loading === true && errorData === false && (
                        <div className='col-12 d-flex justify-content-center'>
                            <Spin className='pt-5 mt-5' size='large' />
                        </div>
                    )}

                    {isNil(data) === true && loading === false && errorData === true && <ErrorPlaceHolder />}

                    {isNil(data) === false && isEmpty(data) === true && loading === false && errorData === false && <NoDataPlaceholder />}

                    {isNil(data) === false && isEmpty(data) === false && loading === false && errorData === false && (
                        <>
                            {data?.map((element: articleInterface) => (
                                <div onClick={e=>{setDetailSelected(element)}}>
                                <Article onSuccess={getAllArticlesFn} key={element.articleId} article={element} isOffline={true} />
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

        </BlogContentContainer>
    );}
};

const BlogContentContainer = styled.div`
padding-bottom: 50px;
  @media (min-width: 768px) {
  }
`;

const DetailContainer = styled.div`
padding: 10px 20px;
.content{
    padding: 10px;
    margin: auto;
    text-align: left;
}
`

export default OfflineView;
