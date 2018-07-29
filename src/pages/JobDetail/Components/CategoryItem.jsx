import React from 'react';

const CategoryItem = (props) => {
  const { id, active, name, onClick } = props;
  return (
    <div key={id} className={`recruiting-category-item ${active ? 'active' : ''}`} onClick={onClick}>
      {name}
    </div>
  )
}

export default CategoryItem;
