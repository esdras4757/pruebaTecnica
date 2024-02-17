import { Chip } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import styled from 'styled-components'
import { articleInterface } from '../Types/appTypes'
import QuillHtmlRenderer from './QuillHtmlRenderer';
import ButonsPack from './ButonsPack'

interface propsInterface {
    article: articleInterface
    isOffline?:boolean
    onSuccess:()=>void
}

const Article = (props: propsInterface) => {
    const [showDetail, setShowDetail] = useState(false)
    const { article, isOffline=false,onSuccess} = props
    const router = useRouter()
    const redirect=(id:string)=>{
        if (isOffline) {
            setShowDetail(true)
        }
        else{
            router.push(`/detail?id=${id}`)

        }
    }
    return (
        <ArticleContainer >
            <img
                className='col-12 col-md-2 m-auto pointer'
                onClick={() => redirect(article.articleId)}
                src={article?.imageUrl !== '' && article.imageUrl ? article.imageUrl : '/images/imgPlaceholder.jpg'}
                alt={article.title}
            />
            <div className='col-12 col-md-9 my-2 p-0 p-md-3 pt-2 pointer pt-md-0' onClick={() => redirect(article.articleId)}>
                <div className='d-flex align-content-center align-items-center'>
                    <h3 className='m-0'>{article.title}</h3><span className='ms-2 text-secondary'>{article.publicationDate}</span>
                </div>
                <span className='text-secondary'>{article?.author}</span>
                <div className='mt-1'>
                    {article.content && (
                        <QuillHtmlRenderer htmlString={article.content} />
                    )}
                </div>
                <div style={{position:'absolute', bottom:15, right:10}}>
                <ButonsPack isOffline={isOffline} onSuccess={onSuccess} article={article}/>
                </div>
                <div className='col-12 d-flex column-gap-2 row-gap-1' style={{ flexWrap: 'wrap' }}>
                        {/* <Chip label="Chip Filled" />
                        <Chip label="Chip Filled" />
                        <Chip label="Chip Filled" />
                        <Chip label="Chip Filled" /> */}
                </div>
             
            </div>

        </ArticleContainer>
    )
}

export default Article
const ArticleContainer = styled.div`
flex-wrap: wrap;
position: relative;
margin: auto;
padding: 18px 0px;
border-bottom: 1px solid #848484;
display: flex;
justify-content: space-between;
align-items: center;
justify-items: center;
img{
    max-height: 500px;
    border-radius: 10px;
    max-width: 300px;
    margin: 3px 0px;
}
span{
    font-size: 12px;
}
h3{
    font-size: 20px;
}
p{
    font-size: 14px;
}


`