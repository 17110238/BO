import React from 'react';
// import { NodeModel } from '@minoru/react-dnd-treeview';
import { CustomData } from './types';
import { TypeIcon } from './TypeIcon';
import styles from './CustomNode.module.css';

type Props = {
  node: any;
  depth: number;
  isOpen: boolean;
  onToggle: any;
};

export const CustomNode: React.FC<Props> = (props) => {
  const { droppable, data } = props.node;
  const indent = props.depth * 24;
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  return (
    <div className={`tree-node ${styles.root}`} style={{ paddingInlineStart: indent }}>
      <div className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ''}`}>
        {props?.node?.droppable ? (
          <div onClick={handleToggle}>
            <i className='fa fa-chevron-right mr-2'></i>
          </div>
        ) : (
          ''
        )}
      </div>

      <div>
        <TypeIcon droppable={droppable || false} fileType={data?.fileType} />
      </div>
      <div className={styles.labelGridItem}>{props.node.text}</div>
    </div>

    // <div className='custom-node'>
    //   <div className='node-module'>
    //     <div className={`tree-node ${styles.root}`} style={{ paddingInlineStart: indent }}>
    //       <div className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ''}`}>
    //         {props?.node?.droppable ? (
    //           <div onClick={handleToggle}>
    //             <i className='fa fa-chevron-right mr-2'></i>
    //           </div>
    //         ) : (
    //           ''
    //         )}
    //       </div>
    //       <div>
    //         <TypeIcon droppable={droppable || false} fileType={data?.fileType} />
    //       </div>
    //       <div className={styles.labelGridItem}>{props.node.text}</div>
    //     </div>
    //   </div>

    //   <div className='node-menu'>
    //     <div className={`tree-node ${styles.root}`} style={{ paddingInlineStart: indent }}>
    //       <div className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ''}`}>
    //         {props?.node?.droppable ? (
    //           <div onClick={handleToggle}>
    //             <i className='fa fa-chevron-right mr-2'></i>
    //           </div>
    //         ) : (
    //           ''
    //         )}
    //       </div>
    //       <div>
    //         <TypeIcon droppable={droppable || false} fileType={data?.fileType} />
    //       </div>
    //       <div className={styles.labelGridItem}>{props.node.text}</div>
    //     </div>
    //   </div>
    // </div>
  );
};
