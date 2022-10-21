import React, { useState } from 'react';
// import { DndProvider } from 'react-dnd';
// import { Tree, NodeModel, MultiBackend, getBackendOptions } from '@minoru/react-dnd-treeview';
import { CustomData } from './types';
import { CustomNode } from './CustomNode';
import { Placeholder } from './Placeholder';
import styles from './App.module.css';
import SampleData from './sample.data.json';
import { CustomDragPreview } from './CustomDragPreview';
import { useTranslation } from 'react-i18next';

// const index = () => {
//
//   const handleAddMenuItems = () => {
//     console.log('123123');
//   };

//   const handleAddModuleItems = () => {
//     console.log('44444');
//   };

//   return (
//     <div className='custom-menu-container'>
//       {/* <AddMenu />
//       <AddModule/> */}
//       <div className='custom-menu-contain'>
//         <h3 className='p-3 border-bottom'>{t('Custom dashboard')}</h3>
//         <DndProvider backend={MultiBackend} options={getBackendOptions()}>
//           <div className='row p-3'>
//             <div className='col-4 flex-column'>
//               <h5 className='add-menu-items' onClick={() => handleAddMenuItems()}>
//                 {t('Danh sách Module')}
//               </h5>
//               <ul className='limiet'>
//                 <li></li>
//               </ul>
//             </div>
//             <div className='col-8 flex-column'>
//               <h5 className='add-menu-items' onClick={() => handleAddModuleItems()}>
//                 {t('Danh sách Menu')}
//                 <i className='fa fa-plus icon-plus ml-3' title={t('Thêm menu')}></i>
//               </h5>
//               <ul className='limiet'>
//                 <li></li>
//               </ul>
//             </div>
//           </div>
//         </DndProvider>
//       </div>
//     </div>
//   );
// };

// export default index;

function index() {
  const { t } = useTranslation('common');
  // const [treeData, setTreeData] = useState<NodeModel<CustomData>[]>(SampleData);
  // const handleDrop = (newTree: NodeModel<CustomData>[]) => setTreeData(newTree);

  return (
    <div className='custom-menu-container'>
      <div className='custom-menu-contain mb-2'>
        <h3 className='py-3 border-bottom'>{t('Custom dashboard')}</h3>
      </div>
      <div className='list-group-header '>
        <div>
          <h4> Modules </h4>
        </div>
        <div className='d-flex align-center'>
          <h4 className='menus-title'>
            {' '}
            Menus <i className='fa fa-plus icon-plus ml-2' aria-hidden='true'></i>
          </h4>
        </div>
      </div>
      {/* <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className={styles.app}>
          <Tree
            tree={treeData}
            rootId={0}
            render={(node, { depth, isOpen, onToggle }) => (
              <CustomNode node={node} depth={depth} isOpen={isOpen} onToggle={onToggle} />
            )}
            dragPreviewRender={(monitorProps) => <CustomDragPreview monitorProps={monitorProps} />}
            onDrop={handleDrop}
            classes={{
              root: styles.treeRoot,
              draggingSource: styles.draggingSource,
              placeholder: styles.placeholderContainer,
            }}
            sort={false}
            insertDroppableFirst={false}
            canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
              if (dragSource?.parent === dropTargetId) {
                return true;
              }
            }}
            dropTargetOffset={100}
            placeholderRender={(node, { depth }) => <Placeholder node={node} depth={depth} />}
          />
        </div>
      </DndProvider> */}
    </div>
  );
}

export default index;
