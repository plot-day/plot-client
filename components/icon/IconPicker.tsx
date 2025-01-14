

import { ReactElement } from 'react';
import ReactIconPicker from 'react-icons-picker-more';

interface IconPickerProps {
  value: string;
  onChange: (v: string) => void;
  modalEmptyContent?: ReactElement;
  searchInputPlaceholder?: string;
}

const IconPicker = (props: IconPickerProps) => {
  return (
    <ReactIconPicker
      {...props}
      modalIconNameStyle={{ display: 'none' }}
      searchBarStyle={{ display: 'flex', alignItems: 'center', padding: '1rem', paddingBottom: '0' }}
      searchInputStyle={{
        width: '100%',
        padding: '0.5rem 0.75rem',
        fontSize: '1rem',
        backgroundColor: 'rgb(243 244 246 / var(--tw-bg-opacity, 1))',
        borderRadius: '0.5rem',
        margin: '0 1rem',
      }}
      modalFadeStyle={{
        position: 'fixed',
        zIndex: '10',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `rgba(0,0,0,0.2)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      modalWrapperStyle={{
        width: '85vw',
        height: '90%',
        backgroundColor: '#fff',
        borderRadius: '1rem',
        boxShadow: `0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 5%), 0px 9px 46px 8px rgb(0 0 0 / 12%)`,
      }}
      modalContentWrapperStyle={{ 
        padding: '1rem',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
      }}
      modalIconsWrapperStyle={{
        display: 'flex',
        flexWrap: 'wrap',
        overflowY: 'scroll',
        boxSizing: 'border-box',
        height: 'fit-content',
        maxHeight: '100%',
      }}
      modalIconsStyle={{
        width: '3.7rem',
        height: '3.7rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.3rem',
        cursor: 'pointer',
        transition: '0.3 ease',
        boxSizing: 'border-box',
      }}
      pickButtonStyle={{
        backgroundColor: 'rgb(243 244 246 / var(--tw-bg-opacity, 1))',
        borderRadius: '9999px',
        width: '2rem',
        height: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

export default IconPicker;
