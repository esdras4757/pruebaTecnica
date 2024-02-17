import React, { useState } from 'react'
import styled from 'styled-components'
import { articleInterface } from '../Types/appTypes'
import { Alert } from '@mui/material'
import { ApiConstants } from '../utils/constants/ApiConstants'
import { useApi } from '@/customHooks/useApi'
import SaveArticle from './SaveArticle'
import { message } from 'antd'
import DraweEditArticle from './DraweEditArticle'
import { useRouter } from 'next/navigation'
interface propsInterface {
    article: articleInterface
    isOffline?:boolean
    onSuccess?:()=>void
}

const copiarAlPortapapeles = (texto: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed';
    textarea.style.left = '0';
    textarea.style.top = '0';
    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand('copy');

    document.body.removeChild(textarea);
};




const ButonsPack = (props: propsInterface) => {
    const { article, isOffline, onSuccess } = props
    const [loading, setLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const info = (mensage:string) => {
        messageApi.info(mensage);
      };
    const router= useRouter()

    const deleteArticlesFn = async (id: string) => {
        setLoading(true);
        try {
            const response = await useApi(ApiConstants.POST_APP_DELETEARTICLESBYID + '/' + id, 'delete', {});
            if (response) {
                    onSuccess?onSuccess():()=>''
                    router.push('./')
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    return (
        !isOffline?
        <div className='d-flex justify-content-end text-center gap-2'>
        <div onClick={e=>{
            e.preventDefault()
            e.stopPropagation()
        }}>
        <DraweEditArticle onSuccess={onSuccess?onSuccess:()=>''} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} id={article.articleId}/>
        </div>
             {contextHolder}
            <IconContent onClick={(e) => {
                e.stopPropagation()
                setIsDrawerOpen(true)
            }}>
                <i className='fas fa-pencil pointer' />
            </IconContent>
            <SaveArticle article={article} info={info}/>
            <IconContent onClick={e => {
                e.stopPropagation()
                let fullUrl
                if (window.location.pathname == '/detail') {
                    fullUrl = window.location.href ?? ''
                } else {
                    fullUrl = window.location.href + 'detail?id=' + article.articleId ?? ''
                }
                copiarAlPortapapeles(fullUrl ?? '');
                info('Texto copiado al portapapeles')
            }}>
                <i className='fas pointer fa-share' />
            </IconContent>
            <IconContent onClick={e => {
                e.stopPropagation()
                deleteArticlesFn(article?.articleId)
            }}>
                <i className='fas pointer fa-trash' />
            </IconContent>
        </div>:
        <div className='d-flex justify-content-end text-center gap-2'>
        <SaveArticle article={article} info={info}/>
        </div>
    )
}

export default ButonsPack
const IconContent = styled.div`
background-color: gray;
padding: 10px;
border-radius: 100px;
width: 40px;
height: 40px;
cursor: pointer;
color: white;
`