const urlBase = process.env.URLTOBACK || 'http://localhost:5500'

export const ApiConstants={
    POST_APP_GETALLARTICLES:`${urlBase}/api/articles/`,
    POST_APP_ADDARTICLES:`${urlBase}/api/articles/add`,
    POST_APP_GETRECENTS:`${urlBase}/api/articles/recents`,
    POST_APP_GETARTICLESBYID:`${urlBase}/api/articles/getArticleById`,
    POST_APP_DELETEARTICLESBYID:`${urlBase}/api/articles/deleteArticle`,
    POST_APP_UPDATEARTICLESBYID:`${urlBase}/api/articles/update`,
}
