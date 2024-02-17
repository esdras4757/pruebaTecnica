import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import styled from 'styled-components';
import { articleInterface } from '../Types/appTypes';

interface ArticleSaveButtonProps {
  article: articleInterface;
  info:(value:string)=>void
}

const SaveArticle: React.FC<ArticleSaveButtonProps> = ({ article,info }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      const storedArticles: articleInterface[] = (await localforage.getItem('storedArticles')) || [];
      const existingArticle = storedArticles.find((storedArticle) => storedArticle.articleId === article.articleId);
      setIsSaved(!!existingArticle);
    };

    checkIfSaved();
  }, [article]);

  const handleSaveArticle = async () => {
    try {
      const key = `article_${article.articleId}`;
      const storedArticles: articleInterface[] = (await localforage.getItem('storedArticles')) || [];
      const existingArticle = storedArticles.find((storedArticle) => storedArticle.articleId === article.articleId);

      if (existingArticle) {
        const updatedArticles = storedArticles.filter((storedArticle) => storedArticle.articleId !== article.articleId);
        await localforage.setItem('storedArticles', updatedArticles);
        setIsSaved(false);
        info('Artículo eliminado.');
      } else {
        const imageBlob = await fetch(article.imageUrl).then((response) => response.blob());
        const newArticle = { ...article, imageBlob };
        storedArticles.push(newArticle);

        await localforage.setItem('storedArticles', storedArticles);
        setIsSaved(true);
        info('Artículo guardado, disponible para acceso sin conexión.');
      }
    } catch (error) {
      info('Error al guardar/eliminar el artículo:');
    }
  };

  return (
    <IconContent onClick={(e) => {
      e.stopPropagation();
      handleSaveArticle();
    }}>
      <i className={`fas pointer ${isSaved ? 'fa-times' : 'fa-download'}`} />
    </IconContent>
  );
};

export default SaveArticle;

const IconContent = styled.div`
  background-color: gray;
  padding: 10px;
  border-radius: 100px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: white;
`;
