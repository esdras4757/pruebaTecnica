import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { FiltersNamesType } from '../Types/appTypes';

interface FiltersProps {
  filtersNames: FiltersNamesType;
  getAllArticlesFn: () => void
}
const Filters = (props: FiltersProps) => {



  
  const [editFilters, setEditFilters] = useState<any>({});
  const { filtersNames, getAllArticlesFn } = props;
  const [allLine, setAllLine] = useState(true);
 

  useEffect(() => {
    // Verificar si ya hay datos guardados en el localStorage
    const savedEditValues = localStorage.getItem('editvalues');
    if (savedEditValues) {
      setEditFilters(JSON.parse(savedEditValues));
    } else {
      // Si no hay datos, establecer condiciones iniciales con valores de cadena vacíos
      const initialFilters: any = {};
      filtersNames.forEach((element) => {
        if (element && element.id) {
          initialFilters[element.id] = {
            conditions: {
              value: '',
              name: element.id,
            },
          };
        }
      });
      setEditFilters(initialFilters);
      localStorage.setItem('editvalues', JSON.stringify(initialFilters));
    }
  }, [filtersNames]);

  const updateFilters = (name: string, newValue: string) => {
    setEditFilters((prev: any) => {
      // Copia profunda manual utilizando JSON.parse y JSON.stringify
      const newFilters = JSON.parse(JSON.stringify(prev));

      newFilters[name] = {
        conditions: {
          value: newValue,
          name: name,
        },
      };

      localStorage.setItem('editvalues', JSON.stringify(newFilters));
      return newFilters;
    });
  };

  const resetFilters = () => {
    const initialFilters: any = {};
      filtersNames.forEach((element) => {
        if (element && element.id) {
          initialFilters[element.id] = {
            conditions: {
              value: '',
              name: element.id,
            },
          };
        }
      });
      localStorage.setItem('editvalues', JSON.stringify(initialFilters));
      setEditFilters(initialFilters);
      getAllArticlesFn()
  }

  return (
    <div className='col-12 mb-4'>
      {  (
        <div className='d-flex justify-content-center justify-content-md-between w-100 mt-3' style={{ overflow: 'hidden', flexWrap: 'wrap' }}>

          <div className='col-12 d-flex fs-5 justify-content-between pe-1'>
            <div>
              <i className='fas fa-filter me-1'></i><span className='me-3'>Filtros</span>
            </div>
            <div>
            <i title={allLine ? 'Ocultar filtros' : 'Mostrar filtros'} onClick={e => setAllLine(!allLine)} style={{ backgroundColor: '#7B3CCC', borderRadius: 100, padding: 5 }} className={`fas text-white cursor-pointer fa-eye${allLine ? '-slash' : ''} `}></i>
              <i title='Buscar' onClick={e => {
                getAllArticlesFn()
              }} style={{ backgroundColor: 'blue', borderRadius: 100, padding: 5 }} className='fas text-white pointer fa-magnifying-glass mx-2'></i>
              <i title='Restablecer filtros' onClick={e=>{resetFilters()}} style={{ backgroundColor: '#00CCB2', borderRadius: 100, padding: 5 }} className='fas text-white pointer fa-rotate-left me-1 mr-3'></i>
            </div>
          </div>
          {allLine && filtersNames.slice(0, 4).map((element) => (
            <div className='col-md-3 col-12' key={element?.id}>
              <TextField
                className='col-12'
                value={editFilters[element?.id]?.conditions?.value ?? ''}
                onChange={(e) => {
                  updateFilters(element?.id || '', e.target.value);
                }}
                onKeyDown={e => {
                  if (e.key == 'Enter') {
                    getAllArticlesFn()
                  }
                }}
                id='standard-basic'
                label={element?.name || ''}
                variant='standard'
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filters;
