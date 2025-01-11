// @ts-nocheck

import dynamic from 'next/dynamic';
import { IconBaseProps } from 'react-icons/lib';
import Loader from '../loader/Loader';

interface typesPropsIcon {
  nameIcon: string;
  propsIcon?: IconBaseProps;
}

export function ReactIcon({ nameIcon, propsIcon }: typesPropsIcon): JSX.Element {
  const [lib, name] = nameIcon.split('/');
  let Icon;

  switch (lib) {
    case 'ai':
      Icon = dynamic(() => import('react-icons/ai').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'bi':
      Icon = dynamic(() => import('react-icons/bi').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'bs':
      Icon = dynamic(() => import('react-icons/bs').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'cg':
      Icon = dynamic(() => import('react-icons/cg').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'ci':
      Icon = dynamic(() => import('react-icons/ci').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'di':
      Icon = dynamic(() => import('react-icons/di').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'fa':
      Icon = dynamic(() => import('react-icons/fa').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
    case 'fa6':
      Icon = dynamic(() => import('react-icons/fa6').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'fc':
      Icon = dynamic(() => import('react-icons/fc').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'fi':
      Icon = dynamic(() => import('react-icons/fi').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'gi':
      Icon = dynamic(() => import('react-icons/gi').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'go':
      Icon = dynamic(() => import('react-icons/go').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'gr':
      Icon = dynamic(() => import('react-icons/gr').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'hi':
      Icon = dynamic(() => import('react-icons/hi').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'hi2':
      Icon = dynamic(() => import('react-icons/hi2').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'im':
      Icon = dynamic(() => import('react-icons/im').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'io':
      Icon = dynamic(() => import('react-icons/io').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'io5':
      Icon = dynamic(() => import('react-icons/io5').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'lia':
      Icon = dynamic(() => import('react-icons/lia').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'lu':
      Icon = dynamic(() => import('react-icons/lu').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'md':
      Icon = dynamic(() => import('react-icons/md').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'pi':
      Icon = dynamic(() => import('react-icons/pi').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'ri':
      Icon = dynamic(() => import('react-icons/ri').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'rx':
      Icon = dynamic(() => import('react-icons/rx').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'si':
      Icon = dynamic(() => import('react-icons/si').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'sl':
      Icon = dynamic(() => import('react-icons/sl').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'tb':
      Icon = dynamic(() => import('react-icons/tb').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'tfi':
      Icon = dynamic(() => import('react-icons/tfi').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'ti':
      Icon = dynamic(() => import('react-icons/ti').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'vsc':
      Icon = dynamic(() => import('react-icons/vsc').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    case 'wi':
      Icon = dynamic(() => import('react-icons/wi').then((icons) => icons[name]), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
      break;
    default:
      console.error('icon not found');
      Icon = dynamic(() => import('react-icons/fa').then((icons) => icons.FaCircle), {
        loading: () => <span className="text-white">ㅁ</span>,
      });
  }

  return <Icon {...propsIcon} />;
}
