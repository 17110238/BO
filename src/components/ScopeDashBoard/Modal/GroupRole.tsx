import { t } from 'i18next';
import { Role } from 'models/role/listRole';
import { FC, useEffect, useRef, useState } from 'react';

interface RoleProps {
  roleList?: string[];
  editScopeGroup?: (data: any) => void;
  rolesData?: [Role];
  addScopeGroupItem: (data: any) => void;
}

const GroupRole: FC<RoleProps> = ({ roleList, editScopeGroup, rolesData, addScopeGroupItem }) => {
  const [showRoleList, setShowRoleList] = useState<boolean>(false);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setShowRoleList(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [roleRef]);

  const handleRenderGroupList = () => {
    if (roleList) {
      return roleList.map((role, index) => (
        <div key={index} className='group-item'>
          <p>{role}</p>
          <div
            onClick={() => editScopeGroup && editScopeGroup(role)}
            className='group-item-remove-wrap'>
            <img src='/assets/icon/remove_circle_outline.svg' alt='remove' />
          </div>
        </div>
      ));
    }
  };

  const handleRenderRoleList = () => {
    if (rolesData) {
      return rolesData.map((role, index) => {
        return (
          <div
            onClick={() => addScopeGroupItem(role.key)}
            key={index}
            className={`role-item ${roleList && roleList.includes(role.key) ? 'disabled' : ''}`}>
            {role.name}
          </div>
        );
      });
    }
  };

  return (
    <div className='group-container'>
      <div className='group-list-wrap'>
        {handleRenderGroupList()}
        <div className='group-add-wrap'>
          <img
            onClick={() => setShowRoleList(true)}
            src='/assets/icon/add_circle_outline.svg'
            alt='add'
          />
          {showRoleList && (
            <div ref={roleRef} className='role-list-wrap'>
              {handleRenderRoleList()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupRole;
