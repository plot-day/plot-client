// @ts-nocheck

import dynamic from 'next/dynamic';
import { IconBaseProps } from 'react-icons/lib';

interface typesPropsIcon {
  nameIcon: string;
  propsIcon?: IconBaseProps;
}

export function ReactIcon({ nameIcon, propsIcon }: typesPropsIcon): JSX.Element {
  const [lib, name] = nameIcon.split('/');
  let Icon;

  switch (lib) {
    case 'ai':
      Icon = dynamic(() => import('react-icons/ai').then((icons) => icons[name]));
      break;
    case 'bi':
      Icon = dynamic(() => import('react-icons/bi').then((icons) => icons[name]));
      break;
    case 'bs':
      Icon = dynamic(() => import('react-icons/bs').then((icons) => icons[name]));
      break;
    case 'cg':
      Icon = dynamic(() => import('react-icons/cg').then((icons) => icons[name]));
      break;
    case 'ci':
      Icon = dynamic(() => import('react-icons/ci').then((icons) => icons[name]));
      break;
    case 'di':
      Icon = dynamic(() => import('react-icons/di').then((icons) => icons[name]));
      break;
    case 'fa':
      Icon = dynamic(() => import('react-icons/fa').then((icons) => icons[name]));
    case 'fa6':
      Icon = dynamic(() => import('react-icons/fa6').then((icons) => icons[name]));
      break;
    case 'fc':
      Icon = dynamic(() => import('react-icons/fc').then((icons) => icons[name]));
      break;
    case 'fi':
      Icon = dynamic(() => import('react-icons/fi').then((icons) => icons[name]));
      break;
    case 'gi':
      Icon = dynamic(() => import('react-icons/gi').then((icons) => icons[name]));
      break;
    case 'go':
      Icon = dynamic(() => import('react-icons/go').then((icons) => icons[name]));
      break;
    case 'gr':
      Icon = dynamic(() => import('react-icons/gr').then((icons) => icons[name]));
      break;
    case 'hi':
      Icon = dynamic(() => import('react-icons/hi').then((icons) => icons[name]));
      break;
    case 'hi2':
      Icon = dynamic(() => import('react-icons/hi2').then((icons) => icons[name]));
      break;
    case 'im':
      Icon = dynamic(() => import('react-icons/im').then((icons) => icons[name]));
      break;
    case 'io':
      Icon = dynamic(() => import('react-icons/io').then((icons) => icons[name]));
      break;
    case 'io5':
      Icon = dynamic(() => import('react-icons/io5').then((icons) => icons[name]));
      break;
    case 'lia':
      Icon = dynamic(() => import('react-icons/lia').then((icons) => icons[name]));
      break;
    case 'lu':
      Icon = dynamic(() => import('react-icons/lu').then((icons) => icons[name]));
      break;
    case 'md':
      Icon = dynamic(() => import('react-icons/md').then((icons) => icons[name]));
      break;
    case 'pi':
      Icon = dynamic(() => import('react-icons/pi').then((icons) => icons[name]));
      break;
    case 'ri':
      Icon = dynamic(() => import('react-icons/ri').then((icons) => icons[name]));
      break;
    case 'rx':
      Icon = dynamic(() => import('react-icons/rx').then((icons) => icons[name]));
      break;
    case 'si':
      Icon = dynamic(() => import('react-icons/si').then((icons) => icons[name]));
      break;
    case 'sl':
      Icon = dynamic(() => import('react-icons/sl').then((icons) => icons[name]));
      break;
    case 'tb':
      Icon = dynamic(() => import('react-icons/tb').then((icons) => icons[name]));
      break;
    case 'tfi':
      Icon = dynamic(() => import('react-icons/tfi').then((icons) => icons[name]));
      break;
    case 'ti':
      Icon = dynamic(() => import('react-icons/ti').then((icons) => icons[name]));
      break;
    case 'vsc':
      Icon = dynamic(() => import('react-icons/vsc').then((icons) => icons[name]));
      break;
    case 'wi':
      Icon = dynamic(() => import('react-icons/wi').then((icons) => icons[name]));
      break;
    default:
      console.log('icon not found');
      Icon = dynamic(() => import('react-icons/fa').then((icons) => icons.FaCircle));
  }

  return <Icon {...propsIcon} />;
}
