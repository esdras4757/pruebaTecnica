import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { articleInterface } from '../Types/appTypes'
import { ApiConstants } from '../utils/constants/ApiConstants'
import { useApi } from '@/customHooks/useApi'
import ErrorPlaceHolder from '../placeholders/ErrorPlaceHolder'
import { isEmpty, isNil } from 'lodash'
import NoDataPlaceholder from '../placeholders/NoDataPlaceholder'
import { Spin } from 'antd'
import QuillHtmlRenderer from './QuillHtmlRenderer'
import ButonsPack from './ButonsPack'

interface PropsInterface{
    onSuccess?:()=>void
}


const DetailArticle = (props:PropsInterface) => {
    const {onSuccess} =props
    const [data, setData] = useState<null | articleInterface>(null)
    const [loading, setLoading] = useState(false)
    const [errorData, setErrorData] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [lastid, setLastid] = useState('')


    useEffect(() => {
        const id = searchParams.get('id')
        if (id != '' && id) {
            setLastid(id) 
        }
        else {
            router.push('/')
        }

    }, []);

    useEffect(() => {
        if (isNil(lastid)==false && lastid!='') {
            getAllArticlesFn();

        }
    
    }, [lastid])
    

    const getAllArticlesFn = async () => {
        setData(null);
        setLoading(true);
        setErrorData(false);
        try {
            const response = await useApi(ApiConstants.POST_APP_GETARTICLESBYID + '/' + lastid, 'get', {});
            if (response && response.data) {
                setData(response.data);
            }
        } catch (error) {
            setErrorData(true);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={{ height: '80hv', overflow: 'auto' }}>

            {isNil(data) === true && loading === false && errorData === true && <div className='col-8 m-auto pt-5'>
                <ErrorPlaceHolder />
            </div>}

            {isNil(data) === false && isEmpty(data) === true && loading === false && errorData === false &&
                <div className='col-8 m-auto pt-5'>
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
                <div className='d-flex justify-content-between mb-2' >
                    <i
                        onClick={() => router.push('/')}
                        className="col-auto fas fa-chevron-left m-3 fs-3 pointer" style={{ justifySelf: 'start' }}></i>
                    <h2 className='mt-2'>{data?.title}</h2>
                    <i className="col-auto m-3 fs-3 pointer" style={{ justifySelf: 'start' }}></i>
                </div>

                    <div style={{ overflow: 'auto', height: 'calc(100vh - 120px)' }}>
                        <div className='bg-dark d-flex justify-content-center mb-3'>
                            <img
                                className='col-6 col-md-2' style={{ maxHeight: 500 }}
                                src={data?.imageUrl !== '' && data?.imageUrl ? data.imageUrl : '/images/imgPlaceholder.jpg'}
                                alt={data?.title}

                            />
                        </div>
                        <DetailContainer className='btn-container' style={{ height: '65%' }}>
                           {data&& <ButonsPack onSuccess={getAllArticlesFn} article={data}/>}
                            <div className='text-center mt-4'>
                                <div>
                                    {data?.content && (
                                        <QuillHtmlRenderer complete={true} htmlString={data.content} />
                                    )}
                                </div>
                            </div>
                        </DetailContainer>
                    </div>
                    
                    </>)}



        </div>
    )
}

export default DetailArticle

const DetailContainer = styled.div`
   @media (max-width: 600px) {

        margin-top: 5px !important;
        justify-content: center;
        .container22 {
            justify-content: center !important;
        }
        .IconContent{
            font-size: 14px;
            padding: 6px;
            height: 32px;
            width: 32px;
        }
   }


padding: 10px 20px;
.content{
    padding: 10px;
    margin: auto;
    text-align: left;
}
`
